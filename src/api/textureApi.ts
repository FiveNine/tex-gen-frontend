import { config } from "@/config/env";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { tokenManager } from "@/utils/tokenManager";

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `Error ${response.status}`;
  let errorData;

  try {
    errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    // If response is not JSON, try to get text
    try {
      const text = await response.text();
      errorMessage = text || errorMessage;
    } catch {
      // If we can't get text either, use default message
    }
  }

  const error: ApiError = {
    status: response.status,
    message: errorMessage,
    data: errorData,
  };

  console.error(`API Error: ${errorMessage}`, error);
  throw error;
};

// Types based on the API documentation
export interface GenerationJob {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
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
  generateTexture: async (
    prompt: string,
    referenceImages?: File[]
  ): Promise<GenerationJob> => {
    try {
      const response = await fetchWithAuth(`${config.apiBaseUrl}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenManager.getAccessToken()}`,
        },
        body: JSON.stringify({
          prompt,
          imagePaths: referenceImages?.map((file) => file.name),
          size: "1024x1024",
        }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Generate texture response:", data);
      return data;
    } catch (error) {
      console.error("Error in generateTexture:", error);
      throw error;
    }
  },

  // Modify an existing texture based on a selected variation
  modifyTexture: async (
    jobId: string,
    prompt: string
  ): Promise<GenerationJob> => {
    try {
      const response = await fetchWithAuth(`${config.apiBaseUrl}/ai/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenManager.getAccessToken()}`,
        },
        body: JSON.stringify({ jobId, prompt }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Modify texture response:", data);
      return data;
    } catch (error) {
      console.error("Error in modifyTexture:", error);
      throw error;
    }
  },

  // Finalize and upscale a texture
  finalizeTexture: async (jobId: string): Promise<GenerationJob> => {
    try {
      const response = await fetchWithAuth(`${config.apiBaseUrl}/ai/upscale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenManager.getAccessToken()}`,
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Finalize texture response:", data);
      return data;
    } catch (error) {
      console.error("Error in finalizeTexture:", error);
      throw error;
    }
  },

  // Check the status of a job
  checkJobStatus: async (jobId: string): Promise<GenerationJob> => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/ai/status/${jobId}`
      );

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Check job status response:", data);
      return data;
    } catch (error) {
      console.error("Error in checkJobStatus:", error);
      throw error;
    }
  },

  // Get job results
  getJobResults: async (jobId: string): Promise<JobResult> => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/ai/job-results/${jobId}`
      );

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Get job results response:", data);
      return data;
    } catch (error) {
      console.error("Error in getJobResults:", error);
      throw error;
    }
  },

  // TODO: There is no downloadTexture endpoint in the API
  // Download a high-resolution texture
  downloadTexture: async (jobId: string): Promise<string> => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/textures/${jobId}/download`
      );

      if (!response.ok) {
        return handleApiError(response);
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error in downloadTexture:", error);
      throw error;
    }
  },

  // Get user's textures
  getUserTextures: async (): Promise<JobResult[]> => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/textures/user`
      );

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Get user textures response:", data);
      return data;
    } catch (error) {
      console.error("Error in getUserTextures:", error);
      throw error;
    }
  },

  // Get public textures
  getPublicTextures: async (
    page: number = 1,
    limit: number = 20
  ): Promise<JobResult[]> => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/textures/public?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Get public textures response:", data);
      return data;
    } catch (error) {
      console.error("Error in getPublicTextures:", error);
      throw error;
    }
  },

  // Update texture visibility
  updateTextureVisibility: async (
    jobId: string,
    isPublic: boolean
  ): Promise<void> => {
    try {
      const response = await fetchWithAuth(
        `${config.apiBaseUrl}/textures/${jobId}/visibility`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublic }),
        }
      );

      if (!response.ok) {
        return handleApiError(response);
      }
    } catch (error) {
      console.error("Error in updateTextureVisibility:", error);
      throw error;
    }
  },
};
