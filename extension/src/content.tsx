import cssText from "data-text:~style.css"
import { useEffect } from "react"
import '../src/style.css'

const abusiveWords = [
  "hate",
  "stupid",
  "ugly",
  "idiot",
  "bitch",
  "fuck off",
  "nigga",
  "puklit",
  "cuck"
]

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// Function to detect harassment in a message
const detectHarassment = (message: string) => {
  return abusiveWords.some((word) =>
    message.toLowerCase().includes(word.toLowerCase())
  )
}

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

//function to hide the messages inside the box
const hideAbusiveMessagesInbox = () => {
  const chatPreviews = document.querySelectorAll(
    ".msg-s-event-listitem__body"
  )

  chatPreviews.forEach((preview) => {
    const message = preview.innerHTML || ""

    if (detectHarassment(message)) {
      const messageContainer = preview as HTMLElement;
      if (messageContainer) {
        messageContainer.innerHTML = '<i style="color: red; padding: 8px">Harassment detected in this message</i>';
        messageContainer.style.border = "3px dashed red";
      }
    }
  })
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

//function to add UI in message box

const injectShowButton = () => {
  const profileHeader = document.querySelector(
    ".msg-s-message-list__typing-indicator-container--without-seen-receipt"
  )

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
    showMessagesBtn.onclick = () => {
        alert("Messages will be shown!"); // Replace with actual reveal messages logic
    };

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



const observeMutations = () => {
  const observer = new MutationObserver(() => {
    hideAbusiveMessagesPreview()
    // hideAbusivePersonChatPreview()
    hideAbusiveMessagesInbox()
    injectShowButton()
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
    observeMutations()
  }, [])

  return null
}

export default ContentScript
