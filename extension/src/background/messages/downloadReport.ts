import type { PlasmoMessaging } from "@plasmohq/messaging"
import axios from "axios"
import { getToken } from "~utils/auth"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { body } = req

    try {
        const cleanedAuthToken = await getToken()
        const response = await axios.get(
            `https://harassment-saver-extension.onrender.com/api/v1/user/view-report/${body.reportId}`,
            {
                responseType: 'arraybuffer',  // Add this line
                headers: {
                    'Authorization': `Bearer ${cleanedAuthToken.trim()}`
                }
            }
        )

        // Convert ArrayBuffer to Base64
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

        res.send({
            success: true,
            data: base64
        })
    } catch (error) {
        console.error("API Error:", error)
        res.send({
            error: error.response?.data?.message || "Detection failed"
        })
    }
}

export default handler