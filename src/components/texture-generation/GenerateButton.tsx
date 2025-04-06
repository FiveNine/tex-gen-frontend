
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Check, Sparkles } from 'lucide-react';

interface GenerateButtonProps {
  handleGenerate: () => void;
  isGenerating: boolean;
  isUpscaling: boolean;
  isDisabled: boolean;
  label?: string;
  variant?: 'default' | 'primary';
}

const GenerateButton = ({ 
  handleGenerate, 
  isGenerating, 
  isUpscaling,
  isDisabled,
  label = "Generate Texture Preview",
  variant = 'default'
}: GenerateButtonProps) => {
  // Determine button text based on state and label
  const buttonText = () => {
    if (isGenerating) {
      return "Generating...";
    }
    if (isUpscaling) {
      return "Finalizing...";
    }
    return label;
  };

  // Determine button icon based on label
  const buttonIcon = () => {
    if (isGenerating || isUpscaling) {
      return <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />;
    }
    
    switch (label) {
      case "Modify":
        return <RefreshCcw className="mr-2 h-4 w-4" />;
      case "Finalize":
        return <Check className="mr-2 h-4 w-4" />;
      default:
        return <Sparkles className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Button 
      onClick={handleGenerate} 
      className={variant === 'primary' 
        ? "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
        : "w-full"
      }
      disabled={isDisabled || isGenerating || isUpscaling}
    >
      {buttonIcon()}
      {buttonText()}
    </Button>
  );
};

export default GenerateButton;
