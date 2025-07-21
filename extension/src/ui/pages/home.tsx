import React, { useEffect, useState } from 'react';
import { Shield, FileText, User, MessageSquare, AlertTriangle, PencilOff, UserRoundSearch } from 'lucide-react';
import { isAuthenticated } from '~utils/auth';
import { ExtensionStateManager } from '~/utils/extension-state';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigation } from '../popupui';

const ToggleButton = ({ label, enabled, onToggle, disabled }) => (
  <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-3 plasmo-bg-gray-800 plasmo-rounded-lg plasmo-mb-3">
    <span className="plasmo-text-sm plasmo-text-gray-300">{label}</span>
    <button
      className={`plasmo-w-12 plasmo-h-6 plasmo-rounded-full plasmo-p-1 plasmo-transition-colors ${enabled ? 'plasmo-bg-blue-600' : 'plasmo-bg-gray-600'} ${disabled ? 'plasmo-opacity-50 plasmo-cursor-not-allowed' : ''}`}
      onClick={!disabled ? onToggle : undefined}
      disabled={disabled}
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
    // enableExtension: true
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const { setCurrentPage } = useNavigation();

  const handleViewReports = () => {
    setCurrentPage('reports');
  };

  const handleViewBlockedUsers = () => {
    setCurrentPage('blocked');
  };

  useEffect(() => {
    const fetchInitialState = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        try {
          const cachedPreferences = await chrome.storage.local.get('userPreferences');
          
          if (cachedPreferences.userPreferences) {
            setToggles(prev => ({
              ...prev,
              hideMessages: cachedPreferences.userPreferences.autoSaveScreenshots ?? prev.hideMessages,
              autoReport: cachedPreferences.userPreferences.autoGenerateReport ?? prev.autoReport,
              profileTag: cachedPreferences.userPreferences.enableTags ?? prev.profileTag
            }));
          }

          const token = await chrome.storage.local.get('authToken');
          const response = await fetch("https://harassment-saver-extension.onrender.com/api/v1/user/profile", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token.authToken}`
            }
          });
          
          const data = await response.json();
          
          if (data.status === "success") {
            const preferences = data.data.user.preferences || {};
            
            const updatedToggles = {
              ...toggles,
              hideMessages: preferences.autoSaveScreenshots,
              autoReport: preferences.autoGenerateReport,
              profileTag: preferences.enableTags
            };
            
            setToggles(updatedToggles);
            
            await chrome.storage.local.set({
              userPreferences: preferences
            });
          }
        } catch (error) {
          console.error('Failed to fetch preferences:', error);
          toast.error('Failed to fetch preferences');
        }
      }
    };

    fetchInitialState();

    const handleStorageChange = (changes, area) => {
      if (area === 'local' && changes.authToken) {
        isAuthenticated().then(authenticated => {
          setIsLoggedIn(authenticated);
        });
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const handleToggle = async (key) => {
    // if (key === 'enableExtension') {
    //   await ExtensionStateManager.setEnabled(!toggles.enableExtension);
    //   setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    //   return;
    // }

    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    setShowWarning(true);
    setHasChanges(true);
  };

  const handleSavePreferences = async () => {
    try {
      const token = await chrome.storage.local.get('authToken');
      const payload = {
        preferences: {
          autoGenerateReport: toggles.autoReport,
          autoSaveScreenshots: toggles.hideMessages,
          enableTags: toggles.profileTag
        }
      };

      const response = await fetch("https://harassment-saver-extension.onrender.com/api/v1/user/update-profile", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.status === "success") {
        await chrome.storage.local.set({
          userPreferences: data.data.updatedFields.preferences
        });

        setShowWarning(false);
        setHasChanges(false);
        toast.success('Preferences saved successfully!');
      } else if (data.type === "NoUpdateError") {
        toast.info('No changes were made to preferences');
        setHasChanges(false);
        setShowWarning(false);
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Save preferences error:', error);
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="plasmo-w-[320px] plasmo-min-h-[480px] plasmo-bg-gray-900 plasmo-text-white plasmo-p-4 plasmo-font-sans relative">
      {/* <ToggleButton
        label="Enable Extension"
        enabled={toggles.enableExtension}
        onToggle={() => handleToggle('enableExtension')}
        disabled={false}
      /> */}
      
        <>
          {!isLoggedIn && (
            <p className="plasmo-text-white plasmo-bg-yellow-200/10 plasmo-p-2 plasmo-h-min plasmo-mb-2 plasmo-text-xs">
              Please log in to use all features of this extension.
            </p>
          )}
          <div className="plasmo-mb-6">
            <h1 className="plasmo-text-2xl plasmo-mb-2 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2">
              Welcome to <span className="plasmo-text-blue-500">Safire!</span>
            </h1>
            <p className="plasmo-text-gray-400 plasmo-text-sm plasmo-mb-4 plasmo-flex plasmo-items-center plasmo-justify-center">
              Protect yourself from online harassment
            </p>

            <div className="plasmo-bg-gray-800 plasmo-rounded-lg plasmo-p-4 plasmo-mb-6">
              <div className="plasmo-aspect-video plasmo-bg-gray-700 plasmo-rounded-md plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mb-4">
                <div className="relative">
                  <iframe
                  src="https://player.vimeo.com/video/1059208124?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  className="absolute top-0 left-0 w-full h-full"
                  title="Safire in Action"
                  ></iframe>
                </div>
                <script src="https://player.vimeo.com/api/player.js"></script>
              </div>
            </div>

            <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3 plasmo-mb-6">
                <button
                  className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg hover:plasmo-bg-gray-700 plasmo-transition-colors disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed"
                  disabled={!isLoggedIn}
                  onClick={handleViewReports}
                >
                  <FileText className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
                  <span className="plasmo-text-sm">View Reports</span>
                </button>
                <button
                  className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg hover:plasmo-bg-gray-700 plasmo-transition-colors disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed"
                  disabled={!isLoggedIn}
                  onClick={handleViewBlockedUsers}
                >
                  <User className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
                  <span className="plasmo-text-sm">Blocked Users</span>
                </button>
                <button
                  className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg hover:plasmo-bg-gray-700 plasmo-transition-colors disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed"
                  disabled={!isLoggedIn}
                  onClick={() => setCurrentPage('messages')}
                >
                  <MessageSquare className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
                  <span className="plasmo-text-sm">Messages Log</span>
                </button>
                <button
                  className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg hover:plasmo-bg-gray-700 plasmo-transition-colors disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed"
                  disabled={!isLoggedIn}
                  onClick={() => chrome.tabs.create({
                    url: 'https://safe-dm-dashboard.vercel.app/dashboard/profile'
                  })}
                >
                  <AlertTriangle className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
                  <span className="plasmo-text-sm">Help Center</span>
                </button>
              <button
                className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg hover:plasmo-bg-gray-700 plasmo-transition-colors disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed"
                disabled={!isLoggedIn}
                onClick={() => setCurrentPage('keywords')} 
              >
                <PencilOff className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
                <span className="plasmo-text-sm">Blacklist Keywords</span>
              </button>
              <button
                className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg hover:plasmo-bg-gray-700 plasmo-transition-colors disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed"
                disabled={!isLoggedIn}
                onClick={() => chrome.tabs.create({
                  url: 'https://safe-dm-dashboard.vercel.app/dashboard/profile'
                })}
              >
                <UserRoundSearch className="plasmo-w-5 plasmo-h-5 plasmo-text-blue-500" />
                <span className="plasmo-text-sm">All Detected Harassers</span>
              </button>
            </div>

            <div className="plasmo-space-y-2 plasmo-mb-6">
              <h2 className="plasmo-text-lg plasmo-font-medium plasmo-mb-3">Protection Settings</h2>

              <ToggleButton
                label="Automatic Blocking"
                enabled={toggles.automaticBlocking}
                onToggle={() => handleToggle('automaticBlocking')}
                disabled={true}
              />

              <ToggleButton
                label="Hide Abusive Messages"
                enabled={toggles.hideMessages}
                onToggle={() => handleToggle('hideMessages')}
                disabled={!isLoggedIn}
              />

              <ToggleButton
                label="Automatic Report Generation"
                enabled={toggles.autoReport}
                onToggle={() => handleToggle('autoReport')}
                disabled={!isLoggedIn}
              />

              <ToggleButton
                label="Show Profile Warning Tags"
                enabled={toggles.profileTag}
                onToggle={() => handleToggle('profileTag')}
                disabled={!isLoggedIn}
              />
            </div>

            <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-mt-auto">
              <button
                className={`plasmo-flex-1 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-px-4 plasmo-py-2 plasmo-rounded-md plasmo-transition-colors ${!isLoggedIn || !hasChanges ? 'plasmo-bg-gray-600 plasmo-cursor-not-allowed' : 'plasmo-bg-blue-600 plasmo-hover:bg-blue-700'}`}
                disabled={!isLoggedIn || !hasChanges}
                onClick={handleSavePreferences}
              >
                <Shield className="plasmo-w-4 plasmo-h-4" />
                Save Preferences
              </button>
              {showWarning && (
                <p className="plasmo-text-xs plasmo-text-yellow-400">
                  Please save your changes to see them in action.
                </p>
              )}
            </div>
          </div>
        </>
      
      <ToastContainer />
    </div>
  );
};

export default HomePage;