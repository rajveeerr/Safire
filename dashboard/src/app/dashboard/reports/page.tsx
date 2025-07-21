"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  User, 
  Loader2, 
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface Message {
  content: string;
  timestamp: string;
}

interface Statistics {
  total: number;
}

interface Evidence {
  statistics: Statistics;
  messagePreview: Message[];
}

interface Analysis {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  riskLevel?: string;
}

interface Timestamps {
  created: string;
}

interface Report {
  id: string;
  userName: string;
  platform: string;
  analysis: Analysis;
  evidence: Evidence;
  timestamps: Timestamps;
}

interface MessageModalProps {
  report: Report;
}

const MessageModal: React.FC<MessageModalProps> = ({ report }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: Analysis['severity']): string => {
    switch (severity.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DialogContent className="max-w-2xl bg-[#1c1528] text-white border-gray-700 w-[90vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 flex-wrap">
          <User className="w-5 h-5" />
          <span className="break-words">{report.userName}&apos;s Messages</span>
          <Badge className={getSeverityColor(report.analysis.severity)}>
            {report.analysis.severity}
          </Badge>
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="bg-[#0a0118] w-full flex">
          <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
          <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <ScrollArea className="h-[50vh] md:h-[400px] rounded-md border border-gray-700 p-4">
            <div className="space-y-4">
              {report.evidence.messagePreview.map((message, idx) => (
                <div 
                  key={idx}
                  className="bg-[#0a0118] p-4 rounded-lg border border-gray-700"
                >
                  <p className="text-gray-200 break-words">{message.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400 flex-wrap">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{formatDate(message.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="space-y-4 p-4 bg-[#0a0118] rounded-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <h3 className="text-lg font-semibold">Risk Assessment</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#251d34] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Severity Level</p>
                <p className="text-lg font-semibold">{report.analysis.severity}</p>
              </div>
              
              <div className="bg-[#251d34] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Risk Level</p>
                <p className="text-lg font-semibold">{report.analysis.riskLevel || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-[#251d34] p-4 rounded-lg">
              <p className="text-sm text-gray-400">Message Statistics</p>
              <p className="text-lg font-semibold">{report.evidence.statistics.total} total messages</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: Analysis['severity']): string => {
    switch (severity.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get<{ data: { reports: Report[] } }>(
          'https://harassment-saver-extension.onrender.com/api/v1/user/saved-reports',
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
        setReports(response.data.data.reports);
        setLoading(false);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/login');
          setError('Session expired. Please log in again.');
        } else {
          const errorMessage = err instanceof AxiosError 
            ? err.response?.data?.message || 'Failed to fetch reports. Please try again later.'
            : 'Failed to fetch reports. Please try again later.';
          setError(errorMessage);
        }
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const filteredReports = reports.filter(report => 
    report.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.evidence.messagePreview.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0a0118]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0a0118]">
        <div className="text-center text-red-400 p-4 rounded-md">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0118] text-white">
      <div className="sticky top-0 bg-[#0a0118] z-10 p-3 sm:p-6 border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-purple-500 flex-shrink-0" />
                <h1 className="text-xl font-semibold">Recent Reports</h1>
              </div>
              <Badge variant="secondary" className="bg-purple-900 text-white">
                {filteredReports.length} of {reports.length}
              </Badge>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages, users, or platforms..."
              className="w-full bg-[#1c1528] text-gray-200 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredReports.map((report) => (
              <Card 
                key={report.id} 
                className="bg-[#21162e] border border-gray-700 shadow-lg hover:bg-[#2b1f3d] transition-all duration-200 transform hover:-translate-y-1 rounded-xl"
              >
                <CardHeader className="p-4 sm:p-5">
                  <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-md flex-shrink-0">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-200 text-base sm:text-lg font-semibold break-words">{report.userName}</CardTitle>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                          <span>{formatDate(report.timestamps.created)}</span>
                        </div>
                      </div>
                    </div>
              
                    {/* Severity Badge */}
                    <Badge 
                      className={`${getSeverityColor(report.analysis.severity)} px-2 sm:px-4 py-1 text-xs sm:text-sm font-medium rounded-full`}
                    >
                      {report.analysis.severity}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-5 pt-0 space-y-3 sm:space-y-4">
                  {/* Message Count */}
                  <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span>{report.evidence.statistics.total} messages</span>
                  </div>
              
                  {/* Message Preview */}
                  {report.evidence.messagePreview?.length > 0 && (
                    <div className="space-y-3">
                      {report.evidence.messagePreview.slice(0, 2).map((message, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#12091f] p-3 sm:p-4 rounded-lg text-gray-300 text-xs sm:text-sm border border-gray-700 shadow-sm"
                        >
                          <p className="text-gray-300 break-words">&quot;{message.content}&quot;</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              
                  {/* Risk Level & View Button */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {report.analysis.riskLevel && (
                      <div className="flex items-center space-x-2 text-yellow-500">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium">Risk: {report.analysis.riskLevel}</span>
                      </div>
                    )}
              
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setIsModalOpen(true);
                      }}
                    >
                      <span className="mr-1 sm:mr-2">View All</span>
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </Button>
                  </div>
              
                  {/* Platform Badge */}
                  <div className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                    <Badge variant="outline" className="border-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 text-gray-300 bg-[#28203b] rounded-md text-xs">
                      {report.platform}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedReport && <MessageModal report={selectedReport} />}
      </Dialog>
    </div>
  );
};

export default Reports;