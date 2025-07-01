import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StageMediaModal from '@/components/molecules/StageMediaModal';
import { getStageInfo, getAllStages, getStageProgress } from '@/utils/stageUtils';

const ProgressBar = ({ currentStage, progress, onStageClick, projectId }) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const stages = getAllStages();
  const currentStageIndex = stages.findIndex(stage => stage === currentStage);

  const getStageStatus = (stage, index) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'active';
    return 'inactive';
  };

  const handleStageClick = async (stage, index) => {
    // Only allow clicking on completed stages or current stage
    if (index <= currentStageIndex) {
      setSelectedStage(stage);
      setIsModalOpen(true);
      if (onStageClick) {
        await onStageClick(stage);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStage(null);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Title and Progress Percentage */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-display font-bold text-gray-900">
            Project Progress
          </h3>
          <span className="text-sm font-semibold text-primary-600">
            {Math.round(progress)}% Complete
          </span>
        </div>

        {/* Progress Bar with Stage Indicators */}
        <div className="relative">
          {/* Background Track */}
          <div className="progress-bar-container">
            {/* Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="progress-bar-fill"
              style={{ '--progress-width': `${progress}%` }}
            />
          </div>

          {/* Stage Indicators */}
          {stages.map((stage, index) => {
            const stageInfo = getStageInfo(stage);
            const status = getStageStatus(stage, index);
            const position = (index / (stages.length - 1)) * 100;
            const isClickable = index <= currentStageIndex;

            return (
              <motion.div
                key={stage}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200
                }}
                className={`stage-indicator ${status} ${isClickable ? 'clickable' : ''}`}
                style={{ left: `${position}%` }}
                onClick={() => handleStageClick(stage, index)}
                title={`${stageInfo.label} - ${isClickable ? 'Click to view photos/updates' : 'Coming soon'}`}
              >
                {status === 'completed' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <ApperIcon name="Check" size={12} />
                  </motion.div>
                ) : status === 'active' ? (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ApperIcon name={stageInfo.icon} size={12} />
                  </motion.div>
                ) : (
                  <ApperIcon name={stageInfo.icon} size={12} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stage Labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          {stages.map((stage, index) => {
            const stageInfo = getStageInfo(stage);
            const status = getStageStatus(stage, index);
            
            return (
              <div
                key={stage}
                className={`text-center flex-1 ${
                  status === 'active' ? 'font-semibold text-primary-600' :
                  status === 'completed' ? 'font-medium text-success' :
                  'text-gray-400'
                }`}
              >
                <div className="truncate px-1">
                  {stageInfo.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Stage Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-3 border border-primary-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-800">
              Currently in <strong>{getStageInfo(currentStage).label}</strong> stage
            </span>
          </div>
        </motion.div>
      </div>

      {/* Stage Media Modal */}
      <AnimatePresence>
        {isModalOpen && selectedStage && (
          <StageMediaModal
            stage={selectedStage}
            projectId={projectId}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressBar;