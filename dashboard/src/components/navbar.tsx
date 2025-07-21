"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
   
    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        setToken(storedToken);

        if (!storedToken) {
            router.push("/signup");
        }
    }, [router]);
  
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        router.push("/signup");
    };
  
    if (token === null) return null;

    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <div>Home</div>
            <div className="text-lg font-bold">SafeDM</div>
            <button 
                onClick={handleLogout} 
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}
