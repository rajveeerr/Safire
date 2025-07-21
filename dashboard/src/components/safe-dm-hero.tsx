import React from 'react';
import { Check, Crown, Lock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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


const SafireHero = ({ isPremium = true }) => {
  const features = {
    free: [
      "Real-time LinkedIn message screening",
      "Basic message blocking",
      "User blocking management",
      "Message history tracking"
    ],
    premium: [
      "Detailed harassment reports",
      "Advanced analytics dashboard",
      "Priority support",
      "Extended message history"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-primary hover:scale-105 transition-transform duration-300">
            <SapphireIcon />
            <span>
              Sa<span className="underline underline-offset-2 decoration-[#0F52BA]">fire</span>
            </span>
          </h1>
          {isPremium && (
            <Badge variant="outline" className="bg-[#0F52BA]/10 text-[#0F52BA] border-[#0F52BA]/20">
              <Crown className="w-4 h-4 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <p className="text-lg md:text-xl text-muted-foreground">
          Your Shield Against Online Harassment
        </p>
      </div>

      {/* Description */}
      <div className="prose max-w-none space-y-4">
        <p className="text-sm md:text-base leading-relaxed hover:text-primary transition-colors duration-300">
          Safire ensures a safe LinkedIn experience by monitoring and managing your messages. {isPremium && "Enjoy exclusive premium features for enhanced protection."}
        </p>
        <p className="text-sm text-muted-foreground italic">
          Instagram support coming soon!
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Free Features */}
        <div className={`space-y-4 p-6 rounded-xl bg-gradient-to-br from-background via-background/80 to-background border ${isPremium ? "border-none" : "border-border hover:border-primary"} transition-colors duration-300`}>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Core Features</h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Free
            </Badge>
          </div>
          <ul className="space-y-3">
            {features.free.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium Features */}
        <div className={`space-y-4 p-6 rounded-xl bg-gradient-to-br from-[#0F52BA]/10 via-background to-background border ${isPremium ? "border-[#0F52BA]/40" : "border-[#0F52BA]/20 hover:border-[#0F52BA]/40"} transition-colors duration-300`}>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              Premium Features
              <Crown className="w-5 h-5 text-yellow-500" />
            </h3>
            <Badge variant="secondary" className="bg-[#0F52BA]/10 text-[#0F52BA]">
              Premium
            </Badge>
          </div>
          <ul className="space-y-3">
            {features.premium.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300">
                <div className="relative">
                  <Check className="w-5 h-5 text-[#0F52BA] flex-shrink-0" />
                  {!isPremium && <Lock className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />}
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SafireHero;