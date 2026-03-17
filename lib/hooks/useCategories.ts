"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  createCategory as apiCreate,
  updateCategory as apiUpdate,
  toggleCategoryActive as apiToggle,
  deleteCategory as apiDelete,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Category, CategoryFormData } from "@/lib/types";

export function useCategories(restaurantIdOverride?: string) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const restaurantId = restaurantIdOverride ?? user?.restaurantId ?? undefined;

  const load = useCallback(async () => {
    if (!restaurantId) {
      setCategories([]);
      setLoading(false);
      return;
    }
    try {
      const res = await getCategories(restaurantId);
      setCategories(res.data || []);
    } catch (err: any) {
      console.error("useCategories: failed to load", err.message);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    setLoading(true);
    load();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [load]);

  const createCategory = useCallback(
    async (data: CategoryFormData) => {
      if (!restaurantId) throw new Error("No restaurant selected");
      await apiCreate(data, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  const updateCategory = useCallback(
    async (id: string, data: CategoryFormData) => {
      await apiUpdate(id, data, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  const toggleCategoryActive = useCallback(
    async (category: Category) => {
      await apiToggle(category.id, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  const deleteCategory = useCallback(
    async (id: string) => {
      await apiDelete(id, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  return {
    categories,
    loading,
    restaurantId,
    createCategory,
    updateCategory,
    toggleCategoryActive,
    deleteCategory,
  };
}
