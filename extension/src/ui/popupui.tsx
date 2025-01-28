import React, { useState } from 'react';
import { Settings2, Shield } from 'lucide-react';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import ReportsPage from './pages/reports';
import BlockedPage from './pages/blocked';
import NavigationBar from './components/navigation-bar';

const PopupUI = () => {
    const [currentPage, setCurrentPage] = useState('home');

    const renderPage = () => {
        switch (currentPage) {
            case 'settings':
                return <SettingsPage />;
            case 'reports':
                return <ReportsPage />;
            case 'blocked':
                return <BlockedPage />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="plasmo-w-[320px] plasmo-h-[480px] plasmo-bg-gray-900 plasmo-text-white plasmo-font-sans plasmo-flex plasmo-flex-col">
            <Header />
            <div className="plasmo-flex-1 plasmo-overflow-auto plasmo-pb-16">
                {renderPage()}
            </div>
            <NavigationBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
};

const Header = () => {
    return (
        <div className="plasmo-p-4 plasmo-border-b plasmo-border-gray-800">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                    <Shield className="plasmo-w-6 plasmo-h-6 plasmo-text-blue-500" />
                    <span className="plasmo-font-bold plasmo-text-lg">Harassment Saver</span>
                </div>
                <button className="plasmo-p-2 plasmo-rounded-md hover:plasmo-bg-gray-800">
                    <Settings2 className="plasmo-w-5 plasmo-h-5" />
                </button>
            </div>
        </div>
    );
};

export default PopupUI;