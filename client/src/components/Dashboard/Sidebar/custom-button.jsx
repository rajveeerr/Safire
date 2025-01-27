import { motion } from 'framer-motion';

export default function Button({ isActive, toggleMenu }) {
    return (
        <div className="absolute top-0 right-0 w-[100px] h-[40px] cursor-pointer rounded-[25px] overflow-hidden">
            <motion.div
                className="relative w-full h-full"
                animate={{ top: isActive ? "-100%" : "0%" }}
                transition={{ duration: 0.5, type: "tween", ease: [0.76, 0, 0.24, 1] }}
            >
                <div
                    className="w-full h-full bg-[#9810FA] flex items-center justify-center group"
                    onClick={() => { toggleMenu() }}
                >
                    <PerspectiveText label="Menu" />
                </div>
                <div
                    className="w-full h-full bg-[#161864] flex items-center justify-center group"
                    onClick={() => { toggleMenu() }}
                >
                    <PerspectiveText label="Close" />
                </div>
            </motion.div>
        </div>
    )
}

function PerspectiveText({ label }) {
    return (
        <div className="">
            <p className="text-white">{label}</p>
        </div>
    )
}
