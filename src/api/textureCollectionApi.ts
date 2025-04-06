
import { API_BASE_URL, getDefaultOptions, handleApiError } from './config';
import { JobResult } from './types';

export const textureCollectionApi = {
  // Get user's textures
  getUserTextures: async (): Promise<JobResult[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/user-textures`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "getting user textures");
    }
  },
  
  // Get public textures
  getPublicTextures: async (page: number = 1, limit: number = 20): Promise<JobResult[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/public-textures?page=${page}&limit=${limit}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "getting public textures");
    }
  },
  
  // Update texture visibility
  updateTextureVisibility: async (jobId: string, isPublic: boolean): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/update-visibility/${jobId}`, {
        method: 'PUT',
        ...getDefaultOptions(),
        body: JSON.stringify({
          isPublic
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
    } catch (error) {
      handleApiError(error, "updating texture visibility");
    }
  }
};
