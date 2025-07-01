import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/molecules/ProjectCard';
import Empty from '@/components/ui/Empty';

const ProjectGrid = ({ projects, compliance, onProjectCapture, onAddProject }) => {
  if (!projects || projects.length === 0) {
    return (
      <Empty
        title="No Projects Yet"
        description="Start your first fix & flip project to begin tracking progress with visual updates"
        actionText="Add Project"
        iconName="Home"
        onAction={onAddProject}
      />
    );
  }

  const getComplianceForProject = (projectId) => {
    if (Array.isArray(compliance)) {
      return compliance.find(c => c.projectId === projectId.toString());
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard
            project={project}
            compliance={getComplianceForProject(project.Id)}
            onCapture={onProjectCapture}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGrid;