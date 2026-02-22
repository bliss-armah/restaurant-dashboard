"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
    id,
    order_number,
    total_amount,
    status,
    payment_status,
    delivery_address,
    customer_notes,
    created_at,
    customer:customer_id(name, phone),
    items:order_items(id, item_name, item_price, quantity, subtotal)
  `,
        )
        .order("created_at", { ascending: false })
        .returns<Order[]>();
      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("useOrders: failed to load", err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const updateOrderStatus = useCallback(
    async (orderId: string, status?: string, paymentStatus?: string) => {
      const payload: Record<string, string> = {};
      if (status) payload.status = status;
      if (paymentStatus) payload.payment_status = paymentStatus;
      const { error } = await supabase
        .from("orders")
        .update(payload)
        .eq("id", orderId);
      if (error) throw error;
      await loadOrders();
    },
    [loadOrders],
  );

  return { orders, loading, updateOrderStatus };
}
