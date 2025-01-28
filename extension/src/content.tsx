import { useEffect } from "react"
import type { PlasmoCSConfig } from "plasmo"

const abusiveWords = [
  "hate",
  "stupid",
  "ugly",
  "idiot",
  "bitch",
  "fuck off"
]

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


// Function to detect harassment in a message
const detectHarassment = (message: string) => {
  return abusiveWords.some((word) =>
    message.toLowerCase().includes(word.toLowerCase())
  )
}

const cleanMessage = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};


// Function to hide abusive message previews
const hideAbusiveMessagesPreview = () => {
  const chatPreviews = document.querySelectorAll(
    ".msg-conversation-card__message-snippet-container"
  )


  chatPreviews.forEach((preview) => {
    const message = preview.innerHTML || ""

    if (detectHarassment(message)) {
      const messageContainer = preview as HTMLElement;
      if (messageContainer) {
        messageContainer.innerHTML = '<i style="color: red;">Harassment detected in last message</i>';
      }
    }
  })
}

const hideAbusiveMessagesPreviewInPopup = () => {
  console.log("here in popup");
  const chatPreviews = document.querySelectorAll(
    ".msg-overlay-list-bubble__message-snippet-container--narrow-two-line"
  );
  console.log(chatPreviews);

  chatPreviews.forEach((preview) => {
    const message = preview.innerHTML || "";
    console.log(message);
    if (detectHarassment(message)) {
      const messageContainer = preview as HTMLElement;
      if (messageContainer) {
        messageContainer.innerHTML = '<i style="color: red; font-size: 10px;">Harassment detected in last message</i>';
      }
    }
  });
};

let areMessagesHidden = true

//function to hide the messages inside the box
const toggleMessages = () => {
  const chatPreviews = document.querySelectorAll(
    ".msg-s-event-listitem__body"
  );

  const showMessagesBtn = document.getElementById("show-messages-btn");
  areMessagesHidden = !areMessagesHidden;

  chatPreviews.forEach((preview) => {
    const messageContainer = preview as HTMLElement;
    const originalMessage = messageContainer.getAttribute('data-original-message');

    if (originalMessage != null) {
      messageContainer.classList.add('message-processed');

      if (!areMessagesHidden) {
        console.log("Showing original message:", originalMessage);
        const newContent = document.createElement('div');
        newContent.innerHTML = `<i style="color: black; padding: 8px">${originalMessage}</i>`;

        messageContainer.textContent = '';
        messageContainer.appendChild(newContent);
        messageContainer.style.border = "3px dashed orange";
      } else {
        console.log("Showing warning message");
        const warningContent = document.createElement('div');
        warningContent.innerHTML = '<i style="color: red; padding: 8px">Harassment detected in this message</i>';

        messageContainer.textContent = '';
        messageContainer.appendChild(warningContent);
        messageContainer.style.border = "3px dashed red";
      }
    }
  });

  if (showMessagesBtn) {
    showMessagesBtn.innerText = areMessagesHidden ? "Show Messages" : "Hide Messages";
  }
}

const hideAbusiveMessagesInbox = () => {
  const chatPreviews = document.querySelectorAll(
    ".msg-s-event-listitem__body"
  );

  chatPreviews.forEach((preview) => {
    if (preview.classList.contains('message-processed')) {
      return;
    }

    const message = preview.innerHTML || "";
    const cleanedMessage = cleanMessage(message);

    if (detectHarassment(cleanedMessage)) {
      const messageContainer = preview as HTMLElement;
      if (messageContainer) {
        messageContainer.classList.add('message-processed');
        messageContainer.setAttribute('data-original-message', cleanedMessage);

        const warningContent = document.createElement('div');
        warningContent.innerHTML = '<i style="color: red; padding: 8px">Harassment detected in this message</i>';

        messageContainer.textContent = '';
        messageContainer.appendChild(warningContent);
        messageContainer.style.border = "3px dashed red";
      }
    }
  });
}

// Function to hide the entire chat if the user is flagged
const hideAbusivePersonChatPreview = () => {
  const chatPreviews = document.querySelectorAll(
    ".msg-conversation-card__message-snippet"
  )

  chatPreviews.forEach((preview) => {
    const message = preview.innerHTML || ""

    if (detectHarassment(message)) {
      const parentContainer = preview.closest(
        ".scaffold-layout__list-item"
      ) as HTMLElement
      if (parentContainer) {
        parentContainer.style.display = "none"
      }
    }
  })
}

// Function to inject the Block User button
// const injectBlockButton = () => {
//   const profileHeader = document.querySelector(
//     ".msg-conversations-container__convo-item"
//   )

//   if (profileHeader && !document.getElementById("block-user-btn")) {
//     const btn = document.createElement("button")
//     btn.id = "block-user-btn"
//     btn.innerText = "🚫 Block User"
//     btn.classList.add("block-btn-style")
//     btn.onclick = () => alert("User Blocked!")
//     profileHeader.appendChild(btn)
//   }
// }



const injectShowButton = () => {
  const profileHeader = document.querySelector(
    ".msg-s-message-list__typing-indicator-container--without-seen-receipt"
  );

  if (profileHeader && !document.getElementById("harassment-warning")) {
    const warningDiv = document.createElement("div");
    warningDiv.id = "harassment-warning";
    warningDiv.classList.add("harassment-warning-style");

    const warningText = document.createElement("span");
    warningText.innerText = "⚠️ Our AI has detected harassment messages in this conversation. The messages are hidden for your safety.";
    warningText.classList.add("warning-text-style");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const showMessagesBtn = document.createElement("button");
    showMessagesBtn.id = "show-messages-btn";
    showMessagesBtn.innerText = "Show Messages";
    showMessagesBtn.classList.add("show-messages-btn-style");
    showMessagesBtn.onclick = toggleMessages;

    const generateReportBtn = document.createElement("button");
    generateReportBtn.id = "generate-report-btn";
    generateReportBtn.innerText = "Legal Report";
    generateReportBtn.classList.add("generate-report-btn-style");
    generateReportBtn.onclick = () => {
      alert("Generating legal harassment report..."); // Replace with actual report generation logic
    };

    const hideUserBtn = document.createElement("button");
    hideUserBtn.id = "hide-user-btn";
    hideUserBtn.innerText = "Hide User";
    hideUserBtn.classList.add("hide-user-btn-style");
    hideUserBtn.onclick = () => {
      alert("Hiding user..."); // Replace with actual user hiding logic
    };

    buttonsContainer.appendChild(showMessagesBtn);
    buttonsContainer.appendChild(generateReportBtn);
    buttonsContainer.appendChild(hideUserBtn);

    warningDiv.appendChild(warningText);
    warningDiv.appendChild(buttonsContainer);

    profileHeader.appendChild(warningDiv);
  }
}

const injectProfileTag = () => {
  const profileHeader = document.querySelector(
    ".idQWxIWbgQfmzoKxZZEizSgUHHaFLPnzSERog"
  );

  console.log(profileHeader);

  if (!profileHeader) {
    console.log("Profile header element not found");
    return;
  }

  const tagContainer = document.createElement("span");
  tagContainer.id = "profile-tag";
  tagContainer.classList.add("profile-tag-style");
  tagContainer.style.marginLeft = "12px";
  tagContainer.style.display = "inline-flex";
  tagContainer.style.alignItems = "center";

  const tagContent = document.createElement("span");
  tagContent.style.backgroundColor = "rgb(245, 225, 228)";
  tagContent.style.color = "rgb(74, 2, 15)";
  tagContent.style.padding = "0.5rem 0.75rem";
  tagContent.style.borderRadius = "9999px";
  tagContent.style.fontSize = "1rem";
  tagContent.style.fontWeight = "600";
  tagContent.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  tagContent.style.letterSpacing = "0.025em";
  tagContent.innerText = "# Spammer";

  tagContainer.appendChild(tagContent);
  profileHeader.appendChild(tagContainer);
}

const checkForHarassmentMessages = () => {
  const chatPreviews = document.querySelectorAll(
    ".msg-s-event-listitem__body"
  )

  return Array.from(chatPreviews).some((preview) => {
    const message = preview.innerHTML || ""
    return detectHarassment(message)
  })
}



const observeMutations = () => {
  const observer = new MutationObserver(() => {
    const hasHarassmentMessage = checkForHarassmentMessages();
    hideAbusiveMessagesPreviewInPopup()
    hideAbusiveMessagesPreview()
    hideAbusiveMessagesInbox()
    // toggleMessages()

    if (hasHarassmentMessage) {
      injectShowButton()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  })

  observer.takeRecords()
}
const ContentScript = () => {
  useEffect(() => {
    injectCustomStyles() // Inject our scoped styles
    injectProfileTag()
    observeMutations()
  }, [])

  return null
}


export default ContentScript
