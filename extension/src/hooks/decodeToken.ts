import { sendToBackground } from "@plasmohq/messaging";


const decodeToken = async (token: string) => {
    try {
        const response = await sendToBackground({
            name: "decodeToken",
            body: { token }
        });
        console.log("token in content.tsx", response)
        return response;
    } catch (error) {
        console.error("Error decoding token:", error);
        return { userId: null };
    }
};

export default decodeToken