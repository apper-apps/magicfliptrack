import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickCaptureBar = ({ projectId, onPhotoCapture, onVideoCapture }) => {
  const navigate = useNavigate();

  const handlePhotoClick = () => {
    if (onPhotoCapture) {
      onPhotoCapture();
    } else {
      navigate(projectId ? `/capture/${projectId}?type=photo` : '/capture?type=photo');
    }
  };

  const handleVideoClick = () => {
    if (onVideoCapture) {
      onVideoCapture();
    } else {
      navigate(projectId ? `/capture/${projectId}?type=video` : '/capture?type=video');
    }
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="quick-capture-bar"
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePhotoClick}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
        >
          <ApperIcon name="Camera" size={20} />
          Photo
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleVideoClick}
          className="flex-1 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
        >
          <ApperIcon name="Video" size={20} />
          Video
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuickCaptureBar;