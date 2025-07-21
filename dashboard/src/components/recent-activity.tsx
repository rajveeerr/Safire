import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Search, Linkedin, Instagram, User, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from 'date-fns';

interface Message {
  id: string;
  content: string;
  time: string;
  platform: string;
  type: string;
}

interface UserData {
  recentActivity?: {
    messages: Message[];
  };
}

const MessageCard = ({ message }: { message: Message }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlatformBadge = (platform: string) => {
    const platformColors = {
      'LinkedIn': 'bg-blue-700 text-white',
      'Instagram': 'bg-pink-700 text-white',
      'Other': 'bg-gray-700 text-white'
    };

    const color = platformColors[platform as keyof typeof platformColors] || platformColors['Other'];

    return (
      <Badge className={`${color} text-xs`}>
        {platform}
      </Badge>
    );
  };

  return (
    <div
      className={`
        rounded-xl bg-[#2c0075]/20 p-3 
        hover:bg-[#2c0075]/30 transition-all duration-300 
        group border border-[#6b40b3]/20
        cursor-pointer
        ${isExpanded ? 'bg-[#2c0075]/30' : ''}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#2c0075]/40 p-2">
            {getPlatformIcon(message.platform)}
          </div>
          <div>
            <div className="mb-1">
              {getPlatformBadge(message.platform)}
            </div>
            <p className={`text-sm text-gray-300 transition-all duration-300 ${isExpanded ? 'line-clamp-none' : 'line-clamp-1'}`}>
              {message.content}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-sm text-gray-400">
            {formatDistance(new Date(message.time), new Date(), { addSuffix: true })}
          </p>
          {message.content.length > 30 && (
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={isExpanded ? "Collapse message" : "Expand message"}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ userData }: { userData: UserData }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const messages = userData?.recentActivity?.messages || [];
  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="shadow-2xl hover:shadow-3xl transition-all duration-500 border border-[#2c0075]/20 relative overflow-hidden bg-black">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#2c0075]/40 to-black opacity-80" />
      
      {/* Animated accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2c0075]/20 via-[#6b40b3]/10 to-[#f4f1ff]/5 opacity-40 animate-pulse" />
      
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2c0075]/30 via-[#6b40b3]/20 to-[#f4f1ff]/10 blur-xl opacity-30 group-hover:opacity-50 transition duration-500" />
      
      {/* Content */}
      <div className="relative z-10 backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-white">
            <MessageCircle className="h-5 w-5" />
            Recent Activity
            <span className="ml-auto rounded-md bg-[#2c0075] px-2 py-1 text-sm">
              {messages.length}
            </span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages or platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-[#2c0075]/20 border-[#6b40b3]/20 focus-visible:ring-1 focus-visible:ring-[#6b40b3] text-white placeholder:text-gray-400"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No messages found matching your search
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </div>
    </Card>
  );
};

export default RecentActivity;