import { hideAbusivePersonChatPreview, hideAbusivePersonInPopup } from "~hooks/hideUser"
import { getToken } from "~utils/auth"

export const handleHidingUserOnReload = async () => {
    try {

        // console.log("checking hidden user from local storage")
        // First check local storage
        chrome.storage.local.get(['hiddenUsers'], (result) => {
            const localHiddenUsers = result.hiddenUsers || [];

            if (localHiddenUsers.length > 0) {
                // console.log('Using locally stored hidden users', localHiddenUsers);
                localHiddenUsers.forEach(user => {
                    // console.log("hidden user", user);
                    hideAbusivePersonChatPreview(user.profileUrl, user.profilePicUrl, user.name);
                    hideAbusivePersonInPopup(user.profilePicUrl, user.name)

                });
            }
        });

        // unhide user
        // chrome.storage.local.get(['hiddenUsers'], (result) => {
        //   const hiddenUsers = result.hiddenUsers || [];
        //   const filteredUsers = hiddenUsers.filter(user => user.profileUrl !== profileUrlToRemove);
        //   chrome.storage.local.set({ hiddenUsers: filteredUsers });
        // });

        // If nothing in local storage, fetch from backend
        const authToken = await getToken();
        if (!authToken) {
            // console.log('No token available, skipping remote fetch');
            return;
        }

        // const response = await sendToBackground({
        //   name: "getHiddenUserFromUpstash",
        //   body: { userId: decodeToken(authToken)?.userId }
        // });

        // const remoteHiddenUsers = response?.data?.data?.hiddenUsers || [];

        // if (remoteHiddenUsers.length > 0) {
        //   // Update local storage with remote data
        //   const formattedUsers = remoteHiddenUsers.map(user => ({
        //     profileUrl: user.profileUrl,
        //     profilePicUrl: user.profilePicture,
        //     name: user.name
        //   }));

        //   // localStorage.setItem('hiddenUsers', JSON.stringify(formattedUsers));

        //   // Apply hiding
        //   formattedUsers.forEach(user => {
        //     hideAbusivePersonChatPreview(user.profileUrl, user.profilePicUrl);
        //   });
        // }

    } catch (error) {
        console.error('Error handling hidden users:', error);
    }
};
