import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

// Maximum number of modifications allowed for free users
const MAX_FREE_MODIFICATIONS = 3;

export const useSubscription = (modificationCount: number) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user can modify
  const canModify = useMemo(
    () =>
      user?.subscriptionPlan === "pro" ||
      modificationCount < MAX_FREE_MODIFICATIONS,
    [user?.subscriptionPlan, modificationCount]
  );

  // Calculate remaining modifications
  const remainingModifications = useMemo(
    () =>
      user?.subscriptionPlan === "pro"
        ? "∞"
        : `${
            MAX_FREE_MODIFICATIONS - modificationCount
          }/${MAX_FREE_MODIFICATIONS}`,
    [user?.subscriptionPlan, modificationCount]
  );

  return {
    userSubscriptionPlan: { isPro: user?.subscriptionPlan === "pro" },
    isAuthenticated,
    canModify,
    remainingModifications,
    MAX_FREE_MODIFICATIONS,
  };
};
