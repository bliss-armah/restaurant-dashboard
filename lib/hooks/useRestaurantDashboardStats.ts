"use client";

import { useEffect, useState, useCallback } from "react";
import { getStats } from "@/lib/api";
import type { RestaurantDashboardStats, Order } from "@/lib/types";

export function useRestaurantDashboardStats(restaurantId: string | undefined) {
  const [stats, setStats] = useState<RestaurantDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const res = await getStats();
      const data = res.data;
      setStats({
        totalOrders: data.totalOrders,
        pendingOrders: data.pendingOrders,
        revenue: data.revenue,
        avgOrderValue: data.avgOrderValue,
        totalMenuItems: data.totalMenuItems,
        totalCategories: data.totalCategories,
      });
      setRecentOrders(data.recentOrders || []);
    } catch (err: any) {
      console.error("useRestaurantDashboardStats:", err.message);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId) return;
    load();

    const interval = setInterval(load, 30_000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [restaurantId, load]);

  return { stats, loading, recentOrders };
}
