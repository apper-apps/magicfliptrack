import { toast } from 'react-toastify';

export const complianceService = {
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
          { field: { Name: "project_id" } },
          { field: { Name: "is_compliant" } },
          { field: { Name: "days_since_update" } },
          { field: { Name: "requires_update" } },
          { field: { Name: "last_notification_date" } }
        ]
      };

      const response = await apperClient.fetchRecords('compliance_status', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching compliance data:", error);
      toast.error("Failed to load compliance data");
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
          { field: { Name: "project_id" } },
          { field: { Name: "is_compliant" } },
          { field: { Name: "days_since_update" } },
          { field: { Name: "requires_update" } },
          { field: { Name: "last_notification_date" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords('compliance_status', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        // Return default compliance status for new projects
        return {
          project_id: parseInt(projectId),
          is_compliant: true,
          days_since_update: 0,
          requires_update: false,
          last_notification_date: new Date().toISOString()
        };
      }

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }

      // Return default compliance status for new projects
      return {
        project_id: parseInt(projectId),
        is_compliant: true,
        days_since_update: 0,
        requires_update: false,
        last_notification_date: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching compliance by project ID:", error);
      // Return default compliance status on error
      return {
        project_id: parseInt(projectId),
        is_compliant: true,
        days_since_update: 0,
        requires_update: false,
        last_notification_date: new Date().toISOString()
      };
    }
  },

  async update(projectId, statusData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First check if record exists
      const existing = await this.getByProjectId(projectId);
      
      if (existing.Id) {
        // Update existing record
        const params = {
          records: [{
            Id: existing.Id,
            ...(statusData.name !== undefined && { Name: statusData.name }),
            ...(statusData.tags !== undefined && { Tags: statusData.tags }),
            ...(statusData.owner !== undefined && { Owner: statusData.owner }),
            project_id: parseInt(projectId),
            ...(statusData.isCompliant !== undefined && { is_compliant: statusData.isCompliant }),
            ...(statusData.daysSinceUpdate !== undefined && { days_since_update: statusData.daysSinceUpdate }),
            ...(statusData.requiresUpdate !== undefined && { requires_update: statusData.requiresUpdate }),
            ...(statusData.lastNotificationDate !== undefined && { last_notification_date: statusData.lastNotificationDate })
          }]
        };

        const response = await apperClient.updateRecord('compliance_status', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          throw new Error(response.message);
        }

        if (response.results && response.results.length > 0 && response.results[0].success) {
          return response.results[0].data;
        }
        
        throw new Error('Failed to update compliance status');
      } else {
        // Create new record
        const params = {
          records: [{
            Name: statusData.name || `Compliance for Project ${projectId}`,
            Tags: statusData.tags || "",
            Owner: statusData.owner,
            project_id: parseInt(projectId),
            is_compliant: statusData.isCompliant !== undefined ? statusData.isCompliant : true,
            days_since_update: statusData.daysSinceUpdate || 0,
            requires_update: statusData.requiresUpdate !== undefined ? statusData.requiresUpdate : false,
            last_notification_date: statusData.lastNotificationDate || new Date().toISOString()
          }]
        };

        const response = await apperClient.createRecord('compliance_status', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          throw new Error(response.message);
        }

        if (response.results && response.results.length > 0 && response.results[0].success) {
          return response.results[0].data;
        }
        
        throw new Error('Failed to create compliance status');
      }
    } catch (error) {
      console.error("Error updating compliance:", error);
      throw error;
    }
  },

  async markUpdated(projectId) {
    return this.update(projectId, {
      is_compliant: true,
      days_since_update: 0,
      requires_update: false,
      last_notification_date: new Date().toISOString()
    });
  },

  async checkCompliance() {
    try {
      const allStatuses = await this.getAll();
      const now = new Date();
      
      // Update compliance status based on last update date
      const updatedStatuses = allStatuses.map(status => {
        const lastUpdate = new Date(status.last_notification_date);
        const daysSince = Math.floor((now - lastUpdate) / (24 * 60 * 60 * 1000));
        
        return {
          ...status,
          days_since_update: daysSince,
          is_compliant: daysSince < 7,
          requires_update: daysSince >= 7
        };
      });
      
      // Update each status record
      for (const status of updatedStatuses) {
        if (status.Id) {
          await this.update(status.project_id, {
            days_since_update: status.days_since_update,
            is_compliant: status.is_compliant,
            requires_update: status.requires_update
          });
        }
      }
      
      return updatedStatuses;
    } catch (error) {
      console.error("Error checking compliance:", error);
      toast.error("Failed to check compliance");
      return [];
    }
  }
};