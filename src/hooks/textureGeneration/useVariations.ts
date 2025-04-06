
import { useState } from 'react';
import { TextureVariation } from './types';

export const useVariations = () => {
  const [variations, setVariations] = useState<TextureVariation[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(-1);
  const [generatedTexture, setGeneratedTexture] = useState<null | string>(null);
  
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
  
  const setInitialVariations = (variationUrls: string[]) => {
    if (variationUrls && variationUrls.length > 0) {
      const newVariations = variationUrls.map((url, index) => ({
        imageUrl: url,
        selected: index === 0 // Select the first one by default
      }));
      setVariations(newVariations);
      setSelectedVariationIndex(0);
      
      // Set the first variation as the generated texture
      setGeneratedTexture(variationUrls[0]);
    }
  };
  
  const resetVariations = () => {
    setVariations([]);
    setSelectedVariationIndex(-1);
  };

  return {
    variations,
    selectedVariationIndex,
    generatedTexture,
    setGeneratedTexture,
    handleSelectVariation,
    setInitialVariations,
    resetVariations
  };
};
