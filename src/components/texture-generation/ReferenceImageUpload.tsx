
import React from 'react';
// This file is kept for backwards compatibility but its functionality 
// has been integrated into the PromptInput component
// The component is now just a pass-through to maintain the API

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
  // This component is now empty as its functionality has been moved to PromptInput
  return null;
};

export default ReferenceImageUpload;
