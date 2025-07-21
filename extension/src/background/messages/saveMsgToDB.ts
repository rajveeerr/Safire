import type { PlasmoMessaging } from "@plasmohq/messaging"
import axios from "axios"
import { getToken } from "~utils/auth"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { body } = req
    console.log("Request body received:", body)

    try {
        console.log("in saving DB file")
        const cleanedAuthToken = await getToken()
        console.log("token-before", cleanedAuthToken)

        // Make the API request with the received data
        const response = await axios.post(
            'https://harassment-saver-extension.onrender.com/api/v1/user/hide-message',
            {
                profilePicUrl:body.profilePicUrl,
                hiddenBy: body.hiddenBy,
                profileUrl: body.profileUrl,
                userName: body.userName,
                messageContent: body.messageContent,
                time: body.timeOfMessage,
                timeOfMessage: new Date(),
                platform: body.platform || "linkedIn"
            },
            {
                headers: {
                    'Authorization': `Bearer ${cleanedAuthToken.trim()}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        console.log("API Response from saving msg to db:", response.data)

        res.send({
            success: true,
            data: response.data
        })

    } catch (error) {
        console.error('Error saving hidden message:', error)

        res.send({
            success: false,
            error: error.message || 'Failed to save hidden message'
        })
    }
}

export default handler