import { toast } from 'react-toastify';

export const mediaService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "url" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "stage" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "uploaded_by" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('media_update', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media");
      return [];
    }
  },

  async getByProjectId(projectId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "url" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "stage" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "uploaded_by" } },
          { field: { Name: "project_id" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('media_update', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching media by project ID:", error);
      toast.error("Failed to load project media");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "type" } },
          { field: { Name: "url" } },
          { field: { Name: "thumbnail_url" } },
          { field: { Name: "stage" } },
          { field: { Name: "notes" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "uploaded_by" } },
          { field: { Name: "project_id" } }
        ]
      };

      const response = await apperClient.getRecordById('media_update', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Media not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching media with ID ${id}:`, error);
      throw error;
    }
  },

  async create(mediaData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: mediaData.name || `${mediaData.type} Update`,
          Tags: mediaData.tags || "",
          Owner: mediaData.owner,
          type: mediaData.type,
          url: mediaData.url || "/api/placeholder/800/600",
          thumbnail_url: mediaData.thumbnailUrl || mediaData.thumbnail_url || "/api/placeholder/200/150",
          stage: mediaData.stage,
          notes: mediaData.notes || "",
          timestamp: mediaData.timestamp || new Date().toISOString(),
          uploaded_by: mediaData.uploadedBy || mediaData.uploaded_by || "Field Manager",
          project_id: parseInt(mediaData.projectId || mediaData.project_id)
        }]
      };

      const response = await apperClient.createRecord('media_update', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create media');
    } catch (error) {
      console.error("Error creating media:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.name !== undefined && { Name: updateData.name }),
          ...(updateData.tags !== undefined && { Tags: updateData.tags }),
          ...(updateData.owner !== undefined && { Owner: updateData.owner }),
          ...(updateData.type !== undefined && { type: updateData.type }),
          ...(updateData.url !== undefined && { url: updateData.url }),
          ...(updateData.thumbnailUrl !== undefined && { thumbnail_url: updateData.thumbnailUrl }),
          ...(updateData.stage !== undefined && { stage: updateData.stage }),
          ...(updateData.notes !== undefined && { notes: updateData.notes }),
          ...(updateData.timestamp !== undefined && { timestamp: updateData.timestamp }),
          ...(updateData.uploadedBy !== undefined && { uploaded_by: updateData.uploadedBy }),
          ...(updateData.projectId !== undefined && { project_id: parseInt(updateData.projectId) })
        }]
      };

      const response = await apperClient.updateRecord('media_update', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update media');
    } catch (error) {
      console.error("Error updating media:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('media_update', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting media:", error);
throw error;
    }
  },

  async createWithPhotos(mediaData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First create the media update record
      const mediaUpdateData = {
        Name: `Photo Update - ${mediaData.stage}`,
        Tags: mediaData.tags || "",
        Owner: mediaData.owner,
        type: 'photo',
        url: mediaData.photos?.[0]?.url || "/api/placeholder/800/600",
        thumbnail_url: mediaData.photos?.[0]?.url || "/api/placeholder/200/150",
        stage: mediaData.stage,
        notes: mediaData.notes || "",
        timestamp: new Date().toISOString(),
        uploaded_by: mediaData.uploadedBy || "Field Manager",
        project_id: parseInt(mediaData.projectId)
      };

      const mediaParams = {
        records: [mediaUpdateData]
      };

      const mediaResponse = await apperClient.createRecord('media_update', mediaParams);
      
      if (!mediaResponse.success) {
        console.error(mediaResponse.message);
        toast.error(mediaResponse.message);
        throw new Error(mediaResponse.message);
      }

      let mediaUpdateRecord = null;
      if (mediaResponse.results && mediaResponse.results.length > 0) {
        const successfulMedia = mediaResponse.results.filter(result => result.success);
        if (successfulMedia.length > 0) {
          mediaUpdateRecord = successfulMedia[0].data;
        }
      }

      if (!mediaUpdateRecord) {
        throw new Error('Failed to create media update record');
      }

      // Then create individual photo records linked to the media update
      if (mediaData.photos && mediaData.photos.length > 0) {
        const photoRecords = mediaData.photos.map((photo, index) => ({
          Name: `Photo ${index + 1} - ${mediaData.stage}`,
          Tags: mediaData.tags || "",
          Owner: mediaData.owner,
          media_update_id: mediaUpdateRecord.Id,
          url: photo.url || "/api/placeholder/800/600",
          thumbnail_url: photo.url || "/api/placeholder/200/150"
        }));

        const photoParams = {
          records: photoRecords
        };

        const photoResponse = await apperClient.createRecord('photo', photoParams);
        
        if (!photoResponse.success) {
          console.error(photoResponse.message);
          toast.error(photoResponse.message);
          // Continue even if photo creation fails, media update was successful
        }

        if (photoResponse.results) {
          const failedPhotos = photoResponse.results.filter(result => !result.success);
          if (failedPhotos.length > 0) {
            console.error(`Failed to create ${failedPhotos.length} photos:${JSON.stringify(failedPhotos)}`);
            failedPhotos.forEach(record => {
              record.errors?.forEach(error => {
                toast.error(`Photo error - ${error.fieldLabel}: ${error.message}`);
              });
              if (record.message) toast.error(`Photo error: ${record.message}`);
            });
          }
        }
      }

      return mediaUpdateRecord;
    } catch (error) {
      console.error("Error creating media with photos:", error);
      throw error;
    }
  }
};