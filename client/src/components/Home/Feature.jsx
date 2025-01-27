import React from 'react'
import { useState } from "react"
import { motion } from "framer-motion"

const features = [
    {
        title: "Auto Save Evidence",
        description:
            "Automatically save screenshots of harassment for legal action or reporting.",
    },
    {
        title: "Invisible Messages",
        description:
            "Instead of blocking directly, make the harasser’s messages invisible to the user.",
    },
    {
        title: "Tag Harassers",
        description: "Tags for harassers to track repeated offenders easily.",
    },
    {
        title: "Generate Reports",
        description:
            "Generate a ready-to-send report with evidence for police or platform moderators.",
    },
    {
        title: "Cybercrime Integration",
        description:
            "Integrate with cybercrime helplines for immediate action and support.",
    },
];

const Feature = () => {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 py-20">
            <h2 className="text-white text-4xl font-bold mb-10">Key Features</h2>
            <div className="relative w-full flex justify-center items-center space-x-4 overflow-hidden">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        className={`relative w-64 bg-purple-600 text-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all duration-500 ${hovered === index ? "scale-110 z-10" : "scale-95 opacity-70"
                            }`}
                    >
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-lg">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Feature
