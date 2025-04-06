
import { API_BASE_URL, getDefaultOptions, handleApiError } from './config';
import { GenerationJob, JobResult } from './types';

export const jobApi = {
  // Check the status of a job
  checkJobStatus: async (jobId: string): Promise<GenerationJob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/status/${jobId}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      return {
        jobId: data.jobId,
        status: data.status,
        createdAt: data.createdAt,
        prompt: data.prompt,
        variations: data.variations
      };
    } catch (error) {
      return handleApiError(error, "checking job status");
    }
  },
  
  // Get job results
  getJobResults: async (jobId: string): Promise<JobResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/job-results/${jobId}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error, "getting job results");
    }
  },
  
  // Download a high-resolution texture
  downloadTexture: async (jobId: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/download/${jobId}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      // In a real implementation, handle the blob download
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      return handleApiError(error, "downloading texture");
    }
  }
};
