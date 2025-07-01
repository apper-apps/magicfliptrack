import projectsData from '@/services/mockData/projects.json';

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  },

  async create(projectData) {
    await delay(400);
    const newProject = {
      ...projectData,
      Id: Math.max(...projects.map(p => p.Id)) + 1,
      startDate: new Date().toISOString().split('T')[0],
      lastUpdateDate: new Date().toISOString().split('T')[0],
      currentStage: 'Planning',
      status: 'In Progress',
      thumbnailUrl: '/api/placeholder/400/300'
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updateData) {
    await delay(300);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    projects[index] = { ...projects[index], ...updateData };
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(200);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    projects.splice(index, 1);
    return true;
  },

  async updateStage(id, stage) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Project not found');
    }
    projects[index].currentStage = stage;
    projects[index].lastUpdateDate = new Date().toISOString().split('T')[0];
    return { ...projects[index] };
  }
};