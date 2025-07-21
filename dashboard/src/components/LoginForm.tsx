"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://harassment-saver-extension.onrender.com/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("authToken", data.data.token);
      toast({
        title: "Success!",
        description: "Logged in successfully.",
        duration: 3000,
      });

      router.push("/dashboard/profile")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="relative group bg-white dark:bg-black rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:shadow-xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-200" />
        
        <div className="relative">
          <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-100 dark:to-neutral-300">
            Welcome Back!
          </h2>
          <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-400">
            Enter your details to access your account.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  className={cn(
                    "pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    errors.email && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className={cn(
                    "pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
            </div>

            {/* Login Button */}
            <button
              className={cn(
                "relative w-full h-11 rounded-lg font-medium transition-all duration-200",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "hover:opacity-90 hover:shadow-lg",
                "text-white",
                "flex items-center justify-center"
              )}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
