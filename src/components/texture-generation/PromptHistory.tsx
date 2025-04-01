
import React from 'react';
import { Label } from '@/components/ui/label';

interface PromptHistoryProps {
  currentPromptHistory: string[];
  setPrompt: (prompt: string) => void;
}

const PromptHistory = ({ currentPromptHistory, setPrompt }: PromptHistoryProps) => {
  if (currentPromptHistory.length <= 1) {
    return null;
  }
  
  return (
    <div>
      <Label className="text-sm mb-2 block">Prompt History</Label>
      <div className="space-y-2 max-h-32 overflow-y-auto text-sm">
        {currentPromptHistory.map((historyPrompt, index) => (
          <div 
            key={index}
            className="p-2 bg-secondary/50 rounded-md cursor-pointer hover:bg-secondary"
            onClick={() => setPrompt(historyPrompt)}
          >
            {historyPrompt}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptHistory;
