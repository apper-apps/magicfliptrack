import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ProjectStats from '@/components/organisms/ProjectStats';
import ProjectGrid from '@/components/organisms/ProjectGrid';
import { useProjects } from '@/hooks/useProjects';
import { useCompliance } from '@/hooks/useCompliance';

const Dashboard = () => {
  const { projects, loading, error, loadProjects } = useProjects();
  const { compliance, loadCompliance } = useCompliance();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && projects.length > 0) {
      loadCompliance();
    }
  }, [projects, loading]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([loadProjects(), loadCompliance()]);
      toast.success('Dashboard refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  const handleProjectCapture = (project) => {
    toast.info(`Opening capture for ${project.name}`);
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadProjects}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                FlipTrack Pro
              </h1>
              <p className="text-gray-600 mt-1">
                Visual project management for fix & flip properties
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-lg"
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={refreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
              >
                <ApperIcon name="RefreshCw" size={20} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Stats */}
        <ProjectStats projects={projects} compliance={compliance} />
        
        {/* Projects Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-gray-900">
              Active Projects
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ApperIcon name="Home" size={16} />
              <span>{projects.filter(p => p.status === 'In Progress').length} active</span>
            </div>
          </div>
          
          <ProjectGrid
            projects={projects.filter(p => p.status === 'In Progress')}
            compliance={compliance}
            onProjectCapture={handleProjectCapture}
          />
        </div>
        
        {/* Recently Completed Projects */}
        {projects.filter(p => p.status === 'Complete' || p.status === 'Sold').length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-gray-900">
                Recently Completed
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ApperIcon name="CheckCircle" size={16} />
                <span>{projects.filter(p => p.status === 'Complete' || p.status === 'Sold').length} completed</span>
              </div>
            </div>
            
            <ProjectGrid
              projects={projects.filter(p => p.status === 'Complete' || p.status === 'Sold')}
              compliance={compliance}
              onProjectCapture={handleProjectCapture}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;