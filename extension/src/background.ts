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

