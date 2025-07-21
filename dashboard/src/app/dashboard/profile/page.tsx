"use client"
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistance } from 'date-fns';
import { Activity, Bell, Crown, Shield } from 'lucide-react';
import PreferencesSection from '@/components/hiddenusers';
import RecentActivity from '@/components/recent-activity';
import SafeDMHero from '@/components/safe-dm-hero';

interface UserData {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  preferences: {
    autoGenerateReport: boolean;
    autoSaveScreenshots: boolean;
    enableTags: boolean;
  };
  stats: {
    totalBlockedMessages: number;
    totalReports: number;
    totalHiddenUsers: number;
    messageStats: {
      totalMessages: number;
      byPlatform: Record<string, number>;
      byMessageType: Record<string, number>;
    };
    hiddenUserStats: {
      total: number;
      byPlatform: Record<string, number>;
      mostActive: Array<{
        name: string;
        platform: string;
        totalMessages: number;
        lastMessageDate: string;
      }>;
    };
  };
  recentActivity: {
    messages: Array<{
      id: string;
      content: string;
      time: string;
      platform: string;
      type: string;
    }>;
  };
}

interface ApiError {
  message: string;
  status?: number;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get<{ data: { user: UserData } }>(
          'https://harassment-saver-extension.onrender.com/api/v1/user/profile',
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );

        setUserData(response.data.data.user);
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        setError(error.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500 animate-fade-in">Error: {error}</p>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="container mx-auto p-4 pl-8 pr-8">
      <div className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <SafeDMHero/>

          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border border-[#2c0075]/20 relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#2c0075]/40 to-black opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2c0075]/20 via-[#6b40b3]/10 to-[#f4f1ff]/5 opacity-40 animate-pulse"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2c0075]/30 via-[#6b40b3]/20 to-[#f4f1ff]/10 blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>

            <div className="relative z-10 backdrop-blur-sm">
              <CardHeader className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 pb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-2 ring-[#2c0075] hover:ring-[#6b40b3] hover:scale-105 transition-all duration-300 shadow-lg">
                    <AvatarImage src={userData.profilePicture} alt={userData.name} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-[#2c0075] to-[#6b40b3]">
                      {userData.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 p-1.5 rounded-full shadow-lg animate-pulse">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div className="text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#f4f1ff] to-[#b69fff] bg-clip-text text-transparent">
                      {userData.name}
                    </h2>
                  </div>
                  <p className="text-[#b69fff] font-medium">{userData.email}</p>
                  <div className="flex items-center gap-2 text-sm text-[#8b6fe6]/80">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                      Online
                    </div>
                    •
                    <p>
                      Joined {formatDistance(new Date(userData.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mt-6 space-y-4">
                  <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 p-3 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm">Premium Features Enabled</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-black via-[#2c0075]/30 to-black p-5 rounded-3xl backdrop-blur-md border border-[#2c0075]/20">
                    <ul className="space-y-4">
                      {[
                        { label: "Blocked Messages", value: userData.stats.totalBlockedMessages, icon: Shield },
                        { label: "Total Reports", value: userData.stats.totalReports, icon: Activity },
                        { label: "Hidden Users", value: userData.stats.totalHiddenUsers, icon: Bell },
                      ].map((stat, index) => (
                        <li
                          key={stat.label}
                          className="flex items-center justify-between bg-[#2c0075]/20 p-3 rounded-xl transition-all duration-300 group hover:bg-[#2c0075]/30"
                          style={{
                            transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                            opacity: isVisible ? 1 : 0,
                            transition: `all 0.5s ease-out ${index * 0.15}s`,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <stat.icon className="h-4 w-4 text-[#b69fff]" />
                            <span className="text-[#f4f1ff]/80 group-hover:text-[#f4f1ff] transition-colors duration-300">
                              {stat.label}
                            </span>
                          </div>
                          <span className="font-semibold text-lg bg-gradient-to-r from-[#f4f1ff] to-[#b69fff] bg-clip-text text-transparent">
                            {stat.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <RecentActivity userData={userData} />
          <PreferencesSection />
        </div>
      </div>
    </div>
  );
};

export default Profile;