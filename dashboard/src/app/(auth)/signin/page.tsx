"use client"

import { FloatingPreview } from "@/components/FloatingPreview";
import { LoginForm } from "@/components/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signin() {
  const router = useRouter();
  
  useEffect(() => {
    // Check for token only on the client side
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="flex items-center justify-center p-4">
          <div className="hidden md:block">
            <FloatingPreview />
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}