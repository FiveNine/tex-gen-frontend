
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { textureApi, GenerationJob, JobResult } from '@/api/textureApi';

export type TextureVariation = {
  imageUrl: string;
  selected: boolean;
};

export const useTextureGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [generatedTexture, setGeneratedTexture] = useState<null | string>(null);
  const [modificationCount, setModificationCount] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentPromptHistory, setCurrentPromptHistory] = useState<string[]>([]);
  const [upscaleProgress, setUpscaleProgress] = useState(0);
  const [selectedResolution, setSelectedResolution] = useState<number>(2048);
  
  // New states for variations and job tracking
  const [variations, setVariations] = useState<TextureVariation[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isPollingStatus, setIsPollingStatus] = useState(false);
  const [jobResult, setJobResult] = useState<JobResult | null>(null);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(-1);

  // Poll job status
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (currentJobId && isPollingStatus) {
      intervalId = window.setInterval(async () => {
        try {
          const jobStatus = await textureApi.checkJobStatus(currentJobId);
          
          if (jobStatus.status === 'completed') {
            setIsPollingStatus(false);
            clearInterval(intervalId);
            
            // Get job results
            const results = await textureApi.getJobResults(currentJobId);
            setJobResult(results);
            
            // If there are variations, set them
            if (jobStatus.variations && jobStatus.variations.length > 0) {
              const newVariations = jobStatus.variations.map((url, index) => ({
                imageUrl: url,
                selected: index === 0 // Select the first one by default
              }));
              setVariations(newVariations);
              setSelectedVariationIndex(0);
            }
            
            // Set the first variation as the generated texture
            if (jobStatus.variations && jobStatus.variations.length > 0) {
              setGeneratedTexture(jobStatus.variations[0]);
            }
            
            setIsGenerating(false);
            
            toast.success("Texture preview generated!", {
              description: "Select one of the variations or modify the prompt."
            });
          } else if (jobStatus.status === 'failed') {
            setIsPollingStatus(false);
            setIsGenerating(false);
            clearInterval(intervalId);
            toast.error("Generation failed", {
              description: "Please try again with a different prompt."
            });
          }
          // If still processing, continue polling
        } catch (error) {
          console.error("Error polling job status:", error);
          setIsPollingStatus(false);
          setIsGenerating(false);
          clearInterval(intervalId);
          toast.error("Error checking generation status");
        }
      }, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentJobId, isPollingStatus]);

  // For upscaling progress simulation
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isUpscaling) {
      intervalId = window.setInterval(() => {
        setUpscaleProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            return 100;
          }
          return newProgress;
        });
      }, 800);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isUpscaling]);

  // Complete the upscaling process when progress reaches 100%
  useEffect(() => {
    if (upscaleProgress === 100) {
      setTimeout(() => {
        setIsUpscaling(false);
        setIsConfirmed(true);
        toast.success(`${getResolutionLabel(selectedResolution)} texture generated!`, {
          description: "Your texture has been added to the gallery."
        });
      }, 500);
    }
  }, [upscaleProgress, selectedResolution]);

  const handleSelectVariation = (index: number) => {
    if (index < 0 || index >= variations.length) return;
    
    setVariations(prev => 
      prev.map((variation, i) => ({
        ...variation,
        selected: i === index
      }))
    );
    
    setSelectedVariationIndex(index);
    setGeneratedTexture(variations[index].imageUrl);
  };

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
    setVariations([]);
    setSelectedVariationIndex(-1);
    
    // Add current prompt to history if not already there
    if (prompt.trim() && !currentPromptHistory.includes(prompt)) {
      setCurrentPromptHistory(prev => [...prev, prompt]);
    }
    
    try {
      // Call the API to generate variations
      const job = await textureApi.generateTexture(prompt, referenceImages);
      setCurrentJobId(job.jobId);
      setIsPollingStatus(true);
      
      // Increment modification count if not the first generation
      if (generatedTexture) {
        setModificationCount(prev => prev + 1);
      }
      
      return true;
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate texture");
      console.error("Generation error:", error);
      return false;
    }
  };

  const handleModify = async () => {
    if (!prompt.trim() || !currentJobId) {
      toast.error("Please provide a text prompt to modify the texture");
      return false;
    }

    // Reset states
    setIsGenerating(true);
    setVariations([]);
    
    // Add current prompt to history if not already there
    if (prompt.trim() && !currentPromptHistory.includes(prompt)) {
      setCurrentPromptHistory(prev => [...prev, prompt]);
    }
    
    try {
      // Call the API to modify the texture
      const job = await textureApi.modifyTexture(currentJobId, prompt);
      setCurrentJobId(job.jobId);
      setIsPollingStatus(true);
      
      // Increment modification count
      setModificationCount(prev => prev + 1);
      
      return true;
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to modify texture");
      console.error("Modification error:", error);
      return false;
    }
  };

  const handleUpscale = () => {
    return true;
  };

  const handleConfirmResolution = async () => {
    setIsUpscaling(true);
    setUpscaleProgress(0);
    
    try {
      if (!currentJobId) {
        throw new Error("No current job to finalize");
      }
      
      // Call the API to finalize the texture
      const job = await textureApi.finalizeTexture(currentJobId);
      setCurrentJobId(job.jobId);
      setIsPollingStatus(true);
      
      // The upscaling progress will be simulated by the useEffect
      
    } catch (error) {
      setIsUpscaling(false);
      toast.error("Failed to finalize texture");
      console.error("Finalization error:", error);
    }
  };

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

  const getResolutionLabel = (res: number): string => {
    switch (res) {
      case 2048: return "2K";
      case 4096: return "4K";
      case 8192: return "8K";
      case 1024: return "1K";
      case 512: return "512px";
      case 256: return "256px";
      default: return `${res}px`;
    }
  };

  const isResolutionAvailable = (res: number, isPro: boolean): boolean => {
    if (res === 8192) {
      return isPro;
    }
    return true;
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    setIsGenerating,
    isUpscaling,
    setIsUpscaling,
    generatedTexture,
    setGeneratedTexture,
    modificationCount,
    setModificationCount,
    isConfirmed,
    setIsConfirmed,
    currentPromptHistory,
    setCurrentPromptHistory,
    upscaleProgress,
    setUpscaleProgress,
    selectedResolution,
    setSelectedResolution,
    variations,
    selectedVariationIndex,
    handleGenerate,
    handleModify,
    handleUpscale,
    handleConfirmResolution,
    handleSelectVariation,
    handleDownloadTexture,
    getResolutionLabel,
    isResolutionAvailable
  };
};
