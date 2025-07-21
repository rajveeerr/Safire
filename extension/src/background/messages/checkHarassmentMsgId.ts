import type { PlasmoMessaging } from "@plasmohq/messaging"

const UPSTASH_URL = 'https://well-goblin-10590.upstash.io'
const UPSTASH_TOKEN = 'ASleAAIjcDEwZGEyYzAwZDJlN2E0ZjVjYjA3MTE2ZmI5NmI4MzhmZnAxMA'


// Helper function for Upstash requests
const upstashRequest = async (command: string, key: string, value?: any) => {
    const url = `${UPSTASH_URL}/${command}/${key}${value ? `/${JSON.stringify(value)}` : ''}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    return await response.json();
};

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    try {
        const { messageId, userDecodedId, profileId } = req.body;
        if (!userDecodedId || !messageId || !profileId) {
            throw new Error('Missing required parameters');
        }

        const key = `harassment:${userDecodedId}:${profileId}`;

        // First check if the set exists
        const exists = await upstashRequest('exists', key);

        // console.log("exists result", exists)

        // If set doesn't exist, return a special indicator
        if (exists.result === 0) {
            res.send({
                found: 0,
                isNewUser: true
            });
            return;
        }

        // If set exists, check if messageId is a member
        const result = await upstashRequest('sismember', key, messageId);
        res.send({
            found: result.result,
            isNewUser: false
        });
    } catch (error) {
        console.error(`Error in checkMessage handler:`, error);
        res.send({ success: false, error: error.message });
    }
}

export default handler;
