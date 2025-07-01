import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { formatDateTime } from '@/utils/dateUtils';
import { getStageInfo } from '@/utils/stageUtils';

const MediaCard = ({ media, onClick, onDelete }) => {
  const stageInfo = getStageInfo(media.stage);
  const isVideo = media.type === 'video';

  const handleClick = () => {
    if (onClick) onClick(media);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(media.Id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={handleClick}
    >
      {/* Media Thumbnail */}
      <div className="relative aspect-video bg-gray-200">
        <img 
          src={media.thumbnailUrl} 
          alt="Project update"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
              <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#e5e7eb"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="16">${isVideo ? 'Video' : 'Photo'}</text>
              </svg>
            `);
          }}
        />
        
        {/* Video Play Button */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-3">
              <ApperIcon name="Play" size={24} className="text-white ml-1" />
            </div>
          </div>
        )}
        
        {/* Delete Button */}
        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 bg-error text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        )}
        
        {/* Stage Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="primary" size="sm">
            {stageInfo.label}
          </Badge>
        </div>
      </div>
      
      {/* Media Info */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <ApperIcon 
              name={isVideo ? "Video" : "Camera"} 
              size={16} 
              className="text-gray-500" 
            />
            <span className="text-sm font-medium text-gray-900">
              {isVideo ? 'Video Update' : 'Photo Update'}
            </span>
          </div>
        </div>
        
        {media.notes && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {media.notes}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDateTime(media.timestamp)}</span>
          <span>{media.uploadedBy}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;