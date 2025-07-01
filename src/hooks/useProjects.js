import { useState, useEffect } from 'react';
import { projectService } from '@/services/api/projectService';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      setError('');
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id, updateData) => {
    try {
      setError('');
      const updatedProject = await projectService.update(id, updateData);
      setProjects(prev => prev.map(p => p.Id === parseInt(id) ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      setError('');
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.Id !== parseInt(id)));
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      throw err;
    }
  };

  const updateProjectStage = async (id, stage) => {
    try {
      setError('');
      const updatedProject = await projectService.updateStage(id, stage);
      setProjects(prev => prev.map(p => p.Id === parseInt(id) ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError(err.message || 'Failed to update project stage');
      throw err;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStage
  };
};