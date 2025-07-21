import type { PlasmoMessaging } from "@plasmohq/messaging"

const UPSTASH_URL = 'https://well-goblin-10590.upstash.io'

const UPSTASH_TOKEN = 'ASleAAIjcDEwZGEyYzAwZDJlN2E0ZjVjYjA3MTE2ZmI5NmI4MzhmZnAxMA'


const upstashRequest = async (command: string, key: string, value?: any) => {
    const url = `${UPSTASH_URL}/${command}/${key}${value ? `/${JSON.stringify(value)}` : ''}`;
    console.log("Upstash URL being called:", url); // Add this debug log
    
    try {
        const response = await fetch(url, {
            headers: { 
                Authorization: `Bearer ${UPSTASH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Upstash request failed:", error);
        throw error;
    }
};

export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log("Background handler received request:", req); // Add this debug log
    
    try {
        const { userDecodedId, profileUrl, profilePicUrl, name } = req.body;
        
        if (!userDecodedId || !profileUrl) {
            throw new Error("Missing required parameters");
        }

        const result = await upstashRequest('set', `hiddenUsers:${userDecodedId}`, {
            profileUrl,
            profilePicUrl,
            name
        });

        console.log("Upstash response:", result); // Add this debug log
        res.send({ success: true, data: result });
    } catch (error) {
        console.error(`Error in ${req.name} handler:`, error);
        res.send({ success: false, error: error.message });
    }
};

export default handler;
