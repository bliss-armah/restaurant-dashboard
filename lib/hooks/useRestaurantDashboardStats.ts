"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RestaurantDashboardStats, Order } from "@/lib/types";

export function useRestaurantDashboardStats(restaurantId: string | undefined) {
  const [stats, setStats] = useState<RestaurantDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!restaurantId) return;

    let sub: ReturnType<typeof supabase.channel> | null = null;

    const load = async () => {
      setLoading(true);
      try {
        const [
          { data: allOrders },
          { data: menuItemsData },
          { count: categoryCount },
        ] = await Promise.all([
          supabase
            .from("orders")
            .select(
              `id, order_number, total_amount, status, payment_status,
               delivery_address, customer_notes, created_at,
               customer:customer_id(name, phone),
               items:order_items(id, item_name, item_price, quantity, subtotal)`,
            )
            .eq("restaurant_id", restaurantId)
            .order("created_at", { ascending: false }),
          // menu_items has no direct restaurant_id — count via category join
          supabase
            .from("menu_items")
            .select("id, category:category_id!inner(restaurant_id)")
            .eq("category.restaurant_id", restaurantId),
          supabase
            .from("menu_categories")
            .select("*", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId),
        ]);

        const orders = allOrders || [];
        // Schema enums: VERIFIED | PENDING_VERIFICATION | UNPAID | FAILED
        const paidOrders = orders.filter(
          (o) => o.payment_status === "VERIFIED",
        );
        const pendingOrders = orders.filter(
          (o) =>
            o.status === "PENDING" ||
            o.payment_status === "PENDING_VERIFICATION",
        );
        const revenue = paidOrders.reduce(
          (sum, o) => sum + (o.total_amount as number),
          0,
        );

        setStats({
          totalOrders: orders.length,
          pendingOrders: pendingOrders.length,
          revenue,
          avgOrderValue: paidOrders.length ? revenue / paidOrders.length : 0,
          totalMenuItems: menuItemsData?.length || 0,
          totalCategories: categoryCount || 0,
        });

        // Normalize Supabase join: customer is returned as array, pick first element
        const normalized: Order[] = orders.slice(0, 5).map((o) => ({
          id: o.id as string,
          order_number: o.order_number as string,
          total_amount: o.total_amount as number,
          status: o.status as string,
          payment_status: o.payment_status as string,
          delivery_address: o.delivery_address as string | null,
          customer_notes: o.customer_notes as string | null,
          created_at: o.created_at as string,
          customer: Array.isArray(o.customer)
            ? (o.customer[0] as { name: string | null; phone: string })
            : (o.customer as { name: string | null; phone: string }),
          items: (o.items as Order["items"]) || [],
        }));
        setRecentOrders(normalized);
      } catch (err: any) {
        console.error("useRestaurantDashboardStats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Live updates for new / updated orders
    sub = supabase
      .channel("dashboard-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        load,
      )
      .subscribe();

    return () => {
      sub?.unsubscribe();
    };
  }, [restaurantId]);

  return { stats, loading, recentOrders };
}
