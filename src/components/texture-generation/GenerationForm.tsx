
import React, { useState } from 'react';
import { toast } from 'sonner';
import { mockTextures } from '@/utils/mockData';

// Import sub-components
import PromptInput from './PromptInput';
import ReferenceImageUpload from './ReferenceImageUpload';
import PromptHistory from './PromptHistory';
import GenerateButton from './GenerateButton';
import GenerationTips from './GenerationTips';
import TexturePreview from './TexturePreview';
import GenerationWarning from './GenerationWarning';
import SubscriptionBadge from './SubscriptionBadge';
import ResolutionSelector from './ResolutionSelector';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

// Mock user subscription status - In a real app, this would come from authentication
const userSubscriptionPlan = {
  isPro: false, // Set to true to test Pro plan features
};

// Mock authentication state - In a real app, this would come from authentication
const mockIsAuthenticated = false; // Set to false to test login prompt

// Maximum number of modifications allowed for free users
const MAX_FREE_MODIFICATIONS = 3;

const GenerationForm = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [generatedTexture, setGeneratedTexture] = useState<null | string>(null);
  const [modificationCount, setModificationCount] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [currentPromptHistory, setCurrentPromptHistory] = useState<string[]>([]);
  const [upscaleProgress, setUpscaleProgress] = useState(0);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showResolutionDialog, setShowResolutionDialog] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<number>(2048);

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

    // Check if user is authenticated
    if (!mockIsAuthenticated) {
      setShowLoginPrompt(true);
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
    setShowResolutionDialog(true);
  };

  const handleConfirmResolution = () => {
    setShowResolutionDialog(false);
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
            toast.success(`${getResolutionLabel(selectedResolution)} texture generated!`, {
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

  const getResolutionLabel = (res: number): string => {
    switch (res) {
      case 2048: return "2K";
      case 4096: return "4K";
      case 8192: return "8K";
      default: return `${res}px`;
    }
  };

  const isResolutionAvailable = (res: number): boolean => {
    if (res === 8192) {
      return userSubscriptionPlan.isPro;
    }
    return true;
  };

  return (
    <div className="grid md:grid-cols-5 gap-8 bg-secondary/30 rounded-xl p-6 shadow-lg">
      <div className="md:col-span-2">
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
      
      <div className="md:col-span-3 flex items-center justify-center">
        <TexturePreview 
          generatedTexture={generatedTexture}
          isGenerating={isGenerating}
          isUpscaling={isUpscaling}
          upscaleProgress={upscaleProgress}
          isConfirmed={isConfirmed}
          resolution={selectedResolution}
          handleRegenerate={handleRegenerate}
          handleUpscale={handleUpscale}
          canModify={canModify}
        />
      </div>

      <div className="md:col-span-5">
        <GenerationWarning 
          isConfirmed={isConfirmed}
          userSubscriptionPlan={userSubscriptionPlan}
          modificationCount={modificationCount}
          maxFreeModifications={MAX_FREE_MODIFICATIONS}
        />
      </div>

      {/* Login Dialog */}
      <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be signed in to generate textures. Please sign in or create an account to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Sign In</AlertDialogAction>
            <AlertDialogAction className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resolution Selection Dialog */}
      <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Texture Resolution</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-3 gap-2">
              {[64, 128, 256, 1024, 2048, 4096, 8192].map((res) => (
                <Button
                  key={res}
                  variant={selectedResolution === res ? "default" : "outline"}
                  onClick={() => setSelectedResolution(res)}
                  className={`${!isResolutionAvailable(res) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isResolutionAvailable(res)}
                >
                  {getResolutionLabel(res)}
                  {res === 8192 && !userSubscriptionPlan.isPro && 
                    <span className="ml-1 text-xs">(Pro)</span>
                  }
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="secondary" 
              onClick={() => setShowResolutionDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={handleConfirmResolution}
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerationForm;
