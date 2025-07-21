import type { PlasmoMessaging } from "@plasmohq/messaging"
import axios from "axios"
import { getToken } from "~utils/auth"


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    // console.log("messages from req body", req.body)
    const { body } = req

    console.log("data before generating report", body);

    try {
        const cleanedAuthToken = await getToken()
        console.log("token-before", cleanedAuthToken)
        const response = await axios.post(
            `https://harassment-saver-extension.onrender.com/api/v1/user/generate-report`,
            {

                profilePicUrl: body.profilePicUrl,
                profileUrl: body.profileUrl,
                username: body.username,
                platform: body.platform || "linkedIn",
                timestamp: new Date(),
            },
            {
                headers: {
                    'Authorization': `Bearer ${cleanedAuthToken.trim()}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        console.log("API Response from generating report:", response.data.data)

        res.send({
            success: true,
            data: response.data.data
        })
    } catch (error) {
        console.error("API Error:", error)
        res.send({
            error: error.response?.data?.message || "Detection failed"
        })
    }
}

export default handler