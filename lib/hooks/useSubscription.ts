"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getBillingSubscription,
  initializeBillingSubscription,
  cancelBillingSubscription,
} from "@/lib/api";
import type { Subscription } from "@/lib/types";

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBillingSubscription();
      setSubscription(res.data.subscription ?? null);
      setSubscriptionStatus(res.data.subscriptionStatus ?? null);
      setTrialEndsAt(res.data.trialEndsAt ?? null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const subscribe = async (interval: "monthly" | "yearly") => {
    const res = await initializeBillingSubscription(interval);
    window.location.href = res.data.authorization_url;
  };

  const cancel = async () => {
    await cancelBillingSubscription();
    await fetchSubscription();
  };

  const isTrial = subscriptionStatus === "TRIAL";
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    subscription,
    subscriptionStatus,
    trialEndsAt,
    isTrial,
    trialDaysLeft,
    loading,
    error,
    subscribe,
    cancel,
    refetch: fetchSubscription,
  };
}
