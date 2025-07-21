import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import { isAuthenticated, getToken } from '../../utils/auth';

const ProfileSection = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userImage, setUserImage] = useState('https://avatar.iran.liara.run/public/75');
    const [userName, setUserName] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = await isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                fetchProfileData();
            }
        };


        const fetchProfileData = async () => {
            try {
                const token = await getToken();
                const response = await fetch('https://harassment-saver-extension.onrender.com/api/v1/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                if (result.status === 'success') {
                    setUserImage(result.data.user.profilePicture);
                    setUserName(result.data.user.name);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        checkAuth();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogin = () => {
        if (!isLoggedIn) {
            chrome.runtime.sendMessage({ action: "initiateLogin" });
        }
    };

    const handleViewProfile = () => {
        chrome.tabs.create({
            url: 'https://safe-dm-dashboard.vercel.app/dashboard/profile'
        });
        setIsOpen(false);
    };

    const handleLogout = () => {
        chrome.storage.local.remove('authToken', () => {
            setIsLoggedIn(false);
            setIsOpen(false);
        });
    };

    if (!isLoggedIn) {
        return (
            <button
                className="plasmo-px-3 plasmo-py-1 plasmo-text-sm plasmo-bg-gray-800 plasmo-rounded-md plasmo-hover:bg-gray-700 plasmo-transition-colors"
                onClick={handleLogin}
            >
                Login
            </button>
        );
    }

    return (
        <div className="plasmo-relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="plasmo-w-8 plasmo-h-8 plasmo-rounded-full plasmo-overflow-hidden plasmo-border-2 plasmo-border-gray-700 hover:plasmo-border-gray-600 plasmo-transition-colors"
            >
                <img
                    src={userImage}
                    alt="Profile"
                    className="plasmo-w-full plasmo-h-full plasmo-object-cover"
                />
            </button>

            {isOpen && (
                <div className="plasmo-absolute plasmo-right-0 plasmo-mt-2 plasmo-w-48 plasmo-rounded-md plasmo-shadow-lg plasmo-bg-gray-800 plasmo-ring-1 plasmo-ring-black plasmo-ring-opacity-5">
                    <div className="plasmo-py-1" role="menu">
                        <button
                            onClick={handleViewProfile}
                            className="plasmo-flex plasmo-items-center plasmo-w-full plasmo-px-4 plasmo-py-2 plasmo-text-sm plasmo-text-gray-100 hover:plasmo-bg-gray-700"
                            role="menuitem"
                        >
                            <User className="plasmo-w-4 plasmo-h-4 plasmo-mr-2" />
                            View Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="plasmo-flex plasmo-items-center plasmo-w-full plasmo-px-4 plasmo-py-2 plasmo-text-sm plasmo-text-gray-100 hover:plasmo-bg-gray-700"
                            role="menuitem"
                        >
                            <LogOut className="plasmo-w-4 plasmo-h-4 plasmo-mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSection;
