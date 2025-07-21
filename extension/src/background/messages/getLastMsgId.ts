import type { PlasmoMessaging } from "@plasmohq/messaging"

const UPSTASH_URL = 'https://well-goblin-10590.upstash.io'
const UPSTASH_TOKEN = 'ASleAAIjcDEwZGEyYzAwZDJlN2E0ZjVjYjA3MTE2ZmI5NmI4MzhmZnAxMA'


// Helper function for Upstash requests
const upstashRequest = async (command: string, key: string, value?: any) => {
    const url = `${UPSTASH_URL}/${command}/${key}${value ? `/${encodeURIComponent(value)}` : ''}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    return await response.json();
};

// Generate consistent key for Upstash storage
const generateMessageKey = (userDecodedId: string, profileId: string) => {
    return `last_processed_id:${userDecodedId}:${encodeURIComponent(profileId)}`;
};


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        const { userDecodedId, profileId } = req.body;

        if (!profileId) {
            throw new Error("Profile URL is required");
        }

        const messageKey = generateMessageKey(userDecodedId, profileId);
        const messageResult = await upstashRequest('get', messageKey);

        res.send({ messageId: messageResult.result || '' });
    } catch (error) {
        console.error(`Error in ${req.name} handler:`, error);
        res.send({ success: false, error: error.message });
    }
};

export default handler;
