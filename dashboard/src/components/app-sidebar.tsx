"use client"
import { User, FileText, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

const SapphireIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    className="w-8 h-8 animate-glow"
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2L3 8.5L12 15L21 8.5L12 2Z" 
      className="animate-shimmer"
      fill="url(#sapphireGradient)"
      stroke="currentColor" 
      strokeWidth="1.5" 
    />
    <path 
      d="M3 8.5V15.5L12 22L21 15.5V8.5" 
      className="animate-shimmer"
      fill="url(#sapphireGradient)"
      stroke="currentColor" 
      strokeWidth="1.5" 
    />
    <defs>
      <linearGradient id="sapphireGradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
        <stop className="animate-gradient" stopColor="#4F46E5" />
        <stop offset="0.5" stopColor="#818CF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
  </svg>
);

const items = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ name: string; profilePicture: string } | null>(null);
  const [activeItem, setActiveItem] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    setActiveItem(window.location.pathname);
    
    if (!storedToken) {
      router.push("/signup");
    } else {
      fetchProfileData(storedToken);
    }
    
    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 100);
  }, [router]);

  const fetchProfileData = async (token: string) => {
    try {
      const response = await fetch("https://harassment-saver-extension.onrender.com/api/v1/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setProfile({
        name: data.data.user.name,
        profilePicture: data.data.user.profilePicture,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    router.push("/signup");
  };

  if (token === null) return null;

  return (
    <Sidebar className={`min-h-screen bg-zinc-900 border-r border-zinc-800 transition-all duration-500 ${
      isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
    }`}>
      <style jsx global>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 2px #4F46E5); }
          50% { filter: drop-shadow(0 0 8px #818CF8); }
        }
        @keyframes shimmer {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        @keyframes gradient {
          0%, 100% { stop-color: #4F46E5; }
          50% { stop-color: #818CF8; }
        }
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-gradient stop {
          animation: gradient 3s ease-in-out infinite;
        }
      `}</style>

      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-10 flex items-center space-x-3">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <SapphireIcon />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Safire
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem 
                  key={item.title} 
                  className={`mb-2 transition-all duration-500 ${
                    isLoaded 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                        ${activeItem === item.url
                          ? "bg-purple-900/50 text-purple-200"
                          : "text-zinc-400 hover:bg-purple-900/30 hover:text-purple-200"
                        }`}
                      onClick={() => setActiveItem(item.url)}
                    >
                      <item.icon className={`h-5 w-5 transition-transform duration-300 hover:scale-110 ${
                        activeItem === item.url
                          ? "text-purple-200"
                          : "text-zinc-400 group-hover:text-purple-200"
                      }`} />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className={`mt-auto p-4 border-t border-zinc-800 transition-all duration-500 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center w-full p-2 space-x-3 rounded-xl hover:bg-purple-900/30 transition-all duration-300 group">
                <Avatar className="ring-2 ring-purple-900/50 transition-transform duration-300 hover:scale-105">
                  <AvatarImage src={profile?.profilePicture} />
                  <AvatarFallback className="bg-purple-900 text-purple-200">
                    {profile?.name ? profile.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-zinc-200">
                    {profile?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-zinc-400">
                    View profile
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border border-zinc-800">
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}