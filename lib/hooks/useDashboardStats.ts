"use client";

import { useEffect, useState, useCallback } from "react";
import { getStats } from "@/lib/api";
import { DashboardStats } from "@/lib/types";

export function useDashboardStats(enabled: boolean) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err: any) {
      console.error("useDashboardStats: failed to load", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    load();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, load]);

  return { stats, loading };
}
