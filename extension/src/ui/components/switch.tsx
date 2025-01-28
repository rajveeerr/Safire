import * as React from "react"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export function Switch({ 
    checked, 
    onCheckedChange,
    className,
    ...props 
}: SwitchProps) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            onClick={() => onCheckedChange(!checked)}
            className={`
                relative plasmo-h-6 plasmo-w-11 plasmo-cursor-default plasmo-rounded-full
                plasmo-bg-gray-600 plasmo-transition-colors
                data-[state=checked]:plasmo-bg-blue-600
                plasmo-hover:cursor-pointer
                ${className}
            `}
            {...props}
        >
            <span
                data-state={checked ? "checked" : "unchecked"}
                className={`
                    plasmo-block plasmo-h-5 plasmo-w-5 plasmo-rounded-full plasmo-bg-white plasmo-shadow-lg 
                    plasmo-transition-transform
                    data-[state=unchecked]:plasmo-translate-x-0.5
                    data-[state=checked]:plasmo-translate-x-[1.4rem]
                `}
            />
        </button>
    )
}