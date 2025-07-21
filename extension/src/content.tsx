import { useEffect, useState } from "react"
import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import { initMessageDetection } from "~hooks/initMsgDetection"
import { getToken } from "~utils/auth"
import decodeToken from "~hooks/decodeToken"

let areMessagesHidden = true


//populate this by calling-> GET: https://harassment-saver-extension.onrender.com/api/v1/user/blacklisted-keywords also the response is {"status":"success","data":{"keywords":["cool","marry","kill","love","date"],"total":5}}, isse populate the absuive words wala array and then it will work fine



export const initializeMessaging = async () => {
  try {
    const token = await getToken();
    if (!token) {
      // console.log("No token available");
      return null;
    }

    const response = await decodeToken(token);
    console.log("userid", response.userId);
    return response.userId || null;
  } catch (error) {
    console.error("Error initializing messaging:", error);
    return null;
  }
};


export const config: PlasmoCSConfig = {
  matches: ["https://www.linkedin.com/*", "https://www.instagram.com/*"]
}

const injectCustomStyles = () => {
  const style = document.createElement("style")
  style.textContent = `
    /* Scoped styles for our injected elements only */
    .harassment-warning-style {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff3f3;
      border: 1px solid #ffcccc;
      padding: 8px 12px;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .warning-text-style {
      color: #d32f2f;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .buttons-container {
      display: flex;
      gap: 8px;
    }

    .show-messages-btn-style,
    .generate-report-btn-style,
    .hide-user-btn-style {
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      transition: background-color 0.3s ease;
    }

    .show-messages-btn-style {
      background-color: #d32f2f;
      color: white;
    }

    .generate-report-btn-style {
      background-color: #1976d2;
      color: white;
    }

    .hide-user-btn-style {
      background-color: #6a6a6a;
      color: white;
    }

    .show-messages-btn-style:hover {
      background-color: #b71c1c;
    }

    .generate-report-btn-style:hover {
      background-color: #1565c0;
    }

    .hide-user-btn-style:hover {
      background-color: #404040;
    }

    .harassment-batch {
      display: inline-block;
      background-color: red;
      color: white;
      font-size: 12px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 12px;
      margin-top: 8px;
      text-transform: uppercase;
    }
  `
  document.head.appendChild(style)
}








// 2 condition - when user has clicked on hide user - check all the messages url 

// when he enters the app - then it will check the first message url

// Function to hide the entire chat if the user is flagged

const getFirstName = () => {
  const firstConversation = document.querySelector('.msg-conversations-container__pillar');
  if (!firstConversation) return null;

  const nameElement = firstConversation.querySelector(
    '.msg-conversation-listitem__participant-names .truncate'
  );

  console.log(nameElement?.textContent?.trim())

  return nameElement?.textContent?.trim() || null;
};



const injectProfileTag = async () => {
  try {
    const profileATag = document.querySelector('a[href*="/overlay/about-this-profile/"]');
    
    if (!profileATag) {
      console.log("Profile link not found");
      return;
    }

    const profileUrl = (profileATag as HTMLAnchorElement).href;
    const trimmedUrl = profileUrl.split('/overlay')[0];
    console.log("Found profile URL:", trimmedUrl);
    
    const profileHeader = profileATag.closest('div');
    
    if (!profileHeader) {
      console.log("Profile header container not found");
      return;
    }

    const name = profileATag.getAttribute('aria-label');
    console.log("Profile name:", name);

    if (trimmedUrl == "https://www.linkedin.com/in/rajveeerr") {
      const existingTag = document.getElementById('profile-tag');
      if (existingTag) existingTag.remove();

      const tagContainer = document.createElement("span");
      tagContainer.id = "profile-tag";
      tagContainer.className = "profile-tag-style";
      tagContainer.style.cssText = "margin-left: 12px; display: inline-flex; align-items: center;";

      const tagContent = document.createElement("span");
      tagContent.style.cssText = `
        background-color: rgb(245, 225, 228);
        color: rgb(74, 2, 15);
        padding: 0.5rem 0.75rem;
        border-radius: 9999px;
        font-size: 1rem;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        letter-spacing: 0.025em;
      `;
      tagContent.textContent = "# Harasser";

      tagContainer.appendChild(tagContent);
      profileHeader.appendChild(tagContainer);
    }
  } catch (error) {
    console.error('Error injecting profile tag:', error);
  }
};

const ContentScript = () => {
  // Track harassment state
  const [hasHarassment, setHasHarassment] = useState(false);

  // Function to check for harassment messages
  // const checkForHarassment = () => {
  //   const chatPreviews = document.querySelectorAll(".msg-s-event-listitem__body");
  //   for (const preview of chatPreviews) {
  //     const messageContainer = preview as HTMLElement;
  //     console.log("msg container",messageContainer.attributes);

  //     const originalMessage = messageContainer.getAttribute('data-original-message');
  //     console.log("originalMessage",originalMessage)
  //     if (originalMessage) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  // Main setup function
  useEffect(() => {
    const setupMessageDetection = async () => {
      try {
        console.log(window.location.href);
        const userId = await initializeMessaging();
        console.log("Initializing message detection with userId:", userId);
        injectProfileTag();

        injectCustomStyles();
        // injectShowButton()
        // await handleHidingUserOnReload();

        // Initial harassment check
        // const initialHarassment = await checkForHarassment();
        // setHasHarassment(initialHarassment);
        // console.log("initialHarassment",initialHarassment)
        // if (initialHarassment) {
        //   injectShowButton();
        // }

        if (window.location.href.includes("/messaging")) {
          initMessageDetection();
        }
      } catch (error) {
        console.error("Error in setupMessageDetection:", error);
      }
    };

    setupMessageDetection();
  }, [window.location.href]);

  // Set up mutation observer to watch for DOM changes
  // useEffect(() => {
  //   // const observerCallback = (mutations: MutationRecord[]) => {
  //   //   const currentHarassment = checkForHarassment();
  //   //   if (currentHarassment !== hasHarassment) {
  //   //     setHasHarassment(currentHarassment);
  //   //     if (currentHarassment) {
  //   //       injectShowButton();
  //   //     }
  //   //   }
  //   // };

  //   // const observer = new MutationObserver(observerCallback);

  //   // Start observing the chat container
  //   // const chatContainer = document.querySelector('.msg-conversations-container__conversations-list');
  //   // if (chatContainer) {
  //   //   observer.observe(chatContainer, {
  //   //     childList: true,
  //   //     subtree: true,
  //   //     attributes: true,
  //   //     attributeFilter: ['data-original-message']
  //   //   });
  //   // }

  //   // Cleanup
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [hasHarassment]);

  return null;
};

export default ContentScript;




// let isProcessing = false;

// const observeMutations = () => {
//   const observer = new MutationObserver(() => {
//     if (isProcessing) return;
//     isProcessing = true;
//     const hasHarassmentMessage = checkForHarassmentMessages();
//     hideAbusiveMessagesPreviewInPopup()
//     hideAbusiveMessagesPreview()
//     hideAbusiveMessagesInbox()
//     handleHidingUserOnReload()
//     // toggleMessages()

//     if (hasHarassmentMessage) {
//       injectShowButton()
//     }
//     requestAnimationFrame(() => {
//       isProcessing = false;
//     });
//   })

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//     attributes: true
//   })

//   observer.takeRecords()
// }
// const ContentScript = () => {
//   useEffect(() => {
//     injectCustomStyles() // Inject our scoped styles
//     injectProfileTag()
//     observeMutations()
//   }, [])

//   return null
// }


// export default ContentScript



//todo - profile tag,msg below hide user and generate report - login to use this (disable button)

// detect api - i removed username why still not working'
// why user id in hide user payload - we are saving name and linkedin profile url for the user which is going to hide


