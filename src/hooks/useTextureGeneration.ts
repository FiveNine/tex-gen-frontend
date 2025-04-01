
import { useState } from 'react';
import { toast } from 'sonner';
import { mockTextures } from '@/utils/mockData';

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

  const handleGenerate = (referenceImages: File[]) => {
    if (!prompt.trim() && referenceImages.length === 0) {
      toast.error("Please provide a text prompt or reference image", {
        description: "We need at least one input to generate a texture"
      });
      return;
    }

    // Reset confirmation state when generating a new texture
    setIsConfirmed(false);
    setIsGenerating(true);
    
    // Add current prompt to history
    if (prompt.trim() && !currentPromptHistory.includes(prompt)) {
      setCurrentPromptHistory(prev => [...prev, prompt]);
    }
    
    // Increment modification count if not the first generation
    if (generatedTexture) {
      setModificationCount(prev => prev + 1);
    }
    
    // Simulate texture generation with a random one from our mock data (low resolution preview)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockTextures.length);
      setGeneratedTexture(mockTextures[randomIndex].imageUrl);
      setIsGenerating(false);
      
      toast.success("Texture preview generated!", {
        description: "This is a low-resolution preview. Finalize when ready for high-resolution."
      });
    }, 2000);

    return true;
  };

  const handleUpscale = () => {
    return true;
  };

  const handleConfirmResolution = () => {
    setIsUpscaling(true);
    setUpscaleProgress(0);
    
    // Simulate upscaling process with progress updates
    const interval = setInterval(() => {
      setUpscaleProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUpscaling(false);
            setIsConfirmed(true);
            toast.success(`${getResolutionLabel(selectedResolution)} texture generated!`, {
              description: "Your texture has been added to the gallery."
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 700);
  };

  const getResolutionLabel = (res: number): string => {
    switch (res) {
      case 2048: return "2K";
      case 4096: return "4K";
      case 8192: return "8K";
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
    handleGenerate,
    handleUpscale,
    handleConfirmResolution,
    getResolutionLabel,
    isResolutionAvailable
  };
};
