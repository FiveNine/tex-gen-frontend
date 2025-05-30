
import React, { useState } from 'react';
import { useReferenceImages } from '@/hooks/useReferenceImages';
import { useTextureGeneration } from '@/hooks/useTextureGeneration';
import { useSubscription } from '@/hooks/useSubscription';
import { LoginDialog, ResolutionDialog } from './GenerationDialogs';

// Import sub-components
import PromptInput from './PromptInput';
import PromptHistory from './PromptHistory';
import GenerateButton from './GenerateButton';
import GenerationTips from './GenerationTips';
import TexturePreview from './TexturePreview';
import TextureVariations from './TextureVariations';
import GenerationWarning from './GenerationWarning';
import SubscriptionBadge from './SubscriptionBadge';

const GenerationForm = () => {
  const {
    referenceImages,
    referenceImagePreviews,
    handleImageUpload,
    removeReferenceImage
  } = useReferenceImages();

  const {
    prompt,
    setPrompt,
    isGenerating,
    isUpscaling,
    generatedTexture,
    modificationCount,
    isConfirmed,
    currentPromptHistory,
    upscaleProgress,
    selectedResolution,
    setSelectedResolution,
    variations,
    selectedVariationIndex,
    handleGenerate,
    handleModify,
    handleUpscale,
    handleConfirmResolution,
    handleSelectVariation,
    handleDownloadTexture,
    getResolutionLabel,
    isResolutionAvailable
  } = useTextureGeneration();

  const {
    userSubscriptionPlan,
    isAuthenticated,
    canModify,
    remainingModifications,
    MAX_FREE_MODIFICATIONS
  } = useSubscription(modificationCount);

  // Dialog states
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showResolutionDialog, setShowResolutionDialog] = useState(false);

  const handleGenerateClick = () => {
    console.log("Is Authenticated", isAuthenticated);
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    handleGenerate(referenceImages);
  };

  const handleModifyClick = () => {
    if (!canModify) {
      return;
    }
    handleModify();
  };

  const handleUpscaleClick = () => {
    setShowResolutionDialog(true);
  };

  const handleConfirmResolutionClick = () => {
    setShowResolutionDialog(false);
    handleConfirmResolution();
  };

  const handleDownloadClick = (jobId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    handleDownloadTexture(jobId);
  };

  const isButtonDisabled = !prompt.trim() && referenceImages.length === 0;
  const hasVariations = variations.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-secondary/30 rounded-xl p-6 shadow-lg w-full max-w-6xl">
      <div className="lg:col-span-5">
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
            {!hasVariations || isConfirmed ? (
              <GenerateButton 
                handleGenerate={handleGenerateClick}
                isGenerating={isGenerating}
                isUpscaling={isUpscaling}
                isDisabled={isButtonDisabled}
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <GenerateButton 
                  handleGenerate={handleModifyClick}
                  isGenerating={isGenerating}
                  isUpscaling={isUpscaling}
                  isDisabled={isButtonDisabled}
                  label="Modify"
                />
                <GenerateButton 
                  handleGenerate={handleUpscaleClick}
                  isGenerating={isGenerating}
                  isUpscaling={isUpscaling}
                  isDisabled={false}
                  label="Finalize"
                  variant="primary"
                />
              </div>
            )}
          </div>
          
          <GenerationTips />
        </div>
      </div>
      
      <div className="lg:col-span-7 flex flex-col gap-4 items-center justify-center">
        <TexturePreview 
          generatedTexture={generatedTexture}
          isGenerating={isGenerating}
          isUpscaling={isUpscaling}
          upscaleProgress={upscaleProgress}
          isConfirmed={isConfirmed}
          resolution={selectedResolution}
          handleRegenerate={handleModifyClick}
          handleUpscale={handleUpscaleClick}
          handleDownload={handleDownloadClick}
          canModify={canModify}
          isAuthenticated={isAuthenticated}
          variations={variations}
        />
        
        {variations.length > 0 && !isConfirmed && !isGenerating && !isUpscaling && (
          <TextureVariations 
            variations={variations}
            selectedIndex={selectedVariationIndex}
            onSelectVariation={handleSelectVariation}
          />
        )}
      </div>

      <div className="lg:col-span-12">
        <GenerationWarning 
          isConfirmed={isConfirmed}
          userSubscriptionPlan={userSubscriptionPlan}
          modificationCount={modificationCount}
          maxFreeModifications={MAX_FREE_MODIFICATIONS}
        />
      </div>

      {/* Dialogs */}
      <LoginDialog 
        open={showLoginPrompt} 
        onOpenChange={setShowLoginPrompt} 
      />
      
      <ResolutionDialog 
        open={showResolutionDialog} 
        onOpenChange={setShowResolutionDialog}
        selectedResolution={selectedResolution}
        setSelectedResolution={setSelectedResolution}
        onConfirm={handleConfirmResolutionClick}
        getResolutionLabel={getResolutionLabel}
        isResolutionAvailable={(res) => isResolutionAvailable(res, userSubscriptionPlan.isPro)}
        isPro={userSubscriptionPlan.isPro}
      />
    </div>
  );
};

export default GenerationForm;
