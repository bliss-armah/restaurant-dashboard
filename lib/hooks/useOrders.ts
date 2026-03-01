"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch orders from the backend API (not Supabase directly) ─────────────
  const loadOrders = useCallback(async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        setError("Not authenticated");
        setOrders([]);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
  }, []);

  // ── Initial load + real-time refresh via Supabase (read-only subscription) ─
  useEffect(() => {
    loadOrders();

    const sub = supabase
      .channel("orders-hook")
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
  }, [loadOrders]);

  // ── Update status via backend — triggers WhatsApp + validation server-side ─
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

      // Refresh the list so UI reflects the new state
      await loadOrders();
    },
    [loadOrders],
  );

  return { orders, loading, error, updateOrderStatus };
}
