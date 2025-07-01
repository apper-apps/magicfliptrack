import mediaData from '@/services/mockData/mediaUpdates.json';

let mediaUpdates = [...mediaData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mediaService = {
  async getAll() {
    await delay(300);
    return [...mediaUpdates];
  },

  async getByProjectId(projectId) {
    await delay(200);
    return mediaUpdates
      .filter(media => media.projectId === projectId.toString())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async getById(id) {
    await delay(200);
    const media = mediaUpdates.find(m => m.Id === parseInt(id));
    if (!media) {
      throw new Error('Media not found');
    }
    return { ...media };
  },

  async create(mediaData) {
    await delay(500); // Longer delay to simulate upload
    const newMedia = {
      ...mediaData,
      Id: Math.max(...mediaUpdates.map(m => m.Id)) + 1,
      timestamp: new Date().toISOString(),
      url: '/api/placeholder/800/600',
      thumbnailUrl: '/api/placeholder/200/150',
      uploadedBy: 'Field Manager'
    };
    mediaUpdates.push(newMedia);
    return { ...newMedia };
  },

  async update(id, updateData) {
    await delay(300);
    const index = mediaUpdates.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Media not found');
    }
    mediaUpdates[index] = { ...mediaUpdates[index], ...updateData };
    return { ...mediaUpdates[index] };
  },

  async delete(id) {
    await delay(200);
    const index = mediaUpdates.findIndex(m => m.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Media not found');
    }
    mediaUpdates.splice(index, 1);
    return true;
  }
};