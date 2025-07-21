export const generateUniqueIdForInbox = (element: Element) => {
    const mainContainer = element.closest('.msg-s-event-listitem');

    // console.log("data-event-urn direct access:", mainContainer?.getAttribute('data-event-urn'));

    // console.log(mainContainer.attributes);

    // Get the unique URN from the data attribute
    const eventUrn = mainContainer?.getAttribute('data-event-urn');

    if (!eventUrn) {
        throw new Error('Message element is missing data-event-urn attribute');
    }

    // Extract the part after the comma
    const parts = eventUrn.split(',');
    if (parts.length < 2) {
        throw new Error('Invalid URN format');
    }

    // Remove special characters and extract the first 12 characters
    const uniqueId = parts[1].replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

    // console.log("message uniqueId", uniqueId)

    return uniqueId;
}