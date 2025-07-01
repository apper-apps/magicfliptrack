import { useState, useEffect } from 'react';
import { complianceService } from '@/services/api/complianceService';

export const useCompliance = (projectId = null) => {
  const [compliance, setCompliance] = useState(projectId ? null : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCompliance = async () => {
    try {
      setLoading(true);
      setError('');
      const data = projectId 
        ? await complianceService.getByProjectId(projectId)
        : await complianceService.getAll();
      setCompliance(data);
    } catch (err) {
      setError(err.message || 'Failed to load compliance data');
    } finally {
      setLoading(false);
    }
  };

  const updateCompliance = async (id, statusData) => {
    try {
      setError('');
      const updatedStatus = await complianceService.update(id, statusData);
      if (projectId) {
        setCompliance(updatedStatus);
      } else {
        setCompliance(prev => prev.map(c => 
          c.projectId === id.toString() ? updatedStatus : c
        ));
      }
      return updatedStatus;
    } catch (err) {
      setError(err.message || 'Failed to update compliance');
      throw err;
    }
  };

  const markProjectUpdated = async (id) => {
    try {
      setError('');
      const updatedStatus = await complianceService.markUpdated(id);
      if (projectId && projectId.toString() === id.toString()) {
        setCompliance(updatedStatus);
      } else if (!projectId) {
        setCompliance(prev => prev.map(c => 
          c.projectId === id.toString() ? updatedStatus : c
        ));
      }
      return updatedStatus;
    } catch (err) {
      setError(err.message || 'Failed to mark project as updated');
      throw err;
    }
  };

  const checkAllCompliance = async () => {
    try {
      setError('');
      const updatedStatuses = await complianceService.checkCompliance();
      if (!projectId) {
        setCompliance(updatedStatuses);
      }
      return updatedStatuses;
    } catch (err) {
      setError(err.message || 'Failed to check compliance');
      throw err;
    }
  };

  useEffect(() => {
    loadCompliance();
  }, [projectId]);

  return {
    compliance,
    loading,
    error,
    loadCompliance,
    updateCompliance,
    markProjectUpdated,
    checkAllCompliance
  };
};