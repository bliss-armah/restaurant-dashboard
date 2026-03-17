"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getRestaurants,
  createRestaurant as apiCreate,
  updateRestaurant as apiUpdate,
  setRestaurantOpenStatus,
} from "@/lib/api";
import { Restaurant } from "@/lib/types";

export type RestaurantFormData = {
  name: string;
  description?: string;
  phone: string;
  email?: string;
  momoNumber: string;
  momoName: string;
};

export function useRestaurants(enabled: boolean) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRestaurants();
      setRestaurants(res.data || []);
    } catch (err: any) {
      console.error("useRestaurants: failed to load", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reload();
  }, [enabled, reload]);

  const createRestaurant = useCallback(
    async (formData: RestaurantFormData) => {
      await apiCreate({
        name: formData.name,
        description: formData.description || null,
        phone: formData.phone,
        email: formData.email || null,
        momoNumber: formData.momoNumber,
        momoName: formData.momoName,
      });
      await reload();
    },
    [reload],
  );

  const updateRestaurant = useCallback(
    async (id: string, formData: RestaurantFormData) => {
      await apiUpdate(id, {
        name: formData.name,
        description: formData.description || null,
        phone: formData.phone,
        email: formData.email || null,
        momoNumber: formData.momoNumber,
        momoName: formData.momoName,
      });
      await reload();
    },
    [reload],
  );

  const toggleOpenStatus = useCallback(
    async (id: string, isOpen: boolean) => {
      await setRestaurantOpenStatus(id, isOpen);
      await reload();
    },
    [reload],
  );

  return { restaurants, loading, reload, createRestaurant, updateRestaurant, toggleOpenStatus };
}
