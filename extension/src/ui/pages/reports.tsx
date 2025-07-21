import React, { useEffect, useState } from 'react';
import { FileText, ExternalLink, Loader2, Filter, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { isAuthenticated, getToken } from '../../utils/auth';
import capitalizeWords from '../../utils/capitalizeWords';

const FilterButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`plasmo-px-3 plasmo-py-1 plasmo-text-xs plasmo-rounded-full plasmo-transition-colors ${
      active 
        ? 'plasmo-bg-blue-500 plasmo-text-white' 
        : 'plasmo-bg-gray-700 plasmo-text-gray-300 hover:plasmo-bg-gray-600'
    }`}
  >
    {label}
  </button>
);

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingReportId, setDownloadingReportId] = useState(null);
  const [filters, setFilters] = useState({
    timeframe: '30',
    platform: 'all',
    severity: 'all',
    hasScreenshots: false
  });

  const handleViewReport = async (reportId) => {
    try {
      setDownloadingReportId(reportId);
      
      const token = await getToken();
      const response = await fetch(
        `https://harassment-saver-extension.onrender.com/api/v1/user/view-report/${reportId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          
          if (data.pdfBase64) {
            const byteCharacters = atob(data.pdfBase64);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
            
            const pdfUrl = URL.createObjectURL(pdfBlob);
            chrome.tabs.create({ url: pdfUrl });
          } else {
            toast.error('Invalid PDF data received');
          }
        } else {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          chrome.tabs.create({ url: url });
        }
      } else {
        toast.error('Failed to fetch report PDF');
      }
    } catch (error) {
      console.error('Error viewing report:', error);
      toast.error('Error viewing report');
    } finally {
      setDownloadingReportId(null);
    }
  };

  const fetchReports = async (queryParams = '') => {
    setLoading(true);
    const authenticated = await isAuthenticated();
    if (authenticated) {
      try {
        const token = await getToken();
        const response = await fetch(
          `https://harassment-saver-extension.onrender.com/api/v1/user/saved-reports${queryParams}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        
        if (data.success) {
          setReports(data.data.reports);
        } else {
          setError(data.error?.message || 'Failed to fetch reports');
        }
      } catch (error) {
        setError('An error occurred while fetching reports');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please log in to view reports');
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (filters.timeframe !== 'all') queryParams.append('timeframe', filters.timeframe);
    if (filters.platform !== 'all') queryParams.append('platform', filters.platform);
    if (filters.severity !== 'all') queryParams.append('severity', filters.severity);
    if (filters.hasScreenshots) queryParams.append('hasScreenshots', 'true');
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    fetchReports(queryString);
  }, [filters]);

  const getSeverityColor = (severity) => {
    const colors = {
      HIGH: 'plasmo-bg-red-500/20 plasmo-text-red-400',
      MEDIUM: 'plasmo-bg-yellow-500/20 plasmo-text-yellow-400',
      LOW: 'plasmo-bg-green-500/20 plasmo-text-green-400'
    };
    return colors[severity] || 'plasmo-bg-gray-500/20 plasmo-text-gray-400';
  };

  if (loading) {
    return (
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-64">
        <Loader2 className="plasmo-w-6 plasmo-h-6 plasmo-animate-spin plasmo-text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="plasmo-p-4 plasmo-text-center">
        <div className="plasmo-text-red-400 plasmo-mb-4">{error}</div>
        {error === 'Please log in to view reports' && (
          <button
            onClick={() => chrome.runtime.sendMessage({ action: "initiateLogin" })}
            className="plasmo-bg-blue-600 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-md hover:plasmo-bg-blue-700 plasmo-transition-colors"
          >
            Login
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="plasmo-w-[320px] plasmo-min-h-[480px] plasmo-bg-gray-900 plasmo-text-white plasmo-overflow-y-auto">
      <div className="plasmo-p-4">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-6">
          <h2 className="plasmo-text-xl plasmo-font-semibold plasmo-text-white">Reports</h2>
          <button
            onClick={() => chrome.tabs.create({
              url: 'https://safe-dm-dashboard.vercel.app/dashboard/profile'
            })}
            className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-sm plasmo-text-blue-500 hover:plasmo-text-blue-400 plasmo-transition-colors"
          >
            <span>View All</span>
            <ExternalLink className="plasmo-w-4 plasmo-h-4" />
          </button>
        </div>

        <div className="plasmo-space-y-4 plasmo-mb-6">
          <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
            <Filter className="plasmo-w-4 plasmo-h-4 plasmo-text-gray-400" />
            <span className="plasmo-text-sm plasmo-text-gray-400">Filters:</span>
          </div>
          
          <div className="plasmo-flex plasmo-flex-wrap plasmo-gap-2">
            <FilterButton 
              label="Last 7 days"
              active={filters.timeframe === '7'}
              onClick={() => setFilters(prev => ({ ...prev, timeframe: '7' }))}
            />
            <FilterButton 
              label="Last 30 days"
              active={filters.timeframe === '30'}
              onClick={() => setFilters(prev => ({ ...prev, timeframe: '30' }))}
            />
            <FilterButton 
              label="Has Screenshots"
              active={filters.hasScreenshots}
              onClick={() => setFilters(prev => ({ ...prev, hasScreenshots: !prev.hasScreenshots }))}
            />
            <FilterButton 
              label="High Severity"
              active={filters.severity === 'HIGH'}
              onClick={() => setFilters(prev => ({ ...prev, severity: prev.severity === 'HIGH' ? 'all' : 'HIGH' }))}
            />
          </div>
        </div>

        {!loading && !error && reports.length === 0 && (
          <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-64 plasmo-text-gray-400">
            <FileText className="plasmo-w-12 plasmo-h-12 plasmo-mb-4 plasmo-opacity-50" />
            <p>No reports found</p>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="plasmo-space-y-4">
            {reports.map((report) => (
              <div 
                key={report.id}
                className="plasmo-bg-gray-800 plasmo-rounded-lg plasmo-p-4 plasmo-border plasmo-border-gray-700"
              >
                <div className="plasmo-flex plasmo-justify-between plasmo-items-start plasmo-mb-4">
                  <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                    <img
                      src={report.userDetails?.randomProfileImage || 'https://avatar.iran.liara.run/public/11'}
                      alt={report.userName}
                      className="plasmo-w-8 plasmo-h-8 plasmo-rounded-full"
                    />
                    <div>
                      <div className="plasmo-font-medium plasmo-text-ellipsis">{capitalizeWords(report.userName)}</div>
                      <div className="plasmo-text-sm plasmo-text-gray-400">{capitalizeWords(report.platform)}</div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleViewReport(report.id)}
                      disabled={downloadingReportId !== null}
                      className={`plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-px-3 plasmo-py-1 plasmo-text-sm plasmo-rounded-md 
                        ${downloadingReportId === report.id 
                          ? 'plasmo-bg-blue-500/10 plasmo-text-blue-300' 
                          : 'plasmo-bg-blue-500/20 plasmo-text-blue-400 hover:plasmo-bg-blue-500/30'
                        } 
                        plasmo-transition-colors`}
                    >
                      {downloadingReportId === report.id ? (
                        <>
                          <Loader2 className="plasmo-w-4 plasmo-h-4 plasmo-animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="plasmo-w-4 plasmo-h-4" />
                          <span>View PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="plasmo-space-y-3">
                  <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                    <span className={`plasmo-px-2 plasmo-py-1 plasmo-rounded-full plasmo-text-xs ${
                      getSeverityColor(report.analysis?.severity)
                    }`}>
                      {report.analysis?.severity} Risk
                    </span>
                    {report.userDetails?.isKnownHarasser && (
                      <span className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-px-2 plasmo-py-1 plasmo-rounded-full plasmo-text-xs plasmo-bg-red-500/20 plasmo-text-red-400">
                        <AlertTriangle className="plasmo-w-3 plasmo-h-3" />
                        Known Harasser
                      </span>
                    )}
                  </div>

                  {report.evidence?.messagePreview?.length > 0 && (
                    <div className="plasmo-bg-gray-900 plasmo-rounded-md plasmo-p-3">
                      {report.evidence.messagePreview.map((msg, idx) => (
                        <div key={idx} className="plasmo-mb-2 plasmo-last:plasmo-mb-0">
                          <div className="plasmo-text-gray-400 plasmo-text-xs plasmo-mb-1">
                            {new Date(msg.timestamp).toLocaleString()}
                          </div>
                          <div className="plasmo-text-sm">{msg.content}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {report.analysis?.keyFindings?.length > 0 && (
                    <div className="plasmo-text-sm plasmo-text-gray-300">
                      <div className="plasmo-font-medium plasmo-mb-2">Key Findings:</div>
                      <ul className="plasmo-list-disc plasmo-list-inside plasmo-space-y-1">
                        {report.analysis.keyFindings.slice(0, 2).map((finding, idx) => (
                          <li key={idx}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.evidence?.screenshotPreviews?.length > 0 && (
                    <div className="plasmo-flex plasmo-gap-2 plasmo-mt-2">
                      {report.evidence.screenshotPreviews.slice(0, 2).map((screenshot, idx) => (
                        <img
                          key={idx}
                          src={screenshot.url}
                          alt={screenshot.context || 'Evidence screenshot'}
                          className="plasmo-w-16 plasmo-h-16 plasmo-object-cover plasmo-rounded-md"
                        />
                      ))}
                      {report.evidence.screenshotPreviews.length > 2 && (
                        <div className="plasmo-w-16 plasmo-h-16 plasmo-bg-gray-700 plasmo-rounded-md plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-gray-400 plasmo-text-sm">
                          +{report.evidence.screenshotPreviews.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="plasmo-mt-4 plasmo-pt-4 plasmo-border-t plasmo-border-gray-700">
                  <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                    <span className="plasmo-text-xs plasmo-text-gray-400">
                      Generated on {new Date(report.metadata.generatedAt).toLocaleString()}
                    </span>
                    <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-xs">
                      {report.evidence?.screenshotCount > 0 && (
                        <span className="plasmo-text-gray-400">
                          {report.evidence.screenshotCount} screenshot{report.evidence.screenshotCount !== 1 ? 's' : ''}
                        </span>
                      )}
                      {report.evidence?.statistics?.total > 0 && (
                        <span className="plasmo-text-gray-400">
                          {report.evidence.statistics.total} message{report.evidence.statistics.total !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;