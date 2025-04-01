
import React, { useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  modificationCount: number;
  referenceImages: File[];
  referenceImagePreviews: string[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeReferenceImage: (index: number) => void;
}

const PromptInput = ({ 
  prompt, 
  setPrompt, 
  modificationCount,
  referenceImages,
  referenceImagePreviews,
  handleImageUpload,
  removeReferenceImage
}: PromptInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPromptInputPlaceholder = () => {
    if (modificationCount > 0) {
      return "Modify your prompt to refine the texture...";
    }
    return "E.g., Weathered red brick wall with moss growing between bricks, seamless texture pattern";
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2 w-full">
      <div className="relative w-full bg-background rounded-md border border-input overflow-hidden">
        {/* Reference Images Display */}
        {referenceImagePreviews.length > 0 && (
          <div className="flex gap-2 p-2 bg-secondary/20">
            {referenceImagePreviews.map((preview, index) => (
              <div key={index} className="relative h-12 w-12 rounded-md overflow-hidden group">
                <img 
                  src={preview} 
                  alt={`Reference ${index + 1}`} 
                  className="h-full w-full object-cover" 
                />
                <Button 
                  size="icon" 
                  className="absolute top-0 right-0 w-4 h-4 p-0 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeReferenceImage(index)}
                >
                  <X className="h-2 w-2 text-black" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Scrollable Text Area */}
        <ScrollArea className="w-full max-h-[300px] overflow-auto">
          <textarea
            id="prompt"
            placeholder={getPromptInputPlaceholder()}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 p-3 min-h-[150px]"
            style={{ minHeight: '150px' }}
          />
        </ScrollArea>
        
        {/* Bottom Toolbar */}
        <div className="flex justify-between items-center p-2 border-t border-input">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1 text-muted-foreground"
            onClick={handleAttachClick}
          >
            <Upload className="h-3 w-3" /> Attach
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg" 
              onChange={handleImageUpload} 
              multiple
            />
          </Button>
          
          <div className="text-xs text-muted-foreground">
            {referenceImages.length}/3 images
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
