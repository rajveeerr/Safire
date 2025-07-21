export class ExtensionStateManager {
  private static STORAGE_KEY = 'extensionEnabled';

  static async setEnabled(enabled: boolean) {
    await chrome.storage.local.set({ [this.STORAGE_KEY]: enabled });
    
    if (!enabled) {
      await this.removeContentScripts();
      await this.notifyTabs();
    } else {
      // Re-register content scripts before reloading tabs
      await this.injectContentScripts();
      await this.reloadMatchingTabs();
    }
  }

  static async isEnabled(): Promise<boolean> {
    const result = await chrome.storage.local.get(this.STORAGE_KEY);
    return result[this.STORAGE_KEY] !== false;
  }

  private static async removeContentScripts() {
    try {
      // Remove all registered content scripts
      await chrome.scripting.unregisterContentScripts();
      
      const tabs = await chrome.tabs.query({
        url: [
          "*://*.linkedin.com/*",
          "*://*.instagram.com/*"
        ]
      });

      for (const tab of tabs) {
        if (tab.id) {
          await chrome.tabs.reload(tab.id);
        }
      }
    } catch (error) {
      console.error('Error removing content scripts:', error);
    }
  }

  private static async reloadMatchingTabs() {
    const tabs = await chrome.tabs.query({
      url: ["*://*.linkedin.com/*", "*://*.instagram.com/*"]
    });
    
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.reload(tab.id);
        } catch (error) {
          console.error(`Error reloading tab ${tab.id}:`, error);
        }
      }
    }
  }

  private static async notifyTabs() {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'CLEANUP_EXTENSION' });
        } catch (error) {
          // Ignore errors for tabs where content script isn't running
        }
      }
    }
  }

  static addStateListener(callback: (enabled: boolean) => void) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[this.STORAGE_KEY]) {
        callback(changes[this.STORAGE_KEY].newValue);
      }
    });
  }

  private static async injectContentScripts() {
    try {
      await chrome.scripting.unregisterContentScripts(); // Clear existing first
      
      await chrome.scripting.registerContentScripts([{
        id: 'safedm-content-script',
        matches: ["*://*.linkedin.com/*", "*://*.instagram.com/*"],
        js: ['content.js'],
        runAt: 'document_start',
        world: 'MAIN'
      }]);
    } catch (error) {
      console.error('Error registering content scripts:', error);
    }
  }
}