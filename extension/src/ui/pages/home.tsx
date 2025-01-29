import React, { useState } from 'react';
import { Settings2, Share2, Wand2, Bell, Shield, Eye, MessageSquare, FileText, User, AlertTriangle } from 'lucide-react';

const ToggleButton = ({ label, enabled, onToggle }) => (
    <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-3 plasmo-bg-gray-800 plasmo-rounded-lg plasmo-mb-3">
      <span className="plasmo-text-sm plasmo-text-gray-300">{label}</span>
      <button 
        className={`plasmo-w-12 plasmo-h-6 plasmo-rounded-full plasmo-p-1 plasmo-transition-colors ${enabled ? 'plasmo-bg-blue-600' : 'plasmo-bg-gray-600'}`}
        onClick={onToggle}
      >
        <div className={`plasmo-w-4 plasmo-h-4 plasmo-bg-white plasmo-rounded-full plasmo-transition-transform ${enabled ? 'plasmo-translate-x-6' : 'plasmo-translate-x-0'}`} />
      </button>
    </div>
  );
  
  const HomePage = () => {
    const [toggles, setToggles] = useState({
      notifications: true,
      automaticBlocking: false,
      hideMessages: true,
      autoReport: false,
      profileTag: true,
      safeMode: true
    });
  
    const handleToggle = (key) => {
      setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };
  
    return (<div className="plasmo-w-[320px] plasmo-min-h-[480px] plasmo-bg-gray-900 plasmo-text-white plasmo-p-4 plasmo-font-sans">
  
        {/* Main Content */}
        <div className="plasmo-mb-6">
          <h1 className="plasmo-text-2xl plasmo-mb-2">
            Welcome to <span className="plasmo-text-blue-500">HS-Saver!</span>
          </h1>
          <p className="plasmo-text-gray-400 plasmo-text-sm plasmo-mb-4">
            Protect yourself from online harassment
          </p>
          
          {/* Video Preview Box */}
          <div className="plasmo-bg-gray-800 plasmo-rounded-lg plasmo-p-4 plasmo-mb-6">
            <div className="plasmo-aspect-video plasmo-bg-gray-700 plasmo-rounded-md plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mb-4">
              <button className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-900 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-md plasmo-hover:bg-gray-800 plasmo-transition-colors">
                <span className="plasmo-text-lg">▶</span>
                Watch tutorial
              </button>
            </div>
          </div>
  
          {/* Toggles Section */}
          <div className="plasmo-space-y-2 plasmo-mb-6">
            <h2 className="plasmo-text-lg plasmo-font-medium plasmo-mb-3">Protection Settings</h2>
            
            <ToggleButton
              label="Enable Notifications"
              enabled={toggles.notifications}
              onToggle={() => handleToggle('notifications')}
            />
            
            <ToggleButton
              label="Automatic Blocking"
              enabled={toggles.automaticBlocking}
              onToggle={() => handleToggle('automaticBlocking')}
            />
            
            <ToggleButton
              label="Hide Abusive Messages"
              enabled={toggles.hideMessages}
              onToggle={() => handleToggle('hideMessages')}
            />
            
            <ToggleButton
              label="Automatic Report Generation"
              enabled={toggles.autoReport}
              onToggle={() => handleToggle('autoReport')}
            />
            
            <ToggleButton
              label="Show Profile Warning Tags"
              enabled={toggles.profileTag}
              onToggle={() => handleToggle('profileTag')}
            />
            
            <ToggleButton
              label="Safe Mode"
              enabled={toggles.safeMode}
              onToggle={() => handleToggle('safeMode')}
            />
          </div>
  
          {/* Quick Actions */}
          <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3 plasmo-mb-6">
            <button className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg plasmo-hover:bg-gray-700 plasmo-transition-colors">
              <FileText className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
              <span className="plasmo-text-sm">View Reports</span>
            </button>
            <button className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg plasmo-hover:bg-gray-700 plasmo-transition-colors">
              <User className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
              <span className="plasmo-text-sm">Blocked Users</span>
            </button>
            <button className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg plasmo-hover:bg-gray-700 plasmo-transition-colors">
              <MessageSquare className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
              <span className="plasmo-text-sm">Messages Log</span>
            </button>
            <button className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg plasmo-hover:bg-gray-700 plasmo-transition-colors">
              <AlertTriangle className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
              <span className="plasmo-text-sm">Help Center</span>
            </button>
          </div>
        </div>
  
        {/* Footer */}
        <div className="plasmo-flex plasmo-gap-2 plasmo-mt-auto">
          <button className="plasmo-flex-1 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-bg-blue-600 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-md plasmo-hover:bg-blue-700 plasmo-transition-colors">
            <Shield className="plasmo-w-4 plasmo-h-4" />
            Enable Protection
          </button>
          <button className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-md plasmo-hover:bg-gray-700 plasmo-transition-colors">
            <Settings2 className="plasmo-w-4 plasmo-h-4" />
            Settings
          </button>
        </div>
      </div>
    );
  };
  
  export default HomePage;
