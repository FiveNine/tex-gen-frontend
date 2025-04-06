
import { toast } from 'sonner';
import { textureApi } from '@/api/textureApi';
import { usePromptState } from './usePromptState';
import { useVariations } from './useVariations';
import { useJobPolling } from './useJobPolling';
import { useGenerationPhases } from './useGenerationPhases';

export const useTextureOperations = () => {
  const {
    prompt,
    setPrompt,
    currentPromptHistory,
    setCurrentPromptHistory,
    addToHistory
  } = usePromptState();

  const {
    variations,
    selectedVariationIndex,
    generatedTexture,
    setGeneratedTexture,
    handleSelectVariation,
    setInitialVariations,
    resetVariations
  } = useVariations();

  const {
    currentJobId,
    setCurrentJobId,
    isPollingStatus,
    setIsPollingStatus,
    stopPolling
  } = useJobPolling();

  const {
    isGenerating,
    setIsGenerating,
    isUpscaling,
    setIsUpscaling,
    isConfirmed,
    setIsConfirmed,
    upscaleProgress,
    setUpscaleProgress,
    modificationCount,
    setModificationCount,
    startUpscaling,
    incrementModification,
    resetGenerationState
  } = useGenerationPhases();

  // Generate new texture
  const handleGenerate = async (referenceImages: File[]) => {
    if (!prompt.trim() && referenceImages.length === 0) {
      toast.error("Please provide a text prompt or reference image", {
        description: "We need at least one input to generate a texture"
      });
      return false;
    }

    // Reset states
    setIsConfirmed(false);
    setIsGenerating(true);
    resetVariations();
    
    // Add current prompt to history
    addToHistory(prompt);
    
    try {
      // Call the API to generate variations
      const job = await textureApi.generateTexture(prompt, referenceImages);
      setCurrentJobId(job.jobId);
      setIsPollingStatus(true);
      
      // Set up polling to check job status
      const checkJobStatus = async () => {
        try {
          const jobStatus = await textureApi.checkJobStatus(job.jobId);
          
          if (jobStatus.status === 'completed') {
            setIsPollingStatus(false);
            stopPolling();
            
            // Get job results
            const results = await textureApi.getJobResults(job.jobId);
            
            // If there are variations, set them
            if (jobStatus.variations && jobStatus.variations.length > 0) {
              setInitialVariations(jobStatus.variations);
            }
            
            setIsGenerating(false);
            
            toast.success("Texture preview generated!", {
              description: "Select one of the variations or modify the prompt."
            });
          } else if (jobStatus.status === 'failed') {
            setIsPollingStatus(false);
            setIsGenerating(false);
            stopPolling();
            toast.error("Generation failed", {
              description: "Please try again with a different prompt."
            });
          } else {
            // Still processing, check again after delay
            setTimeout(checkJobStatus, 10000);
          }
        } catch (error) {
          console.error("Error checking job status:", error);
          setIsPollingStatus(false);
          setIsGenerating(false);
          stopPolling();
          toast.error("Error checking generation status");
        }
      };
      
      // Start checking job status
      checkJobStatus();
      
      // Increment modification count if not the first generation
      if (generatedTexture) {
        incrementModification();
      }
      
      return true;
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate texture");
      console.error("Generation error:", error);
      return false;
    }
  };

  // Modify existing texture
  const handleModify = async () => {
    if (!prompt.trim() || !currentJobId) {
      toast.error("Please provide a text prompt to modify the texture");
      return false;
    }

    // Reset states
    setIsGenerating(true);
    resetVariations();
    
    // Add current prompt to history
    addToHistory(prompt);
    
    try {
      // Call the API to modify the texture
      const job = await textureApi.modifyTexture(currentJobId, prompt);
      setCurrentJobId(job.jobId);
      setIsPollingStatus(true);
      
      // Set up polling to check job status
      const checkJobStatus = async () => {
        try {
          const jobStatus = await textureApi.checkJobStatus(job.jobId);
          
          if (jobStatus.status === 'completed') {
            setIsPollingStatus(false);
            stopPolling();
            
            // Get job results
            const results = await textureApi.getJobResults(job.jobId);
            
            // If there are variations, set them
            if (jobStatus.variations && jobStatus.variations.length > 0) {
              setInitialVariations(jobStatus.variations);
            }
            
            setIsGenerating(false);
            
            toast.success("Texture preview modified!", {
              description: "Select one of the variations or modify the prompt again."
            });
          } else if (jobStatus.status === 'failed') {
            setIsPollingStatus(false);
            setIsGenerating(false);
            stopPolling();
            toast.error("Modification failed", {
              description: "Please try again with a different prompt."
            });
          } else {
            // Still processing, check again after delay
            setTimeout(checkJobStatus, 10000);
          }
        } catch (error) {
          console.error("Error checking job status:", error);
          setIsPollingStatus(false);
          setIsGenerating(false);
          stopPolling();
          toast.error("Error checking modification status");
        }
      };
      
      // Start checking job status
      checkJobStatus();
      
      // Increment modification count
      incrementModification();
      
      return true;
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to modify texture");
      console.error("Modification error:", error);
      return false;
    }
  };

  // Upscale the selected texture
  const handleUpscale = () => {
    return true;
  };

  // Confirm resolution and finalize texture
  const handleConfirmResolution = async () => {
    const intervalId = startUpscaling();
    
    try {
      if (!currentJobId) {
        throw new Error("No current job to finalize");
      }
      
      // Call the API to finalize the texture
      const job = await textureApi.finalizeTexture(currentJobId);
      setCurrentJobId(job.jobId);
      
      // The upscaling progress will be simulated by the useEffect
      
    } catch (error) {
      clearInterval(intervalId);
      setIsUpscaling(false);
      toast.error("Failed to finalize texture");
      console.error("Finalization error:", error);
    }
  };

  // Download a texture
  const handleDownloadTexture = async (jobId: string) => {
    try {
      const downloadUrl = await textureApi.downloadTexture(jobId);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `texture-${jobId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Texture downloaded successfully");
      return true;
    } catch (error) {
      toast.error("Failed to download texture", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      return false;
    }
  };

  return {
    // From usePromptState
    prompt,
    setPrompt,
    currentPromptHistory,
    setCurrentPromptHistory,
    
    // From useVariations
    variations,
    selectedVariationIndex,
    generatedTexture,
    setGeneratedTexture,
    handleSelectVariation,
    
    // From useJobPolling
    currentJobId,
    
    // From useGenerationPhases
    isGenerating,
    setIsGenerating,
    isUpscaling,
    setIsUpscaling,
    isConfirmed,
    setIsConfirmed,
    upscaleProgress,
    setUpscaleProgress,
    modificationCount,
    setModificationCount,
    
    // Operations
    handleGenerate,
    handleModify,
    handleUpscale,
    handleConfirmResolution,
    handleDownloadTexture
  };
};
