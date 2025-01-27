import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './custom-button';

const links = [
    { title: 'Generate Report', href: '/' },
    { title: 'Saved Screenshots', href: '/' },
    { title: 'Saved Reports', href: '/services' },
    { title: 'Blocked Users', href: '/services' },
    { title: 'Report to CyberSecurity', href: '/services' },
];

const perspective = {
    initial: {
        opacity: 0,
        rotateX: 90,
        translateY: 80,
        translateX: -100,
    },
    enter: (i) => ({
        opacity: 1,
        rotateX: 0,
        translateY: 0,
        translateX: 0,
        transition: {
            duration: 0.45,
            delay: 0.2 + (i * 0.1),
            ease: [.215, .61, .355, 1],
            opacity: { duration: 0.35 }
        }
    }),
    exit: (i) => ({
        opacity: 0,
        rotateX: 90,
        translateY: 80,
        translateX: 100,
        transition: {
            duration: 0.5,
            delay: (links.length - i) * 0.1, 
            type: "linear",
            ease: [0.76, 0, 0.24, 1]
        }
    })
}

const menu = {
    open: {
        width: "480px",
        height: "650px",
        top: "-25px",
        right: "-25px",
        transition: { duration: 0.55, type: "tween", ease: [0.76, 0, 0.24, 1] }
    },
    closed: {
        width: "100px",
        height: "40px",
        top: "0px",
        right: "0px",
        transition: { duration: 0.55, delay: 0.25, type: "tween", ease: [0.76, 0, 0.24, 1] }
    }
}

export default function Navigation() {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="relative">
            <motion.div
                className=" fixed left-[50px] top-[50px] z-50"
            >
                <motion.div
                    className="w-[350px] h-[400px] bg-[#9810FA] rounded-[25px] relative overflow-hidden"
                    variants={menu}
                    animate={isActive ? "open" : "closed"}
                    initial="closed"
                >
                    <div className="flex gap-[10px] flex-col p-[100px_40px_50px_40px] h-full box-border">
                        {links.map((link, i) => {
                            const { title, href } = link;
                            return (
                                <div
                                    key={`b_${i}`}
                                    className="perspective-[120px] perspective-origin-bottom overflow-hidden"
                                >
                                    <motion.div
                                        href={href}
                                        custom={i}
                                        variants={perspective}
                                        initial="initial"
                                        animate={isActive ? "enter" : "exit"}
                                        exit="exit"
                                    >
                                        <motion.a
                                            href={href}
                                            className="no-underline text-white text-[36px] block"
                                            whileHover={{
                                                x: 15,  
                                                transition: {
                                                    duration: 0.3,
                                                    ease: "easeInOut"
                                                }
                                            }}
                                        >
                                            {title}
                                        </motion.a>
                                    </motion.div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            
                <Button isActive={isActive} toggleMenu={() => { setIsActive(!isActive) }} />
              
            </motion.div>
        </div>
    )
}
