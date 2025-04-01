
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="space-y-2 w-full">
      <Textarea
        id="prompt"
        placeholder={getPromptInputPlaceholder()}
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="resize-none w-full"
      />
    </div>
  );
};

export default PromptInput;
