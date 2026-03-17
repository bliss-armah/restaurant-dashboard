"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMenuItems,
  getCategories,
  createMenuItem as apiCreate,
  updateMenuItem as apiUpdate,
  toggleMenuItemAvailable as apiToggle,
  deleteMenuItem as apiDelete,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { MenuItem, MenuItemFormData, Category } from "@/lib/types";

export function useMenuItems(restaurantIdOverride?: string) {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const restaurantId = restaurantIdOverride ?? user?.restaurantId ?? undefined;

  const load = useCallback(async () => {
    if (!restaurantId) {
      setMenuItems([]);
      setCategories([]);
      setLoading(false);
      return;
    }
    try {
      const [itemsRes, catsRes] = await Promise.all([
        getMenuItems(restaurantId),
        getCategories(restaurantId),
      ]);
      setMenuItems(itemsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err: any) {
      console.error("useMenuItems: failed to load", err.message);
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

  const createMenuItem = useCallback(
    async (data: MenuItemFormData) => {
      await apiCreate(data, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  const updateMenuItem = useCallback(
    async (id: string, data: MenuItemFormData) => {
      await apiUpdate(id, data, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  const toggleItemAvailable = useCallback(
    async (item: MenuItem) => {
      await apiToggle(item.id, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  const deleteMenuItem = useCallback(
    async (id: string) => {
      await apiDelete(id, restaurantId);
      await load();
    },
    [load, restaurantId],
  );

  return {
    menuItems,
    categories,
    loading,
    restaurantId,
    createMenuItem,
    updateMenuItem,
    toggleItemAvailable,
    deleteMenuItem,
  };
}
