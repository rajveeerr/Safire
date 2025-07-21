import React from 'react';
import Image from 'next/image';
import dashboardImage from '@/app/assets/Dashboard.png';
import chatbotImage from '@/app/assets/Chatbot.png';
import landingImage from '@/app/assets/Landing.png';

export const FloatingPreview = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Container for the images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Landscape Image 1 */}
        <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-lg shadow-md overflow-hidden animate-float">
          <Image
            src={landingImage}
            alt="Dashboard Overview"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Landscape Image 2 */}
        <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-lg shadow-md overflow-hidden animate-float animation-delay-200">
          <Image
            src={chatbotImage}
            alt="Chatbot Integration"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Portrait Image */}
        <div className="sm:col-span-2 transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-lg shadow-md overflow-hidden animate-float animation-delay-400">
          <Image
            src={dashboardImage}
            alt="User Management"
            width={400}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};