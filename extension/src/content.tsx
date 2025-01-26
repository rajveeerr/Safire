import cssText from "data-text:~style.css"
import { useEffect } from "react"

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
const injectBlockButton = () => {
  const profileHeader = document.querySelector(
    ".msg-conversations-container__convo-item"
  )

  if (profileHeader && !document.getElementById("block-user-btn")) {
    const btn = document.createElement("button")
    btn.id = "block-user-btn"
    btn.innerText = "🚫 Block User"
    btn.classList.add("block-btn-style")
    btn.onclick = () => alert("User Blocked!")
    profileHeader.appendChild(btn)
  }
}


const observeMutations = () => {
  const observer = new MutationObserver(() => {
    hideAbusiveMessagesPreview()
    // hideAbusivePersonChatPreview()
    injectBlockButton()
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
