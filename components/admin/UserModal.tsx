"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Restaurant } from "@/lib/types";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
  restaurantId: string;
}

interface UserModalProps {
  restaurants: Restaurant[];
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserModal({ restaurants, onClose, onSubmit }: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "RESTAURANT_ADMIN",
    restaurantId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set =
    (field: keyof UserFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
            minLength={8}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
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
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
