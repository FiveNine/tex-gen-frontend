
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
    try {
      Array.from(files).forEach(file => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
          toast.error("Invalid file type", {
            description: `${file.name} is not an image file.`
          });
          return;
        }
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          toast.error("File too large", {
            description: `${file.name} exceeds the 5MB size limit.`
          });
          return;
        }
        
        newFiles.push(file);
        
        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            
            // Only update state when all valid files have been processed
            if (newPreviews.length === newFiles.length) {
              setReferenceImages(prev => [...prev, ...newFiles]);
              setReferenceImagePreviews(prev => [...prev, ...newPreviews]);
              
              if (newFiles.length > 0) {
                toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} added`, {
                  description: "Reference images will help guide the AI generation"
                });
              }
            }
          }
        };
        
        reader.onerror = () => {
          toast.error("Error reading file", {
            description: `Failed to process ${file.name}.`
          });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      toast.error("Error uploading images", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
    
    // Reset the input to allow uploading the same file again
    event.target.value = '';
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
