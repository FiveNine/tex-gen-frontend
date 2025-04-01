
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SubscriptionBadgeProps {
  userSubscriptionPlan: {
    isPro: boolean;
  };
  remainingModifications: string;
}

const SubscriptionBadge = ({ 
  userSubscriptionPlan, 
  remainingModifications 
}: SubscriptionBadgeProps) => {
  return (
    <Badge 
      variant={userSubscriptionPlan.isPro ? "default" : "outline"} 
      className={userSubscriptionPlan.isPro ? "bg-gradient-to-r from-purple-600 to-indigo-600" : ""}
    >
      {userSubscriptionPlan.isPro ? "Pro: Unlimited" : `Modifications: ${remainingModifications}`}
    </Badge>
  );
};

export default SubscriptionBadge;
