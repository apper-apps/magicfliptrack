import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { useMedia } from '@/hooks/useMedia';
import { formatDate, formatDateTime, calculateDaysElapsed } from '@/utils/dateUtils';
import { getStageInfo, getStageProgress } from '@/utils/stageUtils';

const ReportGenerator = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState('');
  
  const { media, loading: mediaLoading } = useMedia(projectId);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError('');
      // Simulate API call to get project by ID
      const mockProject = {
        Id: parseInt(projectId),
        name: `Project ${projectId}`,
        address: '123 Main St, City, State',
        startDate: '2024-01-15',
        targetDate: '2024-04-15',
        currentStage: 'Demo',
        lastUpdateDate: '2024-01-20',
        lockboxCode: '4782',
        status: 'In Progress',
        thumbnailUrl: '/api/placeholder/400/300'
      };
      setProject(mockProject);
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would return the actual PDF URL
      const mockReportUrl = `https://fliptrack.com/reports/${projectId}-${Date.now()}.pdf`;
      setReportUrl(mockReportUrl);
      
      toast.success('Report generated successfully!');
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareReport = async () => {
    if (reportUrl) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${project.name} - Project Report`,
            text: 'Check out this project progress report',
            url: reportUrl
          });
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(reportUrl);
          toast.success('Report URL copied to clipboard');
        }
      } catch (err) {
        toast.error('Failed to share report');
      }
    }
  };

  const handleDownloadReport = () => {
    if (reportUrl) {
      // In a real app, this would trigger the download
      toast.success('Download started');
    }
  };

  if (loading || mediaLoading) {
    return <Loading />;
  }

  if (error || !project) {
    return (
      <Error 
        message={error || 'Project not found'} 
        onRetry={loadProjectData}
      />
    );
  }

  const stageInfo = getStageInfo(project.currentStage);
  const progress = getStageProgress(project.currentStage);
  const daysElapsed = calculateDaysElapsed(project.startDate);
  const photoCount = media.filter(m => m.type === 'photo').length;
  const videoCount = media.filter(m => m.type === 'video').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                Report Generator
              </h1>
              <p className="text-gray-600">{project.name}</p>
            </div>
            <Badge variant="info" icon="FileText">
              PDF Report
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Report Preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold">
                  Project Progress Report
                </h2>
                <p className="opacity-90 mt-1">
                  Generated on {formatDate(new Date())}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm opacity-90">Complete</div>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Project Summary */}
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                Project Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Project Name</p>
                  <p className="font-semibold">{project.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-sm">{project.address}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold">{formatDate(project.startDate)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Days Elapsed</p>
                  <p className="font-semibold">{daysElapsed} days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Current Stage</p>
                  <Badge variant="primary" size="sm">
                    {stageInfo.label}
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Target Date</p>
                  <p className="font-semibold">{formatDate(project.targetDate)}</p>
                </div>
              </div>
            </div>

            {/* Progress Visualization */}
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                Progress Overview
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Media Statistics */}
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                Documentation Stats
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-display font-bold text-blue-600">
                    {media.length}
                  </div>
                  <p className="text-sm text-blue-700">Total Updates</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-display font-bold text-green-600">
                    {photoCount}
                  </div>
                  <p className="text-sm text-green-700">Photos</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-display font-bold text-purple-600">
                    {videoCount}
                  </div>
                  <p className="text-sm text-purple-700">Videos</p>
                </div>
              </div>
            </div>

            {/* Recent Updates Preview */}
            {media.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
                  Recent Updates Preview
                </h3>
                <div className="space-y-3">
                  {media.slice(0, 3).map((item) => (
                    <div key={item.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ApperIcon 
                          name={item.type === 'video' ? 'Video' : 'Camera'} 
                          size={16} 
                          className="text-gray-500"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.stage} - {item.type}</p>
                        <p className="text-xs text-gray-600">{formatDateTime(item.timestamp)}</p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 truncate">{item.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Generate & Share Report
          </h3>
          
          {!reportUrl ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isGenerating}
              onClick={handleGenerateReport}
              icon="FileText"
            >
              {isGenerating ? 'Generating PDF...' : 'Generate PDF Report'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
                  <p className="font-semibold text-green-800">Report Generated!</p>
                </div>
                <p className="text-sm text-green-700">
                  Your PDF report is ready for download and sharing.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  icon="Download"
                  onClick={handleDownloadReport}
                >
                  Download
                </Button>
                <Button
                  variant="secondary"
                  icon="Share"
                  onClick={handleShareReport}
                >
                  Share URL
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Shareable URL:</p>
                <p className="text-sm font-mono text-gray-700 truncate">
                  {reportUrl}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Report Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Report Includes
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: 'FileText', text: 'Project summary and timeline' },
              { icon: 'BarChart3', text: 'Progress visualization charts' },
              { icon: 'Camera', text: 'Photo gallery with timestamps' },
              { icon: 'Video', text: 'Video documentation index' },
              { icon: 'Calendar', text: 'Stage progression timeline' },
              { icon: 'AlertTriangle', text: 'Compliance status tracking' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name={feature.icon} size={16} className="text-primary-600" />
                </div>
                <p className="text-gray-700">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;