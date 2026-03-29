"use client";

import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { useSubscription } from "@/lib/hooks/useSubscription";

export function SubscriptionBanner() {
  const { subscription, subscriptionStatus, isTrial, trialDaysLeft, loading, error } = useSubscription();

  if (loading) return null;
  // Don't show anything if subscription status is unknown (API error or still resolving)
  if (error || !subscriptionStatus) return null;
  if (subscription?.status === "active") return null;

  // During trial: only show banner when 10 or fewer days remain
  if (isTrial) {
    if (trialDaysLeft > 10) return null;

    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800 flex-1">
          {trialDaysLeft === 0
            ? "Your free trial has ended."
            : `Your free trial ends in ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"}.`}
        </p>
        <Link
          href="/dashboard/billing"
          className="text-sm font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 whitespace-nowrap"
        >
          Choose a plan →
        </Link>
      </div>
    );
  }

  const isCancelled = subscription?.status === "cancelled";

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3">
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
      <p className="text-sm text-amber-800 flex-1">
        {isCancelled
          ? "Your subscription has been cancelled. Resubscribe to restore access."
          : "You don't have an active subscription. Subscribe to keep your bot running."}
      </p>
      <Link
        href="/dashboard/billing"
        className="text-sm font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700 whitespace-nowrap"
      >
        Subscribe now →
      </Link>
    </div>
  );
}
