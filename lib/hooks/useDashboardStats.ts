"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DashboardStats } from "@/lib/types";

export function useDashboardStats(enabled: boolean) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    loadStats();
  }, [enabled]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [
        { count: totalRestaurants },
        { count: activeRestaurants },
        { count: totalUsers },
        { count: totalOrders },
        { data: revenueData },
      ] = await Promise.all([
        supabase
          .from("restaurants")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("restaurants")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("total_amount")
          .eq("payment_status", "PAID"),
      ]);

      const totalRevenue =
        revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalRestaurants: totalRestaurants || 0,
        activeRestaurants: activeRestaurants || 0,
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        recentActivity: [],
      });
    } catch (error: any) {
      console.error("Error loading dashboard stats:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading };
}
