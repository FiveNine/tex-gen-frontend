
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, RefreshCcw, Check, Download, Lock } from 'lucide-react';
import { TextureVariation } from '@/hooks/useTextureGeneration';

interface TexturePreviewProps {
  generatedTexture: string | null;
  isGenerating: boolean;
  isUpscaling: boolean;
  upscaleProgress: number;
  isConfirmed: boolean;
  resolution: number;
  handleRegenerate: () => void;
  handleUpscale: () => void;
  handleDownload: (jobId: string) => void;
  canModify: boolean;
  isAuthenticated: boolean;
  variations: TextureVariation[];
}

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

const TexturePreview = ({
  generatedTexture,
  isGenerating,
  isUpscaling,
  upscaleProgress,
  isConfirmed,
  resolution,
  handleRegenerate,
  handleUpscale,
  handleDownload,
  canModify,
  isAuthenticated,
  variations
}: TexturePreviewProps) => {
  // Mock job ID for demonstration purposes
  const mockJobId = "job-123456789";

  if (isGenerating) {
    return (
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center font-medium text-lg">Creating your texture variations...</p>
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
            {isConfirmed ? "1024x1024" : '256x256'}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {!isConfirmed ? (
            variations.length > 0 && (
              <>
                <Button 
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={!canModify}
                  variant="secondary"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Modify
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
            )
          ) : (
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => handleDownload(mockJobId)}
            >
              {isAuthenticated ? (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign in to download
                </>
              )}
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
