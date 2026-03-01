"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useOrders(restaurantId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        setError("Not authenticated");
        setOrders([]);
        return;
      }

      const params = new URLSearchParams();
      if (restaurantId) params.set("restaurantId", restaurantId);

      const res = await fetch(
        `${BACKEND_URL}/orders${params.toString() ? `?${params}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const { data } = await res.json();
      setOrders(data || []);
      setError(null);
    } catch (err: any) {
      console.error("useOrders: failed to load", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    setLoading(true);
    loadOrders();

    const sub = supabase
      .channel(`orders-hook-${restaurantId ?? "default"}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        loadOrders,
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        loadOrders,
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, [loadOrders, restaurantId]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status?: string, paymentStatus?: string) => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const payload: Record<string, string> = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const res = await fetch(`${BACKEND_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      await loadOrders();
    },
    [loadOrders],
  );

  return { orders, loading, error, updateOrderStatus };
}
