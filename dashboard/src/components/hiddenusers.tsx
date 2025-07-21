import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, User, Linkedin, Instagram, Search, Trash2, MessageSquare, TextIcon, ImageIcon, Mic, Calendar, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import axios from 'axios';

const API_BASE_URL = 'https://harassment-saver-extension.onrender.com/api/v1';

interface MessageTypes {
  text: number;
  media: number;
  voice: number;
}

interface HiddenUser {
  _id: string;
  name: string;
  platform: string;
  profileUrl: string;
  statistics: {
    messageTypes: MessageTypes;
    totalMessagesHidden: number;
    lastMessageHidden?: string;
  };
  status: string;
  randomProfileImage?: string;
  profilePicture?: string;
  hiddenMessages: string[];
}

interface ApiResponse {
  status: string;
  data: {
    hiddenUsers: HiddenUser[];
    total: number;
  };
}

interface Message {
  id: string;
  userName: string;
  profileUrl: string;
  messageContent: string;
  timeOfMessage: string;
  platform: string;
  metadata: {
    messageType: string;
    context: string;
    source: string;
    isReported: boolean;
  };
  relatedHiddenUser: {
    id: string;
    name: string;
    statistics: {
      messageTypes: {
        text: number;
        media: number;
        voice: number;
      };
      totalMessagesHidden: number;
      lastMessageHidden: string;
    };
  };
}

interface MessagesResponse {
  status: string;
  data: {
    messages: Message[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

const HiddenUsers: React.FC = () => {
  const [hiddenUsers, setHiddenUsers] = useState<HiddenUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUsers, setDeletingUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<HiddenUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });

  useEffect(() => {
    const fetchHiddenUsers = async () => {
      try {
        const { data } = await api.get<ApiResponse>('/user/hidden-users');
        
        if (data.status === 'success') {
          setHiddenUsers(data.data.hiddenUsers);
        } else {
          throw new Error('Failed to fetch hidden users');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Error fetching data');
          console.error('API Error:', error.response?.data);
        } else {
          setError('Error fetching data');
          console.error('Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHiddenUsers();
  }, []);

  const handleDeleteUser = async (user: HiddenUser) => {
    try {
      setDeletingUsers(prev => [...prev, user._id]);

      const { data } = await api.post('/user/unhide', {
        userId: user._id,
        name: user.name,
        platform: user.platform,
        profileUrl: user.profileUrl
      });
      
      if (data.status === 'success') {
        setHiddenUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
        
        toast({
          title: "Success",
          description: "User has been unhidden successfully",
          variant: "default",
        });
      } else {
        throw new Error(data.message || 'Failed to unhide user');
      }
    } catch (error) {
      let errorMessage = 'Failed to unhide user. Please try again.';
      
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data;
        errorMessage = apiError?.message || errorMessage;
        console.error('API Error:', apiError);
      } else {
        console.error('Error:', error);
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeletingUsers(prev => prev.filter(id => id !== user._id));
    }
  };

  const fetchUserMessages = async (userId?: string) => {
    setLoadingMessages(true);
    try {
      const response = await api.get<MessagesResponse>('/user/hidden-messages', {
        params: {
          search: messageSearchQuery,
          userId: userId // Add userId parameter
        }
      });
      
      if (response.data.status === 'success') {
        setMessages(response.data.data.messages.map(message => ({
          ...message,
          metadata: {
            ...message.metadata,
            context: message.metadata?.context || 'Unknown',
            messageType: message.metadata?.messageType || 'text',
            isReported: message.metadata?.isReported || false
          }
        })));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };
  useEffect(() => {
    if (drawerOpen && selectedUser) {
      fetchUserMessages(selectedUser._id);
    }
  }, [drawerOpen, messageSearchQuery, selectedUser]);

  const handleShowMessages = (user: HiddenUser) => {
    setSelectedUser(user);
    setDrawerOpen(true);
    setMessageSearchQuery('');
  };
  
  const getPlatformIcon = (platform: string): JSX.Element => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlatformBadge = (platform: string): JSX.Element => {
    const platformColors: Record<string, string> = {
      'linkedin': 'bg-blue-700 text-white',
      'instagram': 'bg-pink-700 text-white',
      'other': 'bg-gray-700 text-white'
    };

    const color = platformColors[platform.toLowerCase()] || platformColors['other'];

    return (
      <Badge className={`${color} text-xs`}>
        {platform}
      </Badge>
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredUsers = hiddenUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(message => 
    selectedUser && message.relatedHiddenUser 
      ? message.relatedHiddenUser.id === selectedUser._id 
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">{error}</div>
    );
  }

  return (
    <>
    <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border border-[#2c0075]/20 relative overflow-hidden bg-black h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#2c0075]/40 to-black opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2c0075]/20 via-[#6b40b3]/10 to-[#f4f1ff]/5 opacity-40 animate-pulse" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2c0075]/30 via-[#6b40b3]/20 to-[#f4f1ff]/10 blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
      
      <div className="relative z-10 backdrop-blur-sm">
        <CardHeader className="space-y-4 p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-white">
            <User className="h-5 w-5" />
            Hidden Users
            <span className="ml-auto rounded-md bg-[#2c0075] px-2 py-1 text-sm">
              {hiddenUsers.length}
            </span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users or platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-[#2c0075]/20 border-[#6b40b3]/20 focus-visible:ring-1 focus-visible:ring-[#6b40b3] text-white placeholder:text-gray-400"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl bg-[#2c0075]/20 p-3 hover:bg-[#2c0075]/30 transition-all duration-300 group border border-[#6b40b3]/20 gap-4 sm:gap-3"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="rounded-full bg-[#2c0075]/40 p-2">
                        {getPlatformIcon(user?.platform)}
                      </div>
                      <div>
                        <div className="mb-1">
                          {getPlatformBadge(user?.platform)}
                        </div>
                        <p className="text-sm text-gray-300">{user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium text-gray-300">
                          {user?.statistics?.totalMessagesHidden} {user?.statistics?.totalMessagesHidden === 1 ? 'message' : 'messages'}
                        </p>
                        <p className="text-sm text-gray-400">
                          Last active: {formatDate(user?.statistics?.lastMessageHidden)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShowMessages(user)}
                          className="p-2 hover:bg-blue-500/20 rounded-full transition-colors duration-200"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingUsers.includes(user._id)}
                          className="p-2 hover:bg-red-500/20 rounded-full transition-colors duration-200"
                        >
                          {deletingUsers.includes(user?._id) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No users found matching your search
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </div>
    </Card>

    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerContent className="bg-[#1a1a1a] text-white border-t border-[#2c0075]/20">
        <DrawerHeader className="border-b border-[#2c0075]/20 p-4 sm:p-6">
          <DrawerTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
            {selectedUser && getPlatformIcon(selectedUser.platform)}
            <span>{selectedUser?.name}&apos;s Hidden Messages</span>
          </DrawerTitle>
          <DrawerDescription className="text-gray-400">
            Total messages hidden: {selectedUser?.statistics.totalMessagesHidden}
          </DrawerDescription>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="pl-8 bg-[#2c0075]/20 border-[#6b40b3]/20 focus-visible:ring-1 focus-visible:ring-[#6b40b3] text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </DrawerHeader>
        
        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#2c0075]/20 p-4 rounded-lg border border-[#6b40b3]/20">
                <div className="flex items-center gap-2 mb-3">
                  <TextIcon className="h-5 w-5 text-blue-400" />
                  <h4 className="font-medium text-white">Text Messages</h4>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {selectedUser?.statistics.messageTypes.text}
                </p>
              </div>
              
              <div className="bg-[#2c0075]/20 p-4 rounded-lg border border-[#6b40b3]/20">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-5 w-5 text-green-400" />
                  <h4 className="font-medium text-white">Media Messages</h4>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {selectedUser?.statistics.messageTypes.media}
                </p>
              </div>
              
              <div className="bg-[#2c0075]/20 p-4 rounded-lg border border-[#6b40b3]/20 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-5 w-5 text-yellow-400" />
                  <h4 className="font-medium text-white">Voice Messages</h4>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {selectedUser?.statistics.messageTypes.voice}
                </p>
              </div>
            </div>

            <div className="bg-[#2c0075]/20 p-4 rounded-lg border border-[#6b40b3]/20">
              <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Hidden Messages
              </h4>
              
              <ScrollArea className="h-[300px] pr-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  </div>
                ) : filteredMessages.length > 0 ? (
                  <div className="space-y-4">
                    {filteredMessages.map((message) => (
                      <div 
                        key={message.id}
                        className="bg-black/40 p-4 rounded-lg border border-[#6b40b3]/20 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <TextIcon className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-gray-400">
                              {message.metadata.context.toUpperCase()}
                            </span>
                            {message.metadata.isReported && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/40">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Reported
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(message.timeOfMessage).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <p className="text-gray-200">{message.messageContent}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No messages found
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t border-[#2c0075]/20">
          <DrawerClose asChild>
            <button className="w-full sm:w-auto bg-[#2c0075] hover:bg-[#6b40b3] text-white transition-colors duration-200 px-4 py-2 rounded-lg">
              Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </>
  );
};

export default HiddenUsers;