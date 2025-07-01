import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import StageSelector from '@/components/molecules/StageSelector';
import MediaTimeline from '@/components/organisms/MediaTimeline';
import QuickCaptureBar from '@/components/molecules/QuickCaptureBar';
import { useProjects } from '@/hooks/useProjects';
import { useMedia } from '@/hooks/useMedia';
import { useCompliance } from '@/hooks/useCompliance';
import { formatDate, calculateDaysElapsed } from '@/utils/dateUtils';
import { getStageInfo, getStageProgress } from '@/utils/stageUtils';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { updateProjectStage } = useProjects();
  const { media, loading: mediaLoading, loadMedia } = useMedia(id);
  const { compliance, markProjectUpdated } = useCompliance(id);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError('');
      // Simulate API call to get project by ID
      const mockProject = {
        Id: parseInt(id),
        name: `Project ${id}`,
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

  const handleStageChange = async (newStage) => {
    try {
      await updateProjectStage(id, newStage);
      setProject(prev => ({ ...prev, currentStage: newStage }));
      await markProjectUpdated(id);
      toast.success(`Project stage updated to ${newStage}`);
    } catch (err) {
      toast.error('Failed to update project stage');
    }
  };

  const handleMediaClick = (mediaItem) => {
    toast.info(`Opening ${mediaItem.type}: ${mediaItem.notes || 'No notes'}`);
  };

  const handleMediaDelete = async (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        // This would call media delete service
        toast.success('Media deleted successfully');
        loadMedia();
      } catch (err) {
        toast.error('Failed to delete media');
      }
    }
  };

  if (loading) {
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
  const requiresUpdate = compliance?.requiresUpdate || false;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-gray-900">
                {project.name}
              </h1>
              <p className="text-gray-600">{project.address}</p>
            </div>
            <Badge 
              variant={stageInfo.color.includes('green') ? 'success' : 'primary'}
              icon={stageInfo.icon}
            >
              {stageInfo.label}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Project Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Started</p>
              <p className="font-semibold">{formatDate(project.startDate)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Days Elapsed</p>
              <p className="font-semibold">{daysElapsed}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Lockbox</p>
              <p className="font-semibold font-mono">{project.lockboxCode}</p>
            </div>
          </div>

          {/* Compliance Warning */}
          {requiresUpdate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-error/10 to-red-600/10 border-l-4 border-error rounded-lg p-4 mt-4"
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="AlertTriangle" size={20} className="text-error" />
                <div>
                  <p className="font-semibold text-error">Update Required</p>
                  <p className="text-sm text-gray-600">
                    This project needs a visual update. Capture a photo or video to clear this flag.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Stage Selector */}
        <StageSelector
          currentStage={project.currentStage}
          onStageChange={handleStageChange}
        />

        {/* Media Timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-gray-900">
              Project Timeline
            </h2>
            <Button
              variant="outline"
              size="sm"
              icon="Timeline"
              onClick={() => navigate(`/timeline/${id}`)}
            >
              View All
            </Button>
          </div>

          {mediaLoading ? (
            <Loading type="timeline" />
          ) : (
            <MediaTimeline
              media={media.slice(0, 6)} // Show only recent 6 items
              onMediaClick={handleMediaClick}
              onMediaDelete={handleMediaDelete}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              icon="FileText"
              onClick={() => navigate(`/reports/${id}`)}
            >
              Generate Report
            </Button>
            <Button
              variant="secondary"
              icon="Share"
              onClick={() => toast.info('Share functionality coming soon')}
            >
              Share Project
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Capture Bar */}
      <QuickCaptureBar projectId={id} />
    </div>
  );
};

export default ProjectDetail;