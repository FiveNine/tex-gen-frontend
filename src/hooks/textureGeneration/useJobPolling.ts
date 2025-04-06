
import { useState, useRef, useEffect } from 'react';
import { textureApi } from '@/api/textureApi';
import { toast } from 'sonner';

export const useJobPolling = () => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const pollingIntervalRef = useRef<number | undefined>();

  // Cleanup function for the polling interval
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
    setIsPollingStatus(false);
  };
  
  // Function to start polling for a job
  const startPolling = (jobId: string, onComplete: (variations: string[]) => void, onError: () => void) => {
    setCurrentJobId(jobId);
    setIsPollingStatus(true);
  };
  
  // Poll job status when isPollingStatus changes
  useEffect(() => {
    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = undefined;
    }
    
    if (currentJobId && isPollingStatus) {
      // Set up polling to check status every 10 seconds
      pollingIntervalRef.current = window.setInterval(async () => {
        try {
          const jobStatus = await textureApi.checkJobStatus(currentJobId);
          
          if (jobStatus.status === 'completed') {
            stopPolling();
            
            // Get job results
            const results = await textureApi.getJobResults(currentJobId);
            
            // If there are variations, set them
            if (jobStatus.variations && jobStatus.variations.length > 0) {
              toast.success("Texture preview generated!", {
                description: "Select one of the variations or modify the prompt."
              });
              return jobStatus.variations;
            }
            
          } else if (jobStatus.status === 'failed') {
            stopPolling();
            toast.error("Generation failed", {
              description: "Please try again with a different prompt."
            });
          }
          // If still processing, continue polling
        } catch (error) {
          console.error("Error polling job status:", error);
          stopPolling();
          toast.error("Error checking generation status");
        }
      }, 10000); // Poll every 10 seconds as requested
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = undefined;
      }
    };
  }, [currentJobId, isPollingStatus]);

  return {
    currentJobId,
    setCurrentJobId,
    isPollingStatus,
    setIsPollingStatus,
    startPolling,
    stopPolling
  };
};
