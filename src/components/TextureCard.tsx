
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Texture } from '@/utils/mockData';

interface TextureCardProps {
  texture: Texture;
}

const TextureCard = ({ texture }: TextureCardProps) => {
  const formattedDate = new Date(texture.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

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
            {texture.resolution}
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
              <button className="p-1.5 rounded-full hover:bg-primary/20 transition-colors">
                <Download size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download texture</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default TextureCard;
