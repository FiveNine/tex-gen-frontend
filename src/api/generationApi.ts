
import { API_BASE_URL, getDefaultOptions, handleApiError } from './config';
import { GenerationJob, JobResult } from './types';

export const generationApi = {
  // Generate initial texture variations
  generateTexture: async (prompt: string, referenceImages?: File[]): Promise<GenerationJob> => {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      // Add reference images if provided
      if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach((image, index) => {
          formData.append('images', image);
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      return {
        jobId: data.jobId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        prompt: prompt
      };
    } catch (error) {
      return handleApiError(error, "generating texture");
    }
  },
  
  // Modify an existing texture based on a selected variation
  modifyTexture: async (jobId: string, prompt: string): Promise<GenerationJob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/modify`, {
        method: 'POST',
        ...getDefaultOptions(),
        body: JSON.stringify({
          jobId,
          prompt
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      return {
        jobId: data.jobId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        prompt: prompt
      };
    } catch (error) {
      return handleApiError(error, "modifying texture");
    }
  },
  
  // Finalize and upscale a texture
  finalizeTexture: async (jobId: string): Promise<GenerationJob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/upscale`, {
        method: 'POST',
        ...getDefaultOptions(),
        body: JSON.stringify({
          jobId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      return {
        jobId: data.jobId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        prompt: "Upscaling texture"
      };
    } catch (error) {
      return handleApiError(error, "finalizing texture");
    }
  }
};
