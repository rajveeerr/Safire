"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, Mail, User, Lock, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard/profile");
    }
  }, [router]);

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const newErrors: FormErrors = {};
    if (password.length < minLength) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!hasUpperCase || !hasLowerCase) {
      newErrors.password = "Password must contain both uppercase and lowercase letters";
    } else if (!hasNumbers) {
      newErrors.password = "Password must contain at least one number";
    } else if (!hasSpecialChar) {
      newErrors.password = "Password must contain at least one special character";
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    
    if (name === 'password') {
      validatePassword(value);
    }
    
    if (name === 'confirmPassword' && value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!validatePassword(formData.password)) return;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://harassment-saver-extension.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profilePicture: `https://avatar.iran.liara.run/public/girl?username=${formData.email}`,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.errors?.email?.message || "Registration failed");
      }

      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
        toast({
          title: "Success!",
          description: "Your account has been created successfully.",
          duration: 3000,
        });
       
          router.push("/dashboard/profile");
        
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during registration",
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
            Welcome to SafeDM
          </h2>
          <p className="text-neutral-600 text-sm mt-2 dark:text-neutral-400">
            We&apos;re glad you&apos;re here! Let&apos;s get you started with your account.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <LabelInputContainer>
              <Label htmlFor="name" className="text-neutral-700 dark:text-neutral-300">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  type="text"
                  onChange={handleChange}
                  className={cn(
                    "pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    errors.name && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  onChange={handleChange}
                  className={cn(
                    "pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    errors.email && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password" className="text-neutral-700 dark:text-neutral-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  onChange={handleChange}
                  className={cn(
                    "pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    errors.password && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="confirmPassword" className="text-neutral-700 dark:text-neutral-300">
                Confirm Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  onChange={handleChange}
                  className={cn(
                    "pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
                    "focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",
                    errors.confirmPassword && "border-red-500 focus:ring-red-500"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-sm text-red-500">{errors.confirmPassword}</span>
              )}
            </LabelInputContainer>

            <button
              className={cn(
                "relative w-full h-11 rounded-lg font-medium transition-all duration-200",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "hover:opacity-90 hover:shadow-lg",
                "text-white",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Creating account...
                </span>
              ) : (
                "Create account →"
              )}
            </button>

            <p className="text-center text-neutral-600 text-sm dark:text-neutral-400">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => router.push("/signin")}
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};