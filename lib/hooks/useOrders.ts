"use client";

import { useState, useEffect, useCallback } from "react";
import { getOrders, updateOrderStatus as apiUpdateStatus } from "@/lib/api";
import type { Order } from "@/lib/types";

export function useOrders(restaurantId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await getOrders(restaurantId);
      setOrders(res.data || []);
      setError(null);
    } catch (err: any) {
      console.error("useOrders: failed to load", err.message);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    setLoading(true);
    load();

    // Poll every 30 seconds for live order updates
    const interval = setInterval(load, 30_000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status?: string, paymentStatus?: string) => {
      const payload: Record<string, string> = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.paymentStatus = paymentStatus;
      await apiUpdateStatus(orderId, payload);
      await load();
    },
    [load],
  );

  return { orders, loading, error, reload: load, updateOrderStatus };
}
