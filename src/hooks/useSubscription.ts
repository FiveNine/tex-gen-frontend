
import { useMemo } from 'react';

// Maximum number of modifications allowed for free users
const MAX_FREE_MODIFICATIONS = 3;

// Mock user subscription status - In a real app, this would come from authentication
const userSubscriptionPlan = {
  isPro: false, // Set to true to test Pro plan features
};

// Mock authentication state - In a real app, this would come from authentication
const mockIsAuthenticated = false; // Set to false to test login prompt

export const useSubscription = (modificationCount: number) => {
  // Check if user can modify
  const canModify = useMemo(() => 
    userSubscriptionPlan.isPro || modificationCount < MAX_FREE_MODIFICATIONS, 
    [modificationCount]
  );
  
  // Calculate remaining modifications
  const remainingModifications = useMemo(() => 
    userSubscriptionPlan.isPro 
      ? '∞' 
      : `${MAX_FREE_MODIFICATIONS - modificationCount}/${MAX_FREE_MODIFICATIONS}`,
    [modificationCount]
  );

  return {
    userSubscriptionPlan,
    isAuthenticated: mockIsAuthenticated,
    canModify,
    remainingModifications,
    MAX_FREE_MODIFICATIONS
  };
};
