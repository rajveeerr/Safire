"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Save, User, Lock, Settings as SettingsIcon, Upload } from 'lucide-react';
import axios, { AxiosError } from 'axios';


// const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
// const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || '';

const CustomSwitch = ({ checked, onChange, id }: { checked: boolean; onChange: (checked: boolean) => void; id: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full
      transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500
      ${checked ? 'bg-purple-600' : 'bg-gray-600'}
    `}
  >
    <span className="sr-only">Toggle switch</span>
    <span
      className={`
        ${checked ? 'translate-x-6' : 'translate-x-1'}
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        shadow-lg
      `}
    />
  </button>
);

interface FormData {
  name: string;
  profilePicture: string;
  gender: string;
  preferences: {
    autoGenerateReport: boolean;
    autoSaveScreenshots: boolean;
    enableTags: boolean;
  };
  currentPassword: string;
  newPassword: string;
}

interface Message {
  type: 'success' | 'error' | '';
  content: string;
}

const Settings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: '', content: '' });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    profilePicture: '',
    gender: '',
    preferences: {
      autoGenerateReport: true,
      autoSaveScreenshots: false,
      enableTags: true
    },
    currentPassword: '',
    newPassword: ''
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', content: 'Please upload an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', content: 'Image size should be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    setMessage({ type: '', content: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      setFormData(prev => ({
        ...prev,
        profilePicture: response.data.secure_url
      }));

      setMessage({ type: 'success', content: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', content: 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      await axios.post(
        'https://harassment-saver-extension.onrender.com/api/v1/user/update-profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage({ type: 'success', content: 'Settings updated successfully!' });
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication token not found') {
        setMessage({ type: 'error', content: 'Please log in to update your settings' });
      } else {
        const axiosError = error as AxiosError<{ message: string }>;
        setMessage({ type: 'error', content: axiosError.response?.data?.message || 'Failed to update settings' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name: keyof FormData['preferences'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#0F0A1F] text-gray-100">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Card className="bg-[#1A1425] border-0 shadow-xl">
            <CardHeader className="border-b border-gray-700/50 bg-black/20 p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base sm:text-lg text-gray-100">Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-300">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="bg-[#2A2438] border-gray-700 text-gray-100 placeholder:text-gray-500 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePicture" className="text-sm font-medium text-gray-300">Profile Picture</Label>
                  <div className="space-y-3">
                    {formData.profilePicture && (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <img 
                          src={formData.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        className="relative bg-[#2A2438] border-gray-700 text-gray-100 hover:bg-[#352F44]"
                        disabled={uploadingImage}
                      >
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {uploadingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-300">Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, gender: value }))}
                  className="flex flex-wrap gap-4 sm:gap-6"
                >
                  {['male', 'female', 'other'].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <RadioGroupItem value={gender} id={gender} className="border-gray-600 text-purple-500" />
                      <Label htmlFor={gender} className="capitalize text-gray-300">{gender}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1425] border-0 shadow-xl">
            <CardHeader className="border-b border-gray-700/50 bg-black/20 p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base sm:text-lg text-gray-100">Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(formData.preferences).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-[#2A2438] hover:bg-[#352F44] transition-colors gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <Label htmlFor={key} className="text-sm sm:text-base font-medium text-gray-200">
                        {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Label>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {getPreferenceDescription(key)}
                      </p>
                    </div>
                    <CustomSwitch
                      id={key}
                      checked={value}
                      onChange={(checked) => handlePreferenceChange(key as keyof FormData['preferences'], checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1425] border-0 shadow-xl">
            <CardHeader className="border-b border-gray-700/50 bg-black/20 p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base sm:text-lg text-gray-100">Change Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-300">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className="bg-[#2A2438] border-gray-700 text-gray-100 placeholder:text-gray-500 w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-300">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="bg-[#2A2438] border-gray-700 text-gray-100 placeholder:text-gray-500 w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {message.content && (
            <div className={`p-3 sm:p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/50 text-green-300 border border-green-800' 
                : 'bg-red-900/50 text-red-300 border border-red-800'
            } text-sm sm:text-base`}>
              {message.content}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
    );
  };
  
  const getPreferenceDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      autoGenerateReport: "Automatically generate reports when incidents are detected",
      autoSaveScreenshots: "Automatically save screenshots of detected incidents",
      enableTags: "Enable tagging system for better organization"
    };
    return descriptions[key] || "";
  };
  
  export default Settings;