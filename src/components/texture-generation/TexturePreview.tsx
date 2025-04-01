
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, RefreshCcw, Check, Upload } from 'lucide-react';

interface TexturePreviewProps {
  generatedTexture: string | null;
  isGenerating: boolean;
  isUpscaling: boolean;
  upscaleProgress: number;
  isConfirmed: boolean;
  resolution: number[];
  handleRegenerate: () => void;
  handleUpscale: () => void;
  canModify: boolean;
}

const resolutionMap = {
  1: '1K',
  2: '2K',
  3: '4K'
};

const TexturePreview = ({
  generatedTexture,
  isGenerating,
  isUpscaling,
  upscaleProgress,
  isConfirmed,
  resolution,
  handleRegenerate,
  handleUpscale,
  canModify
}: TexturePreviewProps) => {
  if (isGenerating) {
    return (
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center font-medium text-lg">Creating your texture preview...</p>
          <p className="text-center text-muted-foreground mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }
  
  if (isUpscaling) {
    return (
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <Progress value={upscaleProgress} className="w-64 mb-4" />
          <p className="text-center font-medium text-lg">Generating high-resolution texture...</p>
          <p className="text-center text-muted-foreground mt-2">{upscaleProgress}% complete</p>
        </div>
      </div>
    );
  }
  
  if (generatedTexture) {
    return (
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
        <img 
          src={generatedTexture} 
          alt="Generated texture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-black/40 backdrop-blur-sm">
            {isConfirmed ? resolutionMap[resolution[0] as 1 | 2 | 3] : 'Preview'}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {!isConfirmed && (
            <>
              <Button 
                size="sm"
                onClick={handleRegenerate}
                disabled={!canModify}
                variant="secondary"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpscale}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Finalize
              </Button>
            </>
          )}
          {isConfirmed && (
            <Button size="sm" variant="secondary">
              <Upload className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Empty state
  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <ImageIcon className="h-16 w-16 mb-4 text-muted-foreground/50" />
        <p className="font-medium text-lg">Your texture will appear here</p>
        <p className="text-muted-foreground mt-2">
          Start by entering a prompt or uploading reference images
        </p>
      </div>
    </div>
  );
};

export default TexturePreview;
