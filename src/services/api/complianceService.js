import complianceData from '@/services/mockData/complianceStatus.json';

let complianceStatuses = [...complianceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const complianceService = {
  async getAll() {
    await delay(200);
    return [...complianceStatuses];
  },

  async getByProjectId(projectId) {
    await delay(150);
    const status = complianceStatuses.find(c => c.projectId === projectId.toString());
    if (!status) {
      // Return default compliance status for new projects
      return {
        projectId: projectId.toString(),
        isCompliant: true,
        daysSinceUpdate: 0,
        requiresUpdate: false,
        lastNotificationDate: new Date().toISOString()
      };
    }
    return { ...status };
  },

  async update(projectId, statusData) {
    await delay(200);
    const index = complianceStatuses.findIndex(c => c.projectId === projectId.toString());
    
    if (index === -1) {
      // Create new compliance status
      const newStatus = {
        projectId: projectId.toString(),
        ...statusData
      };
      complianceStatuses.push(newStatus);
      return { ...newStatus };
    } else {
      // Update existing status
      complianceStatuses[index] = { ...complianceStatuses[index], ...statusData };
      return { ...complianceStatuses[index] };
    }
  },

  async markUpdated(projectId) {
    await delay(150);
    return this.update(projectId, {
      isCompliant: true,
      daysSinceUpdate: 0,
      requiresUpdate: false,
      lastNotificationDate: new Date().toISOString()
    });
  },

  async checkCompliance() {
    await delay(250);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    // Update compliance status based on last update date
    complianceStatuses.forEach(status => {
      const lastUpdate = new Date(status.lastNotificationDate);
      const daysSince = Math.floor((now - lastUpdate) / (24 * 60 * 60 * 1000));
      
      status.daysSinceUpdate = daysSince;
      status.isCompliant = daysSince < 7;
      status.requiresUpdate = daysSince >= 7;
    });
    
    return [...complianceStatuses];
  }
};