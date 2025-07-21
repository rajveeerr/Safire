export const updatePreviewUI = (element: HTMLElement) => {
    // Find the message snippet inside the element
    const messageElement = element.querySelector(".msg-conversation-card__message-snippet");

    console.log("Updating preview UI for element:", messageElement);

    try {
        if (!messageElement) {
            console.warn("No message snippet found inside the element.");
            return;
        }

        // Store original message before modifying
        const originalMessage = messageElement.textContent?.trim() || '';
        console.log("previewmsg- ", originalMessage);
        messageElement.setAttribute('data-original-message', originalMessage);

        // Create warning message
        const warningDiv = document.createElement('div');
        warningDiv.innerHTML = '<i style="color: red; font-style: italic;">Harassment detected in last message</i>';

        // Clear and update content
        // messageElement.textContent = '';  // Clear existing message
        // messageElement.appendChild(warningDiv);

        console.log("Preview UI updated successfully");
    } catch (error) {
        console.error("Error updating preview UI:", error);
    }
};
