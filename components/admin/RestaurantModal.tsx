"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Restaurant } from "@/lib/types";
import { type RestaurantFormData } from "@/lib/hooks/useRestaurants";

interface RestaurantModalProps {
  restaurant: Restaurant | null; // null = create mode, non-null = edit mode
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
}

export function RestaurantModal({
  restaurant,
  onClose,
  onSubmit,
}: RestaurantModalProps) {
  const isEditing = restaurant !== null;

  const [formData, setFormData] = useState<RestaurantFormData>({
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",
    momoNumber: restaurant?.momo_number || "",
    momoName: restaurant?.momo_name || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set =
    (field: keyof RestaurantFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(
        err.message ||
          `Failed to ${isEditing ? "update" : "create"} restaurant`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Restaurant" : "Add New Restaurant"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={set("name")}
              className="input"
              placeholder="Amazing Restaurant"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={set("phone")}
              className="input"
              placeholder="+233501234567"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={set("description")}
            className="input"
            rows={3}
            placeholder="Brief description of the restaurant..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={set("email")}
            className="input"
            placeholder="contact@restaurant.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              MoMo Number *
            </label>
            <input
              type="tel"
              value={formData.momoNumber}
              onChange={set("momoNumber")}
              className="input"
              placeholder="0501234567"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              MoMo Name *
            </label>
            <input
              type="text"
              value={formData.momoName}
              onChange={set("momoName")}
              className="input"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

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
            {loading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Restaurant"
                : "Create Restaurant"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
