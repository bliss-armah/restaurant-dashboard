"use client";

import { useEffect, useState, useCallback } from "react";
import { adminListUsers, adminCreateUser, adminUpdateUserRole, getRestaurants } from "@/lib/api";
import { User, Restaurant } from "@/lib/types";

export function useUsers(enabled: boolean) {
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, restaurantsRes] = await Promise.all([
        adminListUsers(),
        getRestaurants(),
      ]);
      setUsers(usersRes.data || []);
      setRestaurants((restaurantsRes.data || []).filter((r: Restaurant) => r.isActive));
    } catch (err: any) {
      console.error("useUsers: failed to load", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reload();
  }, [enabled, reload]);

  const createUser = useCallback(
    async (data: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
      restaurantId: string;
    }) => {
      const result = await adminCreateUser(data);
      await reload();
      return result;
    },
    [reload],
  );

  const updateUserRole = useCallback(
    async (userId: string, role: "SUPER_ADMIN" | "RESTAURANT_ADMIN", restaurantId?: string) => {
      const result = await adminUpdateUserRole(userId, role, restaurantId);
      await reload();
      return result;
    },
    [reload],
  );

  return { users, restaurants, loading, reload, createUser, updateUserRole };
}
