import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { formatDate, calculateDaysElapsed } from '@/utils/dateUtils';
import { getStageInfo, getStageProgress } from '@/utils/stageUtils';

const ProjectCard = ({ project, compliance, onCapture }) => {
  const navigate = useNavigate();
  const stageInfo = getStageInfo(project.currentStage);
  const progress = getStageProgress(project.currentStage);
  const daysElapsed = calculateDaysElapsed(project.startDate);
  const requiresUpdate = compliance?.requiresUpdate || false;
  const daysSinceUpdate = compliance?.daysSinceUpdate || 0;

  const handleCardClick = () => {
    navigate(`/project/${project.Id}`);
  };

  const handleCaptureClick = (e) => {
    e.stopPropagation();
    if (onCapture) {
      onCapture(project);
    } else {
      navigate(`/capture/${project.Id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="project-card relative overflow-hidden">
        {/* Project Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 overflow-hidden">
          <img 
            src={project.thumbnailUrl} 
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#e5e7eb"/>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="24">No Image</text>
                </svg>
              `);
            }}
          />
          
          {/* Quick Capture Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCaptureClick}
            className="absolute top-2 right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ApperIcon name="Camera" size={16} />
          </motion.button>
        </div>

        {/* Project Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-display font-bold text-lg text-gray-900 leading-tight">
              {project.name}
            </h3>
            <Badge variant={stageInfo.color.includes('green') ? 'success' : 'primary'} size="sm">
              {stageInfo.label}
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm">
            {project.address}
          </p>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              />
            </div>
          </div>
          
          {/* Project Stats */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>Started: {formatDate(project.startDate)}</span>
            <span>{daysElapsed} days elapsed</span>
          </div>
        </div>
        
        {/* Compliance Flag Overlay */}
        {requiresUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="compliance-overlay"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ApperIcon name="AlertTriangle" size={32} className="mb-2" />
            </motion.div>
            <div className="text-center">
              <p className="font-display font-bold text-lg mb-1">UPDATE REQUIRED</p>
              <p className="text-sm opacity-90">
                {daysSinceUpdate} days since last update
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;