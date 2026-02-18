"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Restaurant } from "@/lib/types";

export function useUsers(enabled: boolean) {
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    reload();
  }, [enabled]);

  const reload = async () => {
    setLoading(true);
    try {
      const [
        { data: usersData, error: usersError },
        { data: restaurantsData, error: restaurantsError },
      ] = await Promise.all([
        supabase
          .from("users")
          .select("*, restaurant:restaurants(id, name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("restaurants")
          .select("*")
          .eq("is_active", true)
          .order("name"),
      ]);

      if (usersError) throw usersError;
      if (restaurantsError) throw restaurantsError;

      setUsers(usersData || []);
      setRestaurants(restaurantsData || []);
    } catch (error: any) {
      console.error("Error loading users data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
    restaurantId: string;
  }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const response = await fetch(`${apiUrl}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to create user");

    await reload();
    return result;
  };

  return { users, restaurants, loading, reload, createUser };
}
