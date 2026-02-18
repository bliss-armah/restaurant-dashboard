"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Restaurant } from "@/lib/types";

interface UserModalProps {
  restaurants: Restaurant[];
  onClose: () => void;
}

export function UserModal({ restaurants, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "RESTAURANT_ADMIN" as "SUPER_ADMIN" | "RESTAURANT_ADMIN",
    restaurantId: "",
  });

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "⚠️ User creation via API requires admin privileges.\n\nPlease create users in Supabase Dashboard:\n1. Go to Authentication > Users\n2. Add user with the above details\n3. Set user_metadata as shown",
    );
    console.log("User details to create:", formData);
    onClose();
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={set("name")}
            className="input"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={set("email")}
              className="input"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={set("phone")}
              className="input"
              placeholder="+233501234567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={set("password")}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role *</label>
          <select
            value={formData.role}
            onChange={set("role")}
            className="input"
          >
            <option value="RESTAURANT_ADMIN">Restaurant Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {formData.role === "RESTAURANT_ADMIN" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Restaurant *
            </label>
            <select
              value={formData.restaurantId}
              onChange={set("restaurantId")}
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-1">
            📋 Manual Creation Required
          </p>
          <p className="text-xs text-blue-600">
            User creation via dashboard requires Supabase Admin API. Create
            users in Supabase Dashboard with the details above.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            Show Instructions
          </button>
        </div>
      </form>
    </Modal>
  );
}
