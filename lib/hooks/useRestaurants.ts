"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Restaurant } from "@/lib/types";

export type RestaurantFormData = {
  name: string;
  description: string;
  phone: string;
  email: string;
  momoNumber: string;
  momoName: string;
};

export function useRestaurants(enabled: boolean) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    reload();
  }, [enabled]);

  const reload = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error: any) {
      console.error("Error loading restaurants:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createRestaurant = async (formData: RestaurantFormData) => {
    const { error } = await supabase.from("restaurants").insert({
      name: formData.name,
      description: formData.description || null,
      phone: formData.phone,
      email: formData.email || null,
      momo_number: formData.momoNumber,
      momo_name: formData.momoName,
      is_active: true,
      subscription_status: "TRIAL",
      trial_ends_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    });

    if (error) throw error;
    await reload();
  };

  const updateRestaurant = async (id: string, formData: RestaurantFormData) => {
    const { error } = await supabase
      .from("restaurants")
      .update({
        name: formData.name,
        description: formData.description || null,
        phone: formData.phone,
        email: formData.email || null,
        momo_number: formData.momoNumber,
        momo_name: formData.momoName,
      })
      .eq("id", id);

    if (error) throw error;
    await reload();
  };

  return { restaurants, loading, reload, createRestaurant, updateRestaurant };
}
