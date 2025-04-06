
import { useState } from 'react';

export const useGenerationPhases = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [upscaleProgress, setUpscaleProgress] = useState(0);
  const [modificationCount, setModificationCount] = useState(0);

  // For upscaling progress simulation
  const startUpscaling = () => {
    setIsUpscaling(true);
    setUpscaleProgress(0);
    
    // Set up interval to increment progress
    const intervalId = window.setInterval(() => {
      setUpscaleProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            setIsUpscaling(false);
            setIsConfirmed(true);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 800);
    
    return intervalId;
  };

  const incrementModification = () => {
    setModificationCount(prev => prev + 1);
  };

  const resetGenerationState = () => {
    setIsConfirmed(false);
    setIsGenerating(true);
  };

  return {
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
  };
};
