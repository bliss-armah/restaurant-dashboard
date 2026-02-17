"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  phone: string;
  email: string | null;
  momo_number: string;
  momo_name: string;
  is_active: boolean;
  subscription_status: string;
  created_at: string;
  _count?: { users: number; orders: number };
}

export default function SuperAdminRestaurantsPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null,
  );

  // Redirect if not super admin
  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      router.push("/dashboard");
    }
  }, [authLoading, isSuperAdmin, router]);

  // Load restaurants
  useEffect(() => {
    if (isSuperAdmin) {
      loadRestaurants();
    }
  }, [isSuperAdmin]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error: any) {
      console.error("Error loading restaurants:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditingRestaurant(null);
    loadRestaurants();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Restaurants</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Restaurant
          </button>
        </div>
        <p className="text-gray-600">Manage all restaurants on the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Restaurants</p>
              <p className="text-2xl font-bold">{restaurants.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold">
                {restaurants.filter((r) => r.is_active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">
                {
                  restaurants.filter((r) => {
                    const created = new Date(r.created_at);
                    const now = new Date();
                    return (
                      created.getMonth() === now.getMonth() &&
                      created.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Subscription</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td>
                  <div>
                    <div className="font-semibold">{restaurant.name}</div>
                    {restaurant.description && (
                      <div className="text-sm text-gray-600 truncate max-w-xs">
                        {restaurant.description}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div>{restaurant.phone}</div>
                    {restaurant.email && (
                      <div className="text-gray-600">{restaurant.email}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      restaurant.is_active ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {restaurant.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info">
                    {restaurant.subscription_status}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {new Date(restaurant.created_at).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="btn-ghost p-2"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="btn-ghost p-2 text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {restaurants.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No restaurants yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary mt-4"
            >
              <Plus className="w-5 h-5" />
              Add First Restaurant
            </button>
          </div>
        )}
      </div>

      {/* Restaurant Modal (Create/Edit) */}
      {showModal && (
        <RestaurantModal
          restaurant={editingRestaurant}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// Restaurant Modal Component (Create & Edit)
function RestaurantModal({
  restaurant,
  onClose,
  onSuccess,
}: {
  restaurant: Restaurant | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEditing = restaurant !== null;

  const [formData, setFormData] = useState({
    name: restaurant?.name || "",
    description: restaurant?.description || "",
    phone: restaurant?.phone || "",
    email: restaurant?.email || "",
    momoNumber: restaurant?.momo_number || "",
    momoName: restaurant?.momo_name || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        phone: formData.phone,
        email: formData.email || null,
        momo_number: formData.momoNumber,
        momo_name: formData.momoName,
      };

      if (isEditing) {
        // Update existing restaurant
        const { error: updateError } = await supabase
          .from("restaurants")
          .update(payload)
          .eq("id", restaurant.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("restaurants")
          .insert({
            ...payload,
            is_active: true,
            subscription_status: "TRIAL",
            trial_ends_at: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          });

        if (insertError) throw insertError;
      }

      onSuccess();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassmorphic Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Modal */}
      <div
        className="relative bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50"
        style={{
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-6 border-b-2 border-gray-200/50 z-10">
          <h2 className="text-2xl font-bold">
            {isEditing ? "Edit Restaurant" : "Add New Restaurant"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input"
                placeholder="+233501234567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
                onChange={(e) =>
                  setFormData({ ...formData, momoNumber: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, momoName: e.target.value })
                }
                className="input"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-xl pb-2">
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
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
