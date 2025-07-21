import type { PlasmoMessaging } from "@plasmohq/messaging"
import axios from "axios"


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log("messages from req body", req.body)
    const { message } = req.body

    try {
        console.log("msg before axios req", message)
        const response = await axios.post(
            `https://harassment-saver-extension.onrender.com/api/v1/moderation/detect-harassment`,
            {
                message: message,
                platform: "linkedIn"
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        // || response.data.analysis.isVulgar || response.data.analysis.isThreatening || response.data.analysis.isSexuallyExplicit

        const result = response.data.analysis.isHarassment 

        console.log(`AI result for ${message} - ${result}`)

        res.send({
            data: result
        })
    } catch (error) {
        console.error("API Error:", error)
        res.send({
            error: error.response?.data?.message || "Detection failed"
        })
    }
}

export default handler

// import type { PlasmoMessaging } from "@plasmohq/messaging"
// import axios from "axios"

// const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
//     console.log("messages from req body", req.body)
//     const { message } = req.body

//     try {
//         console.log("msg before axios req", message)
        
//         const response = await axios.post(
//             `http://localhost:11434/api/generate`,
//             {
//                 model: "qwen2:0.5b", 
//                 prompt: `Is the following message harassment, vulgar, threatening, or sexually explicit? Respond with only true or false. Message: "${message}"`,
//                 stream: false
//             },
//             {
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Origin": "chrome-extension://bafaiflmkepikmpbgnhankhakoddleme",
//                     "Access-Control-Allow-Origin": "*"
//                 },
//                 timeout: 10000,
//                 validateStatus: (status) => {
//                     return status >= 200 && status < 500; 
//                 }
//             }
//         )

//         const aiResponse = response.data.response?.toLowerCase().trim()
//         const isHarassment = aiResponse === "true"

//         console.log(`AI result for "${message}" - ${isHarassment}`)

//         res.send({
//             data: isHarassment
//         })
//     } catch (error) {
//         console.error("Detailed API Error:", {
//             message: error.message,
//             status: error.response?.status,
//             data: error.response?.data,
//             config: error.config
//         })

//         res.send({
//             error: {
//                 message: "Detection failed",
//                 details: error.message,
//                 status: error.response?.status,
//                 isConnectionError: error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK"
//             }
//         })
//     }
// }

// export default handler