
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  modificationCount: number;
}

const PromptInput = ({ prompt, setPrompt, modificationCount }: PromptInputProps) => {
  const getPromptInputPlaceholder = () => {
    if (modificationCount > 0) {
      return "Modify your prompt to refine the texture...";
    }
    return "E.g., Weathered red brick wall with moss growing between bricks, seamless texture pattern";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt" className="flex items-center">
        <Sparkles className="mr-2 h-4 w-4" /> Describe your texture
      </Label>
      <Textarea
        id="prompt"
        placeholder={getPromptInputPlaceholder()}
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="resize-none"
      />
    </div>
  );
};

export default PromptInput;
