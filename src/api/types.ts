
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
