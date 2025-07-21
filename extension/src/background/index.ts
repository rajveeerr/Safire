// const host = "dashboard-azure-one.vercel.app"
const host = "safe-dm-dashboard.vercel.app"


chrome.runtime.onInstalled.addListener((details) => {
    console.log("🟦 Extension installed:", details.reason)
})



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("🟦 Received message:", request)
    // console.log("🟦 From sender:", sender)

    try {
        switch (request.action) {

            case "capture_screenshot":
                chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
                    console.log('🟦 Captured screenshot')
                    if (sendResponse) {
                        sendResponse({ success: true, data: dataUrl })
                    }
                })
                break

            case "initiateLogin":
                console.log("🟦 Initiating login...")
                chrome.tabs.create({
                    url: `https://${host}/signin?source=extension`
                }, (tab) => {
                    console.log("🟦 Login tab created:", tab?.id)
                    if (sendResponse) {
                        sendResponse({ success: true, tabId: tab?.id })
                    }
                })
                break

            case "authenticated":
                // console.log("🟦 Received auth token, storing...")
                chrome.storage.local.set({ authToken: request.token }, () => {
                    // console.log('🟦 Token stored successfully')
                    if (sendResponse) {
                        sendResponse({ success: true })
                    }

                    // // Close the login tab if it exists
                    // if (sender.tab?.id) {
                    //     chrome.tabs.remove(sender.tab.id)
                    // }
                })
                break

        
        }
    } catch (error) {
        console.error("🔴 Error in background script:", error)
        if (sendResponse) {
            sendResponse({ success: false, error: error.message })
        }
    }

    return true
})