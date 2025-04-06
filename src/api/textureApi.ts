
import { generationApi } from './generationApi';
import { jobApi } from './jobApi';
import { textureCollectionApi } from './textureCollectionApi';
import { GenerationJob, JobResult } from './types';

// Re-export types
export type { GenerationJob, JobResult };

// Combine all APIs into a single export
export const textureApi = {
  ...generationApi,
  ...jobApi,
  ...textureCollectionApi
};
