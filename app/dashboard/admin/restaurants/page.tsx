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
  isActive: boolean;
  subscriptionStatus: string;
  createdAt: string;
  _count?: { users: number; orders: number };
}

export default function SuperAdminRestaurantsPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
        .order("createdAt", { ascending: false });

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error: any) {
      console.error("Error loading restaurants:", error.message);
    } finally {
      setLoading(false);
    }
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
            onClick={() => setShowCreateModal(true)}
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
                {restaurants.filter((r) => r.isActive).length}
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
                    const created = new Date(r.createdAt);
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
                      restaurant.isActive ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {restaurant.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <span className="badge badge-info">
                    {restaurant.subscriptionStatus}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/admin/restaurants/${restaurant.id}`,
                        )
                      }
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
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary mt-4"
            >
              <Plus className="w-5 h-5" />
              Add First Restaurant
            </button>
          </div>
        )}
      </div>

      {/* Create Restaurant Modal */}
      {showCreateModal && (
        <CreateRestaurantModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadRestaurants();
          }}
        />
      )}
    </div>
  );
}

// Create Restaurant Modal Component
function CreateRestaurantModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    momoNumber: "",
    momoName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("restaurants").insert({
        name: formData.name,
        description: formData.description || null,
        phone: formData.phone,
        email: formData.email || null,
        momo_number: formData.momoNumber,
        momo_name: formData.momoName,
        is_active: true,
        subscription_status: "TRIAL",
        trial_ends_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 30 days trial
      });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold">Add New Restaurant</h2>
        </div>

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

          <div className="flex gap-3 pt-4">
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
              {loading ? "Creating..." : "Create Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
