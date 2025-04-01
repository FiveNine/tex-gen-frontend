
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface GenerateButtonProps {
  handleGenerate: () => void;
  isGenerating: boolean;
  isUpscaling: boolean;
  isDisabled: boolean;
}

const GenerateButton = ({ 
  handleGenerate, 
  isGenerating, 
  isUpscaling,
  isDisabled
}: GenerateButtonProps) => {
  return (
    <Button 
      onClick={handleGenerate} 
      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      disabled={isDisabled || isGenerating || isUpscaling}
    >
      {isGenerating ? (
        <>
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          Generating Preview...
        </>
      ) : (
        'Generate Texture Preview'
      )}
    </Button>
  );
};

export default GenerateButton;
