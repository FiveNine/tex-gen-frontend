
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Texture } from '@/utils/mockData';
import { textureApi } from '@/api/textureApi';
import { toast } from 'sonner';
import { LoginDialog } from '@/components/texture-generation/GenerationDialogs';

interface TextureCardProps {
  texture: Texture;
  isAuthenticated?: boolean;
}

const TextureCard = ({ texture, isAuthenticated = true }: TextureCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  const formattedDate = new Date(texture.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleDownload = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsDownloading(true);
    try {
      // In a real implementation, this would use the actual jobId
      const mockJobId = `job-${texture.id}`;
      const downloadUrl = await textureApi.downloadTexture(mockJobId);
      
      // Create temporary link to download the image
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `texture-${texture.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Texture downloaded successfully");
    } catch (error) {
      toast.error("Failed to download texture", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="texture-card overflow-hidden bg-secondary h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={texture.imageUrl}
          alt={texture.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-sm border-none">
            256x256
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-lg mb-2 line-clamp-1">{texture.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{texture.prompt}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-2">
          {texture.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {texture.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{texture.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t bg-card/30 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-1.5 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isAuthenticated ? (
                  <Download size={16} className={isDownloading ? "animate-pulse" : ""} />
                ) : (
                  <Lock size={16} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isAuthenticated ? "Download 1024x1024 texture" : "Sign in to download"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
      
      <LoginDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
    </Card>
  );
};

export default TextureCard;
