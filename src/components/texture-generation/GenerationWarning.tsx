
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface GenerationWarningProps {
  isConfirmed: boolean;
  userSubscriptionPlan: {
    isPro: boolean;
  };
  modificationCount: number;
  maxFreeModifications: number;
}

const GenerationWarning = ({ 
  isConfirmed, 
  userSubscriptionPlan, 
  modificationCount,
  maxFreeModifications
}: GenerationWarningProps) => {
  if (!isConfirmed) {
    return (
      <div className="mt-8 p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">This is a low-resolution preview</h4>
            <p className="text-sm text-muted-foreground">
              When you're satisfied with the texture, click "Finalize" to generate a high-resolution version 
              that will be added to your gallery. {!userSubscriptionPlan.isPro && 
                `You have ${maxFreeModifications - modificationCount} modifications remaining.`}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default GenerationWarning;
