import React, { useEffect, useState } from 'react';
import { User, ExternalLink, Loader2, MessageSquare, X } from 'lucide-react';
import { isAuthenticated, getToken } from '../../utils/auth';
import { useNavigation } from '../popupui';
import capitalizeWords from '../../utils/capitalizeWords';

// Updated interfaces to match the new payload structure
interface HiddenUserStatistics {
  messageTypes: {
    text: number;
    media: number;
    voice: number;
  };
  totalMessagesHidden: number;
  lastMessageHidden: string;
}

interface HiddenUser {
  _id: string;
  name: string;
  profileUrl?: string;
  platform: string;
  randomProfileImage?: string;
  statistics: HiddenUserStatistics;
  metadata: {
    associatedPlatforms: string[];
    lastKnownActivity: string;
    profileHistory: any[];
  };
}

interface HiddenMessage {
  id: string;
  userName: string;
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
    statistics: HiddenUserStatistics;
  };
}

interface HiddenUsersResponse {
  status: string;
  data: {
    hiddenUsers: HiddenUser[];
    total: number;
  };
}

interface HiddenMessagesResponse {
  status: string;
  data: {
    messages: HiddenMessage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

const BlockedPage = () => {
  const [hiddenUsers, setHiddenUsers] = useState<HiddenUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalHiddenUsers: 0, totalHiddenMessages: 0 });
  const [selectedUser, setSelectedUser] = useState<HiddenUser | null>(null);
  const [userMessages, setUserMessages] = useState<HiddenMessage[]>([]);
  const [userMessagesLoading, setUserMessagesLoading] = useState(false);
  const { setCurrentPage } = useNavigation();

  // Fetch hidden users
  useEffect(() => {
    const fetchHiddenUsers = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        try {
          const token = await getToken();
          const response = await fetch("https://harassment-saver-extension.onrender.com/api/v1/user/hidden-users", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data: HiddenUsersResponse = await response.json();
          
          if (data.status === 'success') {
            setHiddenUsers(data.data.hiddenUsers || []);
            
            // Calculate total hidden messages from user statistics
            const totalHiddenMessages = data.data.hiddenUsers.reduce(
              (total, user) => total + (user.statistics?.totalMessagesHidden || 0), 
              0
            );

            setStats({
              totalHiddenUsers: data.data.total || 0,
              totalHiddenMessages: totalHiddenMessages
            });
          } else {
            setError('Failed to fetch hidden users');
          }
        } catch (error) {
          setError('An error occurred while fetching hidden users');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Please log in to view hidden users');
        setLoading(false);
      }
    };

    fetchHiddenUsers();
  }, []);

  // Fetch user messages
  const fetchUserMessages = async (user: HiddenUser) => {
    try {
      setSelectedUser(user);
      setUserMessagesLoading(true);
      setUserMessages([]);
  
      const token = await getToken();
      const response = await fetch(
        `https://harassment-saver-extension.onrender.com/api/v1/user/hidden-messages?page=1&userName=${encodeURIComponent(user.name)}&platform=${encodeURIComponent(user.platform)}&sortBy=timeOfMessage&sortOrder=desc`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data: HiddenMessagesResponse = await response.json();
      
      if (data.status === 'success') {
        setUserMessages(data.data.messages);
      } else {
        // Even if messages fetch fails, still set the user
        setUserMessages([]);
        setError('Failed to fetch user messages');
      }
    } catch (error) {
      // Even if there's an error, ensure user details are shown
      setUserMessages([]);
      setError('An error occurred while fetching user messages');
    } finally {
      setUserMessagesLoading(false);
    }
  };
  const handleViewDashboard = () => {
    chrome.tabs.create({
      url: 'https://safe-dm-dashboard.vercel.app/dashboard/profile'
    });
  };

  const openUserDetails = (user: HiddenUser) => {
    setSelectedUser(user);
    fetchUserMessages(user);
  };

  const handleViewProfile = (profileUrl?: string) => {
    if (profileUrl) {
      chrome.tabs.create({ url: profileUrl });
    }
  };

  const handleViewMessages = () => {
    setCurrentPage('messages');
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setUserMessages([]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-64">
        <Loader2 className="plasmo-w-6 plasmo-h-6 plasmo-animate-spin plasmo-text-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="plasmo-p-4 plasmo-text-center" style={{ userSelect: 'none' }}>
        <div className="plasmo-text-red-400 plasmo-mb-4">{error}</div>
        {error === 'Please log in to view hidden users' && (
          <button
            onClick={() => chrome.runtime.sendMessage({ action: "initiateLogin" })}
            className="plasmo-bg-blue-600 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-md plasmo-hover:bg-blue-700 plasmo-transition-colors"
          >
            Login
          </button>
        )}
      </div>
    );
  }

  const renderUserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50 plasmo-z-50 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-p-4">
        <div className="plasmo-bg-gray-900 plasmo-rounded-lg plasmo-w-full plasmo-max-w-2xl plasmo-max-h-[90vh] plasmo-overflow-y-auto plasmo-relative plasmo-p-6">
          <button 
            onClick={closeUserDetails}
            className="plasmo-absolute plasmo-top-4 plasmo-right-4 plasmo-text-gray-400 plasmo-hover:text-white"
          >
            <X className="plasmo-w-6 plasmo-h-6" />
          </button>

          <div className="plasmo-flex plasmo-items-center plasmo-gap-4 plasmo-mb-6">
            <div 
              className="plasmo-w-16 plasmo-h-16 plasmo-rounded-full plasmo-overflow-hidden plasmo-bg-gray-700 plasmo-flex plasmo-items-center plasmo-justify-center"
              onClick={() => handleViewProfile(selectedUser.profileUrl)}
              style={{ cursor: selectedUser.profileUrl ? 'pointer' : 'default' }}
            >
              {selectedUser.randomProfileImage ? (
                <img 
                  src={selectedUser.randomProfileImage} 
                  alt={selectedUser.name} 
                  className="plasmo-w-full plasmo-h-full plasmo-object-cover"
                />
              ) : (
                <User className="plasmo-w-8 plasmo-h-8 plasmo-text-gray-400" />
              )}
            </div>
            
            <div>
              <h2 className="plasmo-text-xl plasmo-font-semibold plasmo-text-white">
                {capitalizeWords(selectedUser.name)}
              </h2>
              <p className="plasmo-text-sm plasmo-text-gray-400">
                Platform: {capitalizeWords(selectedUser.platform)}
              </p>
            </div>
          </div>

          <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-4 plasmo-mb-6">
            <div className="plasmo-bg-gray-800 plasmo-p-4 plasmo-rounded-lg">
              <div className="plasmo-text-sm plasmo-text-gray-400">Total Messages Hidden</div>
              <div className="plasmo-text-2xl plasmo-font-bold plasmo-text-white">
                {selectedUser.statistics.totalMessagesHidden || 0}
              </div>
            </div>
            <div className="plasmo-bg-gray-800 plasmo-p-4 plasmo-rounded-lg">
              <div className="plasmo-text-sm plasmo-text-gray-400">Last Hidden On</div>
              <div className="plasmo-text-lg plasmo-font-semibold plasmo-text-white">
                {selectedUser.statistics.lastMessageHidden 
                  ? new Date(selectedUser.statistics.lastMessageHidden).toLocaleDateString() 
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div>
            <h3 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-4">Recent Hidden Messages</h3>
            {userMessagesLoading ? (
              <div className="plasmo-flex plasmo-justify-center plasmo-items-center plasmo-h-32">
                <Loader2 className="plasmo-w-6 plasmo-h-6 plasmo-animate-spin plasmo-text-blue-500" />
              </div>
            ) : userMessages.length ? (
              <div className="plasmo-space-y-3">
                {userMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className="plasmo-bg-gray-800 plasmo-p-3 plasmo-rounded-lg plasmo-border plasmo-border-gray-700"
                  >
                    <div className="plasmo-text-sm plasmo-text-gray-300 plasmo-mb-2">
                      {new Date(message.timeOfMessage).toLocaleString()}
                    </div>
                    <div className="plasmo-text-white">{message.messageContent}</div>
                    <div className="plasmo-text-xs plasmo-text-gray-400 plasmo-mt-1">
                      {message.metadata.messageType} - {message.metadata.context}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="plasmo-text-center plasmo-text-gray-400">
                No hidden messages found
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="plasmo-p-4" style={{ userSelect: 'none' }}>
      {renderUserDetailsModal()}

      <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-6">
        <h2 className="plasmo-text-xl plasmo-font-semibold">Hidden Users</h2>
        <button
          onClick={handleViewDashboard}
          className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-sm plasmo-text-blue-500 plasmo-hover:text-blue-400"
        >
          <span>View All</span>
          <ExternalLink className="plasmo-w-4 plasmo-h-4" />
        </button>
      </div>

      <div className="plasmo-bg-gray-800/50 plasmo-rounded-lg plasmo-p-3 plasmo-mb-4 plasmo-flex plasmo-justify-between">
        <div>
          <div className="plasmo-text-sm plasmo-text-gray-400">Total Hidden</div>
          <div className="plasmo-text-lg plasmo-font-semibold">{stats.totalHiddenUsers} users</div>
        </div>
        <div 
          className="plasmo-cursor-pointer hover:plasmo-opacity-80"
          onClick={handleViewMessages}
        >
          <div className="plasmo-text-sm plasmo-text-gray-400">Messages Hidden</div>
          <div className="plasmo-text-lg plasmo-font-semibold plasmo-flex plasmo-items-center plasmo-gap-2">
            {stats.totalHiddenMessages}
            <MessageSquare className="plasmo-w-4 plasmo-h-4 plasmo-text-blue-500" />
          </div>
        </div>
      </div>

      {hiddenUsers.length === 0 ? (
        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-64 plasmo-text-gray-400">
          <User className="plasmo-w-12 plasmo-h-12 plasmo-mb-4 plasmo-opacity-50" />
          <p>No hidden users yet</p>
        </div>
      ) : (
        <div className="plasmo-space-y-3">
          {hiddenUsers.map((user) => (
            <div 
              key={user._id} 
              className="plasmo-bg-gray-800 plasmo-rounded-lg plasmo-p-3 plasmo-border plasmo-border-gray-700"
            >
              <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
                <div 
                  className="plasmo-w-10 plasmo-h-10 plasmo-rounded-full plasmo-overflow-hidden plasmo-bg-gray-700 plasmo-flex plasmo-items-center plasmo-justify-center"
                  onClick={() => handleViewProfile(user.profileUrl)}
                  style={{ cursor: user.profileUrl ? 'pointer' : 'default' }}
                >
                  {user.randomProfileImage ? (
                    <img 
                      src={user.randomProfileImage} 
                      alt={user.name} 
                      className="plasmo-w-full plasmo-h-full plasmo-object-cover"
                    />
                  ) : (
                    <User className="plasmo-w-5 plasmo-h-5 plasmo-text-gray-400" />
                  )}
                </div>
                
                <div className="plasmo-flex-1">
                  <a 
                    onClick={() => openUserDetails(user)}
                    className="plasmo-font-medium plasmo-mb-1 plasmo-text-blue-500 plasmo-hover:underline plasmo-cursor-pointer"
                  >
                    {capitalizeWords(user.name)}
                  </a>
                  <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-sm plasmo-text-gray-400">
                    <MessageSquare className="plasmo-w-4 plasmo-h-4" />
                    <span>{user.statistics.totalMessagesHidden || 0} messages hidden</span>
                  </div>
                  <div className="plasmo-text-xs plasmo-text-gray-500">Platform: {capitalizeWords(user.platform)}</div>
                </div>
              </div>

              {user.statistics.lastMessageHidden && (
                <div className="plasmo-mt-2 plasmo-pt-2 plasmo-border-t plasmo-border-gray-700">
                  <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-2 plasmo-text-sm">
                    <div className="plasmo-text-gray-400">Last Hidden:</div>
                    <div>{new Date(user.statistics.lastMessageHidden).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedPage;