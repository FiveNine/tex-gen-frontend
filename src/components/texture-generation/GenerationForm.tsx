
import React, { useState } from 'react';
import { toast } from 'sonner';
import { mockTextures } from '@/utils/mockData';

// Import sub-components
import PromptInput from './PromptInput';
import ReferenceImageUpload from './ReferenceImageUpload';
import PromptHistory from './PromptHistory';
import ResolutionSelector from './ResolutionSelector';
import GenerateButton from './GenerateButton';
import GenerationTips from './GenerationTips';
import TexturePreview from './TexturePreview';
import GenerationWarning from './GenerationWarning';
import SubscriptionBadge from './SubscriptionBadge';

// Mock user subscription status - In a real app, this would come from authentication
const userSubscriptionPlan = {
  isPro: false, // Set to true to test Pro plan features
};

// Maximum number of modifications allowed for free users
const MAX_FREE_MODIFICATIONS = 3;

const GenerationForm = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [resolution, setResolution] = useState([2]); // 1=1K, 2=2K, 3=4K
  const [generatedTexture, setGeneratedTexture] = useState<null | string>(null);
  const [modificationCount, setModificationCount] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentPromptHistory, setCurrentPromptHistory] = useState<string[]>([]);
  const [upscaleProgress, setUpscaleProgress] = useState(0);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([]);

  // Check if user can modify
  const canModify = userSubscriptionPlan.isPro || modificationCount < MAX_FREE_MODIFICATIONS;
  
  // Calculate remaining modifications
  const remainingModifications = userSubscriptionPlan.isPro 
    ? '∞' 
    : `${MAX_FREE_MODIFICATIONS - modificationCount}/${MAX_FREE_MODIFICATIONS}`;

  const handleGenerate = () => {
    if (!prompt.trim() && referenceImages.length === 0) {
      toast.error("Please provide a text prompt or reference image", {
        description: "We need at least one input to generate a texture"
      });
      return;
    }
    
    // Reset confirmation state when generating a new texture
    setIsConfirmed(false);
    setIsGenerating(true);
    
    // Add current prompt to history
    if (prompt.trim() && !currentPromptHistory.includes(prompt)) {
      setCurrentPromptHistory(prev => [...prev, prompt]);
    }
    
    // Increment modification count if not the first generation
    if (generatedTexture && !userSubscriptionPlan.isPro) {
      setModificationCount(prev => prev + 1);
    }
    
    // Simulate texture generation with a random one from our mock data (low resolution preview)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockTextures.length);
      setGeneratedTexture(mockTextures[randomIndex].imageUrl);
      setIsGenerating(false);
      
      toast.success("Texture preview generated!", {
        description: "This is a low-resolution preview. Finalize when ready for high-resolution."
      });
    }, 2000);
  };

  const handleUpscale = () => {
    setIsUpscaling(true);
    setUpscaleProgress(0);
    
    // Simulate upscaling process with progress updates
    const interval = setInterval(() => {
      setUpscaleProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUpscaling(false);
            setIsConfirmed(true);
            toast.success("High-resolution texture generated!", {
              description: "Your texture has been added to the gallery."
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 700);
  };

  const handleRegenerate = () => {
    if (!canModify) {
      toast.error("Modification limit reached", {
        description: "Upgrade to Pro for unlimited modifications."
      });
      return;
    }
    handleGenerate();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    // Process up to 3 files
    const maxFiles = 3 - referenceImages.length;
    const filesToProcess = Math.min(files.length, maxFiles);
    
    for (let i = 0; i < filesToProcess; i++) {
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

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-secondary/30 rounded-xl p-6 shadow-lg">
      <div>
        <div className="flex justify-between items-center mb-4">
          <SubscriptionBadge 
            userSubscriptionPlan={userSubscriptionPlan}
            remainingModifications={remainingModifications}
          />
        </div>
        
        <div className="space-y-4">
          <PromptInput 
            prompt={prompt}
            setPrompt={setPrompt}
            modificationCount={modificationCount}
          />
          
          <ReferenceImageUpload 
            referenceImages={referenceImages}
            referenceImagePreviews={referenceImagePreviews}
            handleImageUpload={handleImageUpload}
            removeReferenceImage={removeReferenceImage}
          />
          
          <PromptHistory 
            currentPromptHistory={currentPromptHistory} 
            setPrompt={setPrompt} 
          />
          
          <div className="space-y-4 mt-4">
            <ResolutionSelector 
              resolution={resolution}
              setResolution={setResolution}
            />
            
            <GenerateButton 
              handleGenerate={handleGenerate}
              isGenerating={isGenerating}
              isUpscaling={isUpscaling}
              isDisabled={!prompt.trim() && referenceImages.length === 0}
            />
          </div>
          
          <GenerationTips />
        </div>
      </div>
      
      <div className="flex items-center justify-center">
        <TexturePreview 
          generatedTexture={generatedTexture}
          isGenerating={isGenerating}
          isUpscaling={isUpscaling}
          upscaleProgress={upscaleProgress}
          isConfirmed={isConfirmed}
          resolution={resolution}
          handleRegenerate={handleRegenerate}
          handleUpscale={handleUpscale}
          canModify={canModify}
        />
      </div>

      <GenerationWarning 
        isConfirmed={isConfirmed}
        userSubscriptionPlan={userSubscriptionPlan}
        modificationCount={modificationCount}
        maxFreeModifications={MAX_FREE_MODIFICATIONS}
      />
    </div>
  );
};

export default GenerationForm;
