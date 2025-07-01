import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ProjectStats = ({ projects, compliance }) => {
  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(p => p.status === 'In Progress').length || 0;
  const completedProjects = projects?.filter(p => p.status === 'Complete' || p.status === 'Sold').length || 0;
  const complianceIssues = Array.isArray(compliance) ? 
    compliance.filter(c => c.requiresUpdate).length : 0;

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: 'Home',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100'
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: 'Wrench',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      label: 'Completed',
      value: completedProjects,
      icon: 'CheckCircle',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      label: 'Need Updates',
      value: complianceIssues,
      icon: 'AlertTriangle',
      color: 'from-error to-red-600',
      bgColor: 'from-red-50 to-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-r ${stat.bgColor} rounded-xl p-4 border border-white shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className={`text-2xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
              <ApperIcon name={stat.icon} size={20} className="text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectStats;