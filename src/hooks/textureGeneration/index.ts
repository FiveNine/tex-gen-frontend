
import { useTextureOperations } from './useTextureOperations';
import { useResolution } from './useResolution';
import { TextureVariation } from './types';

export type { TextureVariation };

export const useTextureGeneration = () => {
  const textureOperations = useTextureOperations();
  const resolutionTools = useResolution();

  return {
    ...textureOperations,
    ...resolutionTools
  };
};
