
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, X } from 'lucide-react';

interface ReferenceImageUploadProps {
  referenceImages: File[];
  referenceImagePreviews: string[];
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeReferenceImage: (index: number) => void;
}

const ReferenceImageUpload = ({
  referenceImages,
  referenceImagePreviews,
  handleImageUpload,
  removeReferenceImage
}: ReferenceImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center">
        <ImageIcon className="mr-2 h-4 w-4" /> Reference Images (Optional)
      </Label>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Display uploaded reference images */}
        {referenceImagePreviews.map((preview, index) => (
          <div key={index} className="relative aspect-square border rounded-md overflow-hidden bg-secondary/50">
            <img 
              src={preview} 
              alt={`Reference ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 w-6 h-6 rounded-full"
              onClick={() => removeReferenceImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {/* Image upload button if less than 3 images */}
        {referenceImages.length < 3 && (
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Upload className="h-6 w-6 mb-1 text-muted-foreground" />
            <p className="text-xs text-center text-muted-foreground">Add Image</p>
            <Input 
              type="file" 
              className="hidden" 
              id="image-upload" 
              accept="image/png, image/jpeg" 
              onChange={handleImageUpload} 
              multiple
            />
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Upload up to 3 images (PNG, JPG up to 5MB each)
      </p>
    </div>
  );
};

export default ReferenceImageUpload;
