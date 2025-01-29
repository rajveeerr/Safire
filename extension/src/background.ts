const host = "localhost:3000"

chrome.runtime.onInstalled.addListener(() => {
    console.log("Anti-Harassment Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'capture_screenshot') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            console.log('Captured screenshot:', dataUrl);
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "initiateLogin") {
      chrome.tabs.create({
        url: `http://${host}/auth/sign-in?source=extension`
      });
    }
});