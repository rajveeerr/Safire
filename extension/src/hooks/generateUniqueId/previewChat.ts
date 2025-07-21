export const generateUniqueIdForPreview = (element: Element) => {
    try {
        const nameElement = element.querySelector('.msg-conversation-listitem__participant-names .truncate span');
        const name = nameElement ? nameElement.textContent.trim().replace(/\s*,\s*$/, '') : '';

        // Extract timestamp
        const timeElement = element.querySelector('.msg-conversation-listitem__time-stamp');
        const timestamp = timeElement ? timeElement.textContent.trim() : '';

        // Extract message content
        const messageContent = element.querySelector('.msg-conversation-card__message-snippet')?.textContent.trim() || '';

        // Remove the sender's name prefix from message content if present
        const cleanContent = messageContent.replace(/^.*?:\s*/, '');

        // Combine all parts and create a hash
        const combinedString = `${name}-${timestamp}-${cleanContent}`;

        // Create a simple hash of the combined string
        let hash = 0;
        for (let i = 0; i < combinedString.length; i++) {
            const char = combinedString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        // Create final ID combining readable parts with hash
        const readablePart = `${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp.toLowerCase().replace(/\s+/g, '-')}`;
        const finalId = `msg-${readablePart}-${Math.abs(hash).toString(16)}`;

        console.log("preview id", finalId)

        return finalId;
    } catch (error) {
        console.error('Error generating message ID:', error);
        return null;
    }
}