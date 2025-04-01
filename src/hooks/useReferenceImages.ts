
import { useState } from 'react';
import { toast } from 'sonner';

// Maximum number of reference images allowed
const MAX_REFERENCE_IMAGES = 20;

export const useReferenceImages = () => {
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (referenceImages.length + files.length > MAX_REFERENCE_IMAGES) {
      toast.error(`Maximum ${MAX_REFERENCE_IMAGES} reference images allowed`, {
        description: `You already have ${referenceImages.length} images attached.`
      });
      
      // Reset the input to allow uploading again later
      event.target.value = '';
      return;
    }
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // Process all files if under the limit
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newFiles.push(file);
        
        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === newFiles.length) {
              setReferenceImages(prev => [...prev, ...newFiles]);
              setReferenceImagePreviews(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Reset the input to allow uploading the same file again
    event.target.value = '';
    
    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} added`, {
        description: "Reference images will help guide the AI generation"
      });
    }
  };
  
  const removeReferenceImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
    setReferenceImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return {
    referenceImages,
    referenceImagePreviews,
    handleImageUpload,
    removeReferenceImage,
    MAX_REFERENCE_IMAGES
  };
};
