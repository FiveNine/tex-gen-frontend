
import { useState } from 'react';

export const usePromptState = () => {
  const [prompt, setPrompt] = useState('');
  const [currentPromptHistory, setCurrentPromptHistory] = useState<string[]>([]);
  
  const addToHistory = (newPrompt: string) => {
    if (newPrompt.trim() && !currentPromptHistory.includes(newPrompt)) {
      setCurrentPromptHistory(prev => [...prev, newPrompt]);
    }
  };

  return {
    prompt,
    setPrompt,
    currentPromptHistory,
    setCurrentPromptHistory,
    addToHistory
  };
};
