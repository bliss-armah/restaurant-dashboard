"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Category, CategoryFormData } from "@/lib/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("useCategories: failed to load", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    const sub = supabase
      .channel("categories-hook")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        loadCategories,
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, [loadCategories]);

  const createCategory = useCallback(
    async (data: CategoryFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const restaurantId = user?.user_metadata?.restaurantId;
      const { error } = await supabase.from("menu_categories").insert({
        ...data,
        restaurant_id: restaurantId,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await loadCategories();
    },
    [loadCategories],
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
    createCategory,
    updateCategory,
    toggleCategoryActive,
  };
}
