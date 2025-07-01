import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const ProjectCreationModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    currentStage: 'Planning',
    status: 'In Progress',
    lockboxCode: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Project address is required';
    }
    
    if (formData.targetDate && formData.targetDate < formData.startDate) {
      newErrors.targetDate = 'Target date cannot be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit({
        name: formData.name.trim(),
        address: formData.address.trim(),
        startDate: formData.startDate,
        targetDate: formData.targetDate || null,
        currentStage: formData.currentStage,
        status: formData.status,
        lockboxCode: formData.lockboxCode.trim(),
        tags: formData.tags.trim()
      });
      
      // Reset form on success
      setFormData({
        name: '',
        address: '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: '',
        currentStage: 'Planning',
        status: 'In Progress',
        lockboxCode: '',
        tags: ''
      });
      setErrors({});
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        address: '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: '',
        currentStage: 'Planning',
        status: 'In Progress',
        lockboxCode: '',
        tags: ''
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <ApperIcon name="Home" size={20} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                  <p className="text-sm text-gray-500">Add a new fix & flip project</p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. 123 Main Street Renovation"
                  disabled={loading}
                  error={errors.name}
                />
              </div>
              
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Address *
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street, City, State"
                  disabled={loading}
                  error={errors.address}
                />
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Date
                  </label>
                  <Input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => handleInputChange('targetDate', e.target.value)}
                    disabled={loading}
                    error={errors.targetDate}
                  />
                </div>
              </div>
              
              {/* Stage and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stage
                  </label>
                  <select
                    value={formData.currentStage}
                    onChange={(e) => handleInputChange('currentStage', e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Demo">Demo</option>
                    <option value="Rough-In">Rough-In</option>
                    <option value="Finishes">Finishes</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="On Market">On Market</option>
                    <option value="Sold">Sold</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>
              </div>
              
              {/* Lockbox Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lockbox Code
                </label>
                <Input
                  value={formData.lockboxCode}
                  onChange={(e) => handleInputChange('lockboxCode', e.target.value)}
                  placeholder="Optional lockbox access code"
                  disabled={loading}
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Optional tags (comma separated)"
                  disabled={loading}
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader2" size={16} />
                      </motion.div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Plus" size={16} />
                      Create Project
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectCreationModal;