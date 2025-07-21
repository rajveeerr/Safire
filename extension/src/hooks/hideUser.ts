import { sendToBackground } from "@plasmohq/messaging";
import decodeToken from "./decodeToken";
import { getToken } from "~utils/auth";

const getProfilePicUrl = () => {
    const activeChat = document.querySelector('.msg-conversations-container__convo-item-link--active');
    const profilePicElement = activeChat?.querySelector('.presence-entity__image') as HTMLImageElement;
    console.log("profilePicElement", profilePicElement)
    // Create a mutation observer to watch for src changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const newSrc = profilePicElement.src;
                if (!newSrc.includes('data:image/gif;base64')) {
                    console.log('Actual profile pic URL:', newSrc);
                    return newSrc
                    observer.disconnect();
                }
            }
        });
    });

    // Start observing the image element
    observer.observe(profilePicElement, {
        attributes: true,
        attributeFilter: ['src']
    });


};


export const hideAbusivePersonInPopup = (profilePicUrl: string, name: string) => {
    // Get all chat preview containers
    const chatPreviews = document.querySelectorAll(
        ".msg-overlay-list-bubble__tablet-height"
    );

    chatPreviews.forEach(preview => {
        // Find all conversation containers within each preview
        const conversationContainers = preview.querySelectorAll(
            ".msg-overlay-list-bubble__default-conversation-container"
        );

        conversationContainers.forEach(container => {
            // Find all conversation links
            const conversations = container.querySelectorAll(
                ".msg-conversation-listitem__link"
            );

            conversations.forEach(conversation => {
                // Find the profile image element within the conversation
                const profileEntity = conversation.querySelector(
                    ".msg-selectable-entity__entity"
                );

                const img = profileEntity?.querySelector('img');

                // Check if the image matches the abusive person's details
                if (img?.src === profilePicUrl && img.alt === name) {
                    (conversation as HTMLElement).style.display = 'none';
                }
            });
        });
    });
}


export const hideAbusivePersonChatPreview = (profileUrl: string, profilePicUrl: string, name: string) => {
    // Hide left inbox items

    const conversations = document.querySelectorAll('.msg-conversations-container__pillar');
    conversations.forEach(conversation => {
        const img = conversation.querySelector<HTMLImageElement>('.presence-entity__image');
        // console.log("profile pic url", img.src)
        if (img?.src === profilePicUrl && img.alt == name) {
            (conversation as HTMLElement).style.display = 'none';
        }
    });

    // Hide right chat panel
    const rightPanels = document.querySelectorAll('.scaffold-layout__detail');
    if (rightPanels) {
        rightPanels.forEach(panel => {
            const profileLink = panel.querySelector<HTMLAnchorElement>('a.msg-thread__link-to-profile');
            // console.log("stored profile url", profileUrl)
            // console.log("profile link extracted", profileLink?.href)
            if (profileLink?.href === profileUrl) {
                console.log("right panel con");
                (panel as HTMLElement).style.opacity = '0';
            } else {
                (panel as HTMLElement).style.opacity = '100';
            }
        });
    }
};

const handleHideUser = async () => {
    const harassmentWarning = document.getElementById('harassment-warning');
    const messageListContainer = harassmentWarning.closest('.msg-s-message-list-container');
    const parentContainer = messageListContainer.parentElement;
    const msgTitleBar = parentContainer.querySelector('.msg-title-bar');
    const profileLink = msgTitleBar.querySelector<HTMLAnchorElement>('a.msg-thread__link-to-profile');

    // Extract profile details
    const title = profileLink.title;
    const name = title.split("Open ")[1].split("’s profile")[0];
    const profileUrl = profileLink.href;

    const activeChat = document.querySelector('.msg-conversations-container__convo-item-link--active');
    const profilePicElement = activeChat?.querySelector('.presence-entity__image') as HTMLImageElement;
    console.log("profilePicElement", profilePicElement)
    const profilePicUrl = profilePicElement.src

    console.log("profileUrl", profileUrl);

    // Save to localStorage immediately

    chrome.storage.local.get(['hiddenUsers'], (result) => {
        const hiddenUsers = result.hiddenUsers || [];

        // Check if user already exists
        if (!hiddenUsers.some(user => user.profileUrl === profileUrl)) {
            console.log("pusing profilePicUrl", profilePicUrl)
            hiddenUsers.push({ profileUrl, profilePicUrl, name });

            // Save back to storage
            chrome.storage.local.set({ hiddenUsers });
        }
    });

    // Update UI immediately

    // Send to background after UI update
    const authToken = await getToken();
    if (authToken) {
        try {
            const userDecodedId = decodeToken(authToken);
            await sendToBackground({
                name: "hideUser",
                body: { profileUrl, name, profilePicUrl, platform: "linkedIn", hiddenBy: userDecodedId }
            }).catch(console.error);
            
            // console.log("before sending upstash req")
            // const response = await sendToBackground({
            //     name: "saveHiddenUserToUpstash",
            //     body: { userDecodedId, profileUrl, profilePicUrl, name }
            // });
            // console.log("Background response:", response);


            hideAbusivePersonChatPreview(profileUrl, profilePicUrl, name);
            hideAbusivePersonInPopup(profilePicUrl, name)

            // after saving to upstash remove hidden user itemsfrom local storage

        } catch (error) {
            console.error('Error in background operations:', error);
        }
    }
};

export default handleHideUser;