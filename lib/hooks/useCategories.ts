"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import type { Category, CategoryFormData } from "@/lib/types";

export function useCategories(restaurantIdOverride?: string) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Super admins pass an explicit restaurantIdOverride.
  // Restaurant admins use their own restaurantId from auth.
  const restaurantId = restaurantIdOverride ?? user?.restaurantId;

  const loadCategories = useCallback(async () => {
    // If no restaurant is selected yet, clear the list and stop loading.
    if (!restaurantId) {
      setCategories([]);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("useCategories: failed to load", err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    setLoading(true);
    loadCategories();
    const sub = supabase
      .channel(`categories-hook-${restaurantId ?? "none"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        loadCategories,
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, [loadCategories, restaurantId]);

  const createCategory = useCallback(
    async (data: CategoryFormData) => {
      const rid = restaurantId;
      if (!rid) throw new Error("No restaurant selected.");
      const { error } = await supabase.from("menu_categories").insert({
        ...data,
        restaurant_id: rid,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await loadCategories();
    },
    [loadCategories, restaurantId],
  );

  const updateCategory = useCallback(
    async (id: string, data: CategoryFormData) => {
      const { error } = await supabase
        .from("menu_categories")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await loadCategories();
    },
    [loadCategories],
  );

  const toggleCategoryActive = useCallback(
    async (category: Category) => {
      const { error } = await supabase
        .from("menu_categories")
        .update({
          is_active: !category.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", category.id);
      if (error) console.error("useCategories: toggle failed", error);
      await loadCategories();
    },
    [loadCategories],
  );

  return {
    categories,
    loading,
    restaurantId,
    createCategory,
    updateCategory,
    toggleCategoryActive,
  };
}
