"use client";

import { Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRestaurants } from "@/lib/hooks/useRestaurants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RestaurantSelectorProps {
  value: string;
  onChange: (restaurantId: string) => void;
  className?: string;
}

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
      <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue
            placeholder={loading ? "Loading…" : "Select a restaurant…"}
          />
        </SelectTrigger>
        <SelectContent>
          {restaurants.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
