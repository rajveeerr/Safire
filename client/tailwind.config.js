/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {


            transitionTimingFunction: {
                'custom': 'cubic-bezier(0.76, 0, 0.24, 1)',
            },
            transitionDuration: {
                '750': '750ms',
            },
            transformOrigin: {
                'bottom-center': 'bottom center',
            },
            rotate: {
                'x-90': '90deg',
                '-x-90': '-90deg',
            },
            transformStyle: {
                'preserve-3d': 'preserve-3d',
            },
            perspectiveOrigin: {
                'bottom': 'bottom',
            },

        },
        plugins: [
            daisyui,
        ],
    }
}