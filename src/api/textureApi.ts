
// API base URL - this will be replaced with the production URL later
const API_BASE_URL = "http://localhost:8000";

// Types based on the API documentation
export interface GenerationJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  prompt: string;
  variations?: string[];
}

export interface JobResult {
  jobId: string;
  previewImageUrl: string;
  highResImageUrl: string;
  prompt: string;
  createdAt: string;
  userId?: string;
  tags: string[];
  isPublic: boolean;
  resolution: string;
}

export const textureApi = {
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
      console.error("Error generating texture:", error);
      throw new Error("Failed to generate texture");
    }
  },
  
  // Modify an existing texture based on a selected variation
  modifyTexture: async (jobId: string, prompt: string): Promise<GenerationJob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/modify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          prompt
        }),
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
      console.error("Error modifying texture:", error);
      throw new Error("Failed to modify texture");
    }
  },
  
  // Finalize and upscale a texture
  finalizeTexture: async (jobId: string): Promise<GenerationJob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/upscale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId
        }),
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
        prompt: "Upscaling texture"
      };
    } catch (error) {
      console.error("Error finalizing texture:", error);
      throw new Error("Failed to finalize texture");
    }
  },
  
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
      console.error("Error checking job status:", error);
      throw new Error("Failed to check job status");
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
      console.error("Error getting job results:", error);
      throw new Error("Failed to get job results");
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
      console.error("Error downloading texture:", error);
      throw new Error("Failed to download texture");
    }
  },

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
      console.error("Error getting user textures:", error);
      throw new Error("Failed to get user textures");
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
      console.error("Error getting public textures:", error);
      throw new Error("Failed to get public textures");
    }
  },
  
  // Update texture visibility
  updateTextureVisibility: async (jobId: string, isPublic: boolean): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/update-visibility/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
    } catch (error) {
      console.error("Error updating texture visibility:", error);
      throw new Error("Failed to update texture visibility");
    }
  }
};
