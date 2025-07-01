import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { PROJECT_STAGES } from '@/utils/stageUtils';

const StageSelector = ({ currentStage, onStageChange, disabled = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="font-display font-bold text-lg text-gray-900 mb-4">
        Project Stage
      </h3>
      
      <div className="grid grid-cols-1 gap-2">
        {PROJECT_STAGES.map((stage, index) => {
          const isActive = currentStage === stage.key;
          const isCompleted = PROJECT_STAGES.findIndex(s => s.key === currentStage) > index;
          
          return (
            <motion.button
              key={stage.key}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              onClick={() => !disabled && onStageChange(stage.key)}
              disabled={disabled}
              className={`
                flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200
                ${isActive 
                  ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isActive 
                  ? 'bg-primary-500 text-white' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }
              `}>
                <ApperIcon 
                  name={isCompleted ? 'Check' : stage.icon} 
                  size={16} 
                />
              </div>
              
              <div className="flex-1 text-left">
                <p className={`font-semibold ${
                  isActive ? 'text-primary-700' : 
                  isCompleted ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {stage.label}
                </p>
              </div>
              
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-primary-500 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StageSelector;