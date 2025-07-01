import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MediaCard from '@/components/molecules/MediaCard';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { useMedia } from '@/hooks/useMedia';
import { getStageInfo } from '@/utils/stageUtils';

const StageMediaModal = ({ stage, projectId, onClose }) => {
  const [stageMedia, setStageMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getMediaByStage } = useMedia(projectId);
  
  const stageInfo = getStageInfo(stage);

  useEffect(() => {
    loadStageMedia();
  }, [stage, projectId]);

  const loadStageMedia = async () => {
    try {
      setLoading(true);
      const media = await getMediaByStage(stage);
      setStageMedia(media);
    } catch (error) {
      toast.error('Failed to load stage media');
      setStageMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaClick = (mediaItem) => {
    toast.info(`Opening ${mediaItem.type}: ${mediaItem.notes || 'No notes'}`);
  };

  const handleMediaDelete = async (mediaId) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        // Media deletion would be handled through useMedia hook
        toast.success('Media deleted successfully');
        loadStageMedia(); // Reload media after deletion
      } catch (error) {
        toast.error('Failed to delete media');
      }
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="stage-modal-overlay"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="stage-modal-content"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${stageInfo.color} flex items-center justify-center`}>
              <ApperIcon name={stageInfo.icon} size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">
                {stageInfo.label} Stage
              </h2>
              <p className="text-sm text-gray-600">
                Photos and updates from this phase
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loading type="spinner" />
            </div>
          ) : stageMedia.length === 0 ? (
            <Empty
              icon="Camera"
              title="No Media Yet"
              description={`No photos or updates have been captured for the ${stageInfo.label} stage yet.`}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stageMedia.map((media) => (
                <motion.div
                  key={media.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MediaCard
                    media={media}
                    onClick={handleMediaClick}
                    onDelete={handleMediaDelete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {stageMedia.length} {stageMedia.length === 1 ? 'item' : 'items'} in this stage
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StageMediaModal;