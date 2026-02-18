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

  return { users, restaurants, loading, reload };
}
