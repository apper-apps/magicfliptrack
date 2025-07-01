import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import MediaTimeline from '@/components/organisms/MediaTimeline';
import { useMedia } from '@/hooks/useMedia';
import { PROJECT_STAGES } from '@/utils/stageUtils';

const TimelineView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  const { media, loading, error, loadMedia } = useMedia(projectId);

  const filteredMedia = media.filter(item => {
    const stageMatch = selectedStage === 'all' || item.stage === selectedStage;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return stageMatch && typeMatch;
  });

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
    return <Loading type="timeline" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadMedia}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
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
                Project Timeline
              </h1>
              <p className="text-gray-600">
                {projectId ? `Project #${projectId}` : 'All Projects'}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon="Camera"
              onClick={() => navigate(projectId ? `/capture/${projectId}` : '/capture')}
            >
              Capture
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total Updates</p>
              <p className="font-semibold text-lg">{media.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Photos</p>
              <p className="font-semibold text-lg">{media.filter(m => m.type === 'photo').length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Videos</p>
              <p className="font-semibold text-lg">{media.filter(m => m.type === 'video').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="space-y-3">
          {/* Stage Filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by Stage</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStage('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedStage === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Stages
              </motion.button>
              {PROJECT_STAGES.map((stage) => (
                <motion.button
                  key={stage.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStage(stage.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedStage === stage.key
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {stage.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Filter by Type</p>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All Types', icon: 'Grid' },
                { key: 'photo', label: 'Photos', icon: 'Camera' },
                { key: 'video', label: 'Videos', icon: 'Video' }
              ].map((type) => (
                <motion.button
                  key={type.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type.key
                      ? 'bg-secondary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ApperIcon name={type.icon} size={14} />
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-4">
        {filteredMedia.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredMedia.length} of {media.length} updates
              </p>
              <Button
                variant="outline"
                size="sm"
                icon="Download"
                onClick={() => toast.info('Export functionality coming soon')}
              >
                Export
              </Button>
            </div>
            
            <MediaTimeline
              media={filteredMedia}
              onMediaClick={handleMediaClick}
              onMediaDelete={handleMediaDelete}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-display font-bold text-gray-900 mb-2">
              No updates found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or capture your first update
            </p>
            <Button
              variant="primary"
              icon="Camera"
              onClick={() => navigate(projectId ? `/capture/${projectId}` : '/capture')}
            >
              Capture Update
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;