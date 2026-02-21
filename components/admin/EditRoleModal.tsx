"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { User, Restaurant } from "@/lib/types";

interface EditRoleModalProps {
  user: User;
  restaurants: Restaurant[];
  onClose: () => void;
  onSubmit: (
    userId: string,
    role: "SUPER_ADMIN" | "RESTAURANT_ADMIN",
    restaurantId?: string,
  ) => Promise<void>;
}

export function EditRoleModal({
  user,
  restaurants,
  onClose,
  onSubmit,
}: EditRoleModalProps) {
  const [role, setRole] = useState<"SUPER_ADMIN" | "RESTAURANT_ADMIN">(
    user.role as "SUPER_ADMIN" | "RESTAURANT_ADMIN",
  );
  const [restaurantId, setRestaurantId] = useState<string>(
    user.restaurant_id ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(user.id, role, restaurantId || undefined);
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Edit Role — ${user.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Role *</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "SUPER_ADMIN" | "RESTAURANT_ADMIN")
            }
            className="input"
          >
            <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {role === "RESTAURANT_ADMIN" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Restaurant *
            </label>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="input"
              required
            >
              <option value="">Select restaurant...</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
