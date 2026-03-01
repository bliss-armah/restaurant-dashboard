"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import type { MenuItem, MenuItemFormData, Category } from "@/lib/types";

export function useMenuItems(restaurantIdOverride?: string) {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Super admins pass an explicit restaurantIdOverride.
  // Restaurant admins use their own restaurantId from auth.
  const restaurantId = restaurantIdOverride ?? user?.restaurantId;

  const loadData = useCallback(async () => {
    if (!restaurantId) {
      setMenuItems([]);
      setCategories([]);
      setLoading(false);
      return;
    }
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase
          .from("menu_items")
          .select("*, category:category_id(id, name, restaurant_id)")
          .eq("category.restaurant_id", restaurantId)
          .not("category", "is", null)
          .order("sort_order"),
        supabase
          .from("menu_categories")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("sort_order"),
      ]);
      if (itemsRes.error) throw itemsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      setMenuItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err: any) {
      console.error("useMenuItems: failed to load", err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    setLoading(true);
    loadData();
    const sub = supabase
      .channel(`menu-items-hook-${restaurantId ?? "none"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        loadData,
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, [loadData, restaurantId]);

  const createMenuItem = useCallback(
    async (data: MenuItemFormData) => {
      const { error } = await supabase.from("menu_items").insert({
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        category_id: data.category_id,
        image_url: data.image_url || null,
        sort_order: data.sort_order,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await loadData();
    },
    [loadData],
  );

  const updateMenuItem = useCallback(
    async (id: string, data: MenuItemFormData) => {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: data.name,
          description: data.description || null,
          price: parseFloat(data.price),
          category_id: data.category_id,
          image_url: data.image_url || null,
          sort_order: data.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
      await loadData();
    },
    [loadData],
  );

  const toggleItemAvailable = useCallback(
    async (item: MenuItem) => {
      const { error } = await supabase
        .from("menu_items")
        .update({
          is_available: !item.is_available,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
      if (error) console.error("useMenuItems: toggle failed", error);
      await loadData();
    },
    [loadData],
  );

  return {
    menuItems,
    categories,
    loading,
    restaurantId,
    createMenuItem,
    updateMenuItem,
    toggleItemAvailable,
  };
}
