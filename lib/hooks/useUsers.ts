"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { User, Restaurant } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Returns the current Supabase session access token.
 * Used to authenticate calls to the backend admin routes.
 */
async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Not authenticated — no active session found.");
  }
  return session.access_token;
}

export function useUsers(enabled: boolean) {
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    reload();
  }, [enabled]);

  const reload = useCallback(async () => {
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
      console.error("useUsers: failed to load", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new platform user.
   * Calls POST /admin/users on the backend (service_role).
   * The backend creates the Supabase Auth identity and writes to user_roles.
   * Requires a valid Super Admin JWT — sent in Authorization header.
   */
  const createUser = useCallback(
    async (data: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
      restaurantId: string;
    }) => {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to create user");

      await reload();
      return result;
    },
    [reload],
  );

  /**
   * Updates an existing user's role and restaurant assignment.
   * Calls PATCH /admin/users/:id/role on the backend (service_role).
   * The backend updates both the user_roles table and the users profile table.
   * Requires a valid Super Admin JWT — sent in Authorization header.
   */
  const updateUserRole = useCallback(
    async (
      userId: string,
      role: "SUPER_ADMIN" | "RESTAURANT_ADMIN",
      restaurantId?: string,
    ) => {
      const token = await getAccessToken();
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, restaurantId }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to update role");

      await reload();
      return result;
    },
    [reload],
  );

  return { users, restaurants, loading, reload, createUser, updateUserRole };
}
