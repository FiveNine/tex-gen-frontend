
import React from 'react';
import { TextureVariation } from '@/hooks/useTextureGeneration';

interface TextureVariationsProps {
  variations: TextureVariation[];
  selectedIndex: number;
  onSelectVariation: (index: number) => void;
}

const TextureVariations: React.FC<TextureVariationsProps> = ({ 
  variations, 
  selectedIndex, 
  onSelectVariation 
}) => {
  if (variations.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2 text-center">Select a variation</h3>
      <div className="grid grid-cols-4 gap-2">
        {variations.map((variation, index) => (
          <div
            key={index}
            className={`relative aspect-square cursor-pointer overflow-hidden rounded-md border-2 transition-all ${
              index === selectedIndex
                ? 'border-primary shadow-md ring-2 ring-primary/20'
                : 'border-transparent hover:border-primary/50'
            }`}
            onClick={() => onSelectVariation(index)}
          >
            <img
              src={variation.imageUrl}
              alt={`Variation ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextureVariations;
