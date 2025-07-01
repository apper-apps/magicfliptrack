import { toast } from 'react-toastify';

export const projectService = {
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
          { field: { Name: "address" } },
          { field: { Name: "start_date" } },
          { field: { Name: "target_date" } },
          { field: { Name: "current_stage" } },
          { field: { Name: "last_update_date" } },
          { field: { Name: "lockbox_code" } },
          { field: { Name: "status" } },
          { field: { Name: "thumbnail_url" } }
        ]
      };

      const response = await apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
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
          { field: { Name: "address" } },
          { field: { Name: "start_date" } },
          { field: { Name: "target_date" } },
          { field: { Name: "current_stage" } },
          { field: { Name: "last_update_date" } },
          { field: { Name: "lockbox_code" } },
          { field: { Name: "status" } },
          { field: { Name: "thumbnail_url" } }
        ]
      };

      const response = await apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Project not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: projectData.name || projectData.Name,
          Tags: projectData.tags || projectData.Tags || "",
          Owner: projectData.owner || projectData.Owner,
          address: projectData.address,
          start_date: projectData.startDate || projectData.start_date || new Date().toISOString().split('T')[0],
          target_date: projectData.targetDate || projectData.target_date,
          current_stage: projectData.currentStage || projectData.current_stage || "Planning",
          last_update_date: projectData.lastUpdateDate || projectData.last_update_date || new Date().toISOString().split('T')[0],
          lockbox_code: projectData.lockboxCode || projectData.lockbox_code || "",
          status: projectData.status || "In Progress",
          thumbnail_url: projectData.thumbnailUrl || projectData.thumbnail_url || "/api/placeholder/400/300"
        }]
      };

      const response = await apperClient.createRecord('project', params);
      
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
      
      throw new Error('Failed to create project');
    } catch (error) {
      console.error("Error creating project:", error);
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
          ...(updateData.address !== undefined && { address: updateData.address }),
          ...(updateData.startDate !== undefined && { start_date: updateData.startDate }),
          ...(updateData.targetDate !== undefined && { target_date: updateData.targetDate }),
          ...(updateData.currentStage !== undefined && { current_stage: updateData.currentStage }),
          ...(updateData.lastUpdateDate !== undefined && { last_update_date: updateData.lastUpdateDate }),
          ...(updateData.lockboxCode !== undefined && { lockbox_code: updateData.lockboxCode }),
          ...(updateData.status !== undefined && { status: updateData.status }),
          ...(updateData.thumbnailUrl !== undefined && { thumbnail_url: updateData.thumbnailUrl })
        }]
      };

      const response = await apperClient.updateRecord('project', params);
      
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
      
      throw new Error('Failed to update project');
    } catch (error) {
      console.error("Error updating project:", error);
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

      const response = await apperClient.deleteRecord('project', params);
      
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
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  async updateStage(id, stage) {
    return this.update(id, { 
      current_stage: stage, 
      last_update_date: new Date().toISOString().split('T')[0] 
    });
  }
};