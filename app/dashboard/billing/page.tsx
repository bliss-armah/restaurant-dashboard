"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, CheckCircle2, Loader2, AlertTriangle, Clock } from "lucide-react";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Subscription } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  "non-renewing": "bg-yellow-100 text-yellow-800 border-yellow-200",
};

function formatAmount(pesewas: number) {
  return `GHS ${(pesewas / 100).toFixed(2)}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Trial status card ────────────────────────────────────────────────────────

function TrialCard({ trialDaysLeft, trialEndsAt }: { trialDaysLeft: number; trialEndsAt: string | null }) {
  console.log("trialDaysLeft", trialDaysLeft);
  
  const expired = trialDaysLeft === 0;

  // Compute billing window: starts on trial end date, ends one month later
  const billingStart = trialEndsAt ? formatDate(trialEndsAt) : null;
  const billingEnd = trialEndsAt
    ? formatDate(new Date(new Date(trialEndsAt).setMonth(new Date(trialEndsAt).getMonth() + 1)).toISOString())
    : null;

  return (
    <Card className={`shadow-none ${expired ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
      <CardContent className="py-5 px-5 space-y-1">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 shrink-0 ${expired ? "text-amber-600" : "text-blue-600"}`} />
          <p className={`text-sm font-semibold ${expired ? "text-amber-900" : "text-blue-900"}`}>
            {expired ? "Your free trial has ended" : `You're on a free trial · ${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} remaining`}
          </p>
        </div>
        {!expired && billingStart && billingEnd && (
          <p className="text-xs text-blue-700 pl-6">
            Choose a plan below. Your first billing period runs from <strong>{billingStart}</strong> to <strong>{billingEnd}</strong>.
          </p>
        )}
        {expired && (
          <p className="text-xs text-amber-700 pl-6">
            Your trial ended on {billingStart}. Pick a plan to continue using the bot.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Plan cards ───────────────────────────────────────────────────────────────

function PlanCard({
  interval,
  price,
  priceLabel,
  badge,
  highlight,
  onSubscribe,
  loading,
}: {
  interval: "monthly" | "yearly";
  price: string;
  priceLabel: string;
  badge?: string;
  highlight?: boolean;
  onSubscribe: (interval: "monthly" | "yearly") => void;
  loading: boolean;
}) {
  return (
    <Card
      className={`relative border ${highlight ? "border-black shadow-md" : "border-border/60"} shadow-none`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
          {badge}
        </span>
      )}
      <CardContent className="pt-8 pb-6 text-center">
        <p className="text-sm font-medium text-muted-foreground capitalize mb-1">{interval}</p>
        <p className="text-4xl font-extrabold text-foreground">{price}</p>
        <p className="text-sm text-muted-foreground mt-1 mb-6">{priceLabel}</p>
        <Button
          onClick={() => onSubscribe(interval)}
          disabled={loading}
          className="w-full"
          variant={highlight ? "default" : "outline"}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Active subscription card ─────────────────────────────────────────────────

function ActiveSubscriptionCard({ sub }: { sub: Subscription }) {
  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="w-5 h-5" />
          Current Subscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
            <Badge variant="outline" className={`text-xs font-semibold ${STATUS_BADGE[sub.status]}`}>
              {sub.status.replace("-", " ")}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Plan</p>
            <p className="text-sm font-semibold capitalize">{sub.billingInterval}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Amount</p>
            <p className="text-sm font-semibold">{formatAmount(sub.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Next renewal</p>
            <p className="text-sm font-semibold">{formatDate(sub.currentPeriodEnd)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Paystack return handler (isolated to avoid layout double-render) ─────────

function PaystackReturnHandler({ onReturn }: { onReturn: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("reference");
    if (!ref) return;
    // Remove the query param so this never fires again on re-render
    window.history.replaceState(null, "", window.location.pathname);
    onReturn();
  // onReturn is stable (useCallback), searchParams only changes on actual URL change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { subscription, isTrial, trialDaysLeft, trialEndsAt, loading, error, subscribe, refetch } = useSubscription();
  const [subscribing, setSubscribing] = useState(false);
  const [returnMessage, setReturnMessage] = useState<string | null>(null);

  const handlePaystackReturn = useCallback(() => {
    setReturnMessage("Payment received — refreshing your subscription status…");
    refetch().then(() => setReturnMessage(null));
  }, [refetch]);

  const handleSubscribe = async (interval: "monthly" | "yearly") => {
    setSubscribing(true);
    try {
      await subscribe(interval);
    } catch (err: any) {
      alert(err.message);
      setSubscribing(false);
    }
  };

  const hasActive = subscription?.status === "active";
  const showPlans = !hasActive;

  return (
    <div className="space-y-6 animate-fade-in">
      <Suspense fallback={null}>
        <PaystackReturnHandler onReturn={handlePaystackReturn} />
      </Suspense>

      <PageHeader
        title="Billing"
        subtitle="Manage your Choppa subscription"
      />

      {/* Return from Paystack notification */}
      {returnMessage && (
        <Card className="border-emerald-200 bg-emerald-50 shadow-none">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-800">{returnMessage}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5 shadow-none">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active subscription details */}
          {subscription && (
            <ActiveSubscriptionCard sub={subscription} />
          )}

          {/* Trial status — shown when in trial and no active Paystack subscription yet */}
          {isTrial && !hasActive && (
            <TrialCard trialDaysLeft={trialDaysLeft} trialEndsAt={trialEndsAt} />
          )}

          {/* Plan selection */}
          {showPlans && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Choose a plan</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isTrial
                    ? "Billing starts when your trial ends. Cancel anytime."
                    : "Your first 30 days are free on any plan. Cancel anytime."}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
                <PlanCard
                  interval="monthly"
                  price="GHS 30"
                  priceLabel="per month"
                  onSubscribe={handleSubscribe}
                  loading={subscribing}
                />
                <PlanCard
                  interval="yearly"
                  price="GHS 324"
                  priceLabel="per year · save 10%"
                  badge="Best value"
                  highlight
                  onSubscribe={handleSubscribe}
                  loading={subscribing}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
