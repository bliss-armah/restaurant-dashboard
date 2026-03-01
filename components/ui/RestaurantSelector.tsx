"use client";

import { Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRestaurants } from "@/lib/hooks/useRestaurants";

interface RestaurantSelectorProps {
  value: string;
  onChange: (restaurantId: string) => void;
  className?: string;
}

/**
 * A dropdown that lets a SUPER_ADMIN pick which restaurant to view.
 * Renders nothing for regular restaurant admins.
 */
export function RestaurantSelector({
  value,
  onChange,
  className = "",
}: RestaurantSelectorProps) {
  const { isSuperAdmin } = useAuth();
  const { restaurants, loading } = useRestaurants(isSuperAdmin);

  if (!isSuperAdmin) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input py-2 text-sm min-w-[200px]"
        disabled={loading}
      >
        <option value="">
          {loading ? "Loading restaurants…" : "Select a restaurant…"}
        </option>
        {restaurants.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}
