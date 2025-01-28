import React from 'react';
import { Bell, Shield, CloudLightning } from 'lucide-react';
import { Switch } from '../components/switch';

export default function SettingsPage() {
    const [settings, setSettings] = React.useState({
        notifications: true,
        autoBlock: false,
        aiDetection: true
    });

    return (
        <div className="plasmo-p-4">
            <h2 className="plasmo-text-xl plasmo-font-semibold plasmo-mb-6">Settings</h2>
            
            <div className="plasmo-space-y-6">
                <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                        <Bell className="plasmo-w-5 plasmo-h-5 plasmo-text-gray-400" />
                        <div>
                            <p className="plasmo-font-medium">Notifications</p>
                            <p className="plasmo-text-sm plasmo-text-gray-400">Get notified about harassment</p>
                        </div>
                    </div>
                    <Switch 
                        checked={settings.notifications} 
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                    />
                </div>

                <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                        <Shield className="plasmo-w-5 plasmo-h-5 plasmo-text-gray-400" />
                        <div>
                            <p className="plasmo-font-medium">Auto-block</p>
                            <p className="plasmo-text-sm plasmo-text-gray-400">Block users automatically</p>
                        </div>
                    </div>
                    <Switch 
                        checked={settings.autoBlock} 
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoBlock: checked }))}
                    />
                </div>

                <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                        <CloudLightning className="plasmo-w-5 plasmo-h-5 plasmo-text-gray-400" />
                        <div>
                            <p className="plasmo-font-medium">AI Detection</p>
                            <p className="plasmo-text-sm plasmo-text-gray-400">Enable AI-powered detection</p>
                        </div>
                    </div>
                    <Switch 
                        checked={settings.aiDetection} 
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, aiDetection: checked }))}
                    />
                </div>
            </div>
        </div>
    );
}
