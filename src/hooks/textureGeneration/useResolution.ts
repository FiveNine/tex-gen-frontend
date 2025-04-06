
import { useState } from 'react';
import { Resolution } from './types';

export const useResolution = () => {
  const [selectedResolution, setSelectedResolution] = useState<number>(2048);

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
    selectedResolution,
    setSelectedResolution,
    getResolutionLabel,
    isResolutionAvailable
  };
};
