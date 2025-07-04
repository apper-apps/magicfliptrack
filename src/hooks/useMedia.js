import { useState, useEffect } from 'react';
import { mediaService } from '@/services/api/mediaService';

export const useMedia = (projectId = null) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError('');
      const data = projectId 
        ? await mediaService.getByProjectId(projectId)
        : await mediaService.getAll();
      setMedia(data);
    } catch (err) {
      setError(err.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
};

  const getMediaByStage = async (stage) => {
    try {
      setError('');
      const stageMedia = media.filter(item => item.stage === stage);
      return stageMedia;
    } catch (err) {
      setError(err.message || 'Failed to filter media by stage');
      throw err;
    }
  };

const createMedia = async (mediaData) => {
    try {
      setError('');
      // Use batch photo creation if photos array is provided
      const newMedia = mediaData.photos && mediaData.photos.length > 0
        ? await mediaService.createWithPhotos(mediaData)
        : await mediaService.create(mediaData);
      setMedia(prev => [newMedia, ...prev]);
      return newMedia;
    } catch (err) {
      setError(err.message || 'Failed to upload media');
      throw err;
    }
  };

  const updateMedia = async (id, updateData) => {
    try {
      setError('');
      const updatedMedia = await mediaService.update(id, updateData);
      setMedia(prev => prev.map(m => m.Id === parseInt(id) ? updatedMedia : m));
      return updatedMedia;
    } catch (err) {
      setError(err.message || 'Failed to update media');
      throw err;
    }
  };

  const deleteMedia = async (id) => {
    try {
      setError('');
      await mediaService.delete(id);
      setMedia(prev => prev.filter(m => m.Id !== parseInt(id)));
    } catch (err) {
      setError(err.message || 'Failed to delete media');
      throw err;
    }
  };

  useEffect(() => {
    loadMedia();
  }, [projectId]);

return {
    media,
    loading,
    error,
    loadMedia,
    getMediaByStage,
    createMedia,
    updateMedia,
    deleteMedia
  };
};