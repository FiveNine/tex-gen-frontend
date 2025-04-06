
import { toast } from "sonner";

// Mock API base URL
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

// Mock job data storage (this would be replaced with actual API calls)
const mockJobs: Record<string, GenerationJob> = {};
const mockResults: Record<string, JobResult> = {};

// Helper to generate random job IDs
const generateJobId = () => `job-${Math.random().toString(36).substring(2, 10)}`;

// Mock API delay to simulate network requests
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create 4 variations from the mockTextures array
const generateVariations = () => {
  const { mockTextures } = require('@/utils/mockData');
  const shuffled = [...mockTextures].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).map(texture => texture.imageUrl);
};

export const textureApi = {
  // Generate initial texture variations
  generateTexture: async (prompt: string, referenceImages?: File[]): Promise<GenerationJob> => {
    try {
      await mockDelay(2000); // Simulate API delay
      
      // Create a mock job
      const jobId = generateJobId();
      const job: GenerationJob = {
        jobId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        prompt
      };
      
      mockJobs[jobId] = job;
      
      // Simulate job completion after delay
      setTimeout(() => {
        mockJobs[jobId].status = 'completed';
        mockJobs[jobId].variations = generateVariations();
        
        // Create a mock result that will be available when status is checked
        mockResults[jobId] = {
          jobId,
          previewImageUrl: mockJobs[jobId].variations![0],
          highResImageUrl: mockJobs[jobId].variations![0], // Same image for now but would be higher res
          prompt,
          createdAt: job.createdAt,
          tags: prompt.split(' ').filter(word => word.length > 3).slice(0, 5),
          isPublic: true,
          resolution: '256x256'
        };
      }, 5000);
      
      return job;
    } catch (error) {
      console.error("Error generating texture:", error);
      throw new Error("Failed to generate texture");
    }
  },
  
  // Modify an existing texture based on a selected variation
  modifyTexture: async (jobId: string, prompt: string): Promise<GenerationJob> => {
    try {
      await mockDelay(1500); // Simulate API delay
      
      // Create a modified job
      const newJobId = generateJobId();
      const originalJob = mockJobs[jobId];
      
      if (!originalJob) {
        throw new Error("Original texture not found");
      }
      
      const job: GenerationJob = {
        jobId: newJobId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        prompt: `${originalJob.prompt} ${prompt}`.trim()
      };
      
      mockJobs[newJobId] = job;
      
      // Simulate job completion after delay
      setTimeout(() => {
        mockJobs[newJobId].status = 'completed';
        mockJobs[newJobId].variations = generateVariations();
        
        // Create a mock result
        mockResults[newJobId] = {
          jobId: newJobId,
          previewImageUrl: mockJobs[newJobId].variations![0],
          highResImageUrl: mockJobs[newJobId].variations![0], // Same image for now
          prompt: job.prompt,
          createdAt: job.createdAt,
          tags: job.prompt.split(' ').filter(word => word.length > 3).slice(0, 5),
          isPublic: true,
          resolution: '256x256'
        };
      }, 4000);
      
      return job;
    } catch (error) {
      console.error("Error modifying texture:", error);
      throw new Error("Failed to modify texture");
    }
  },
  
  // Finalize and upscale a texture
  finalizeTexture: async (jobId: string): Promise<GenerationJob> => {
    try {
      await mockDelay(1000); // Simulate API delay
      
      // Create an upscaled job
      const newJobId = generateJobId();
      const originalJob = mockJobs[jobId];
      
      if (!originalJob) {
        throw new Error("Original texture not found");
      }
      
      const job: GenerationJob = {
        jobId: newJobId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        prompt: originalJob.prompt
      };
      
      mockJobs[newJobId] = job;
      
      // Simulate job completion after delay (longer for upscale)
      setTimeout(() => {
        mockJobs[newJobId].status = 'completed';
        
        // Create a mock result with higher resolution
        mockResults[newJobId] = {
          jobId: newJobId,
          previewImageUrl: originalJob.variations ? originalJob.variations[0] : '',
          highResImageUrl: originalJob.variations ? originalJob.variations[0] : '', // In reality, this would be higher res
          prompt: job.prompt,
          createdAt: job.createdAt,
          tags: job.prompt.split(' ').filter(word => word.length > 3).slice(0, 5),
          isPublic: true,
          resolution: '1024x1024'
        };
      }, 8000);
      
      return job;
    } catch (error) {
      console.error("Error finalizing texture:", error);
      throw new Error("Failed to finalize texture");
    }
  },
  
  // Check the status of a job
  checkJobStatus: async (jobId: string): Promise<GenerationJob> => {
    try {
      await mockDelay(500); // Simulate API delay
      
      const job = mockJobs[jobId];
      
      if (!job) {
        throw new Error("Job not found");
      }
      
      return job;
    } catch (error) {
      console.error("Error checking job status:", error);
      throw new Error("Failed to check job status");
    }
  },
  
  // Get job results
  getJobResults: async (jobId: string): Promise<JobResult> => {
    try {
      await mockDelay(800); // Simulate API delay
      
      const result = mockResults[jobId];
      
      if (!result) {
        throw new Error("Job results not found");
      }
      
      return result;
    } catch (error) {
      console.error("Error getting job results:", error);
      throw new Error("Failed to get job results");
    }
  },
  
  // Download a high-resolution texture
  downloadTexture: async (jobId: string): Promise<string> => {
    try {
      // Check if user is authenticated (this would be handled by the actual API)
      const isAuthenticated = true; // In a real app, this would be determined by auth state
      
      if (!isAuthenticated) {
        throw new Error("Authentication required to download textures");
      }
      
      await mockDelay(1200); // Simulate API delay
      
      const result = mockResults[jobId];
      
      if (!result) {
        throw new Error("Texture not found");
      }
      
      // In a real implementation, this would return a download URL or blob
      return result.highResImageUrl;
    } catch (error) {
      console.error("Error downloading texture:", error);
      throw new Error("Failed to download texture");
    }
  }
};

