"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Users, Plus, Mail, Phone, Building2, Shield } from "lucide-react";

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
  restaurantId: string | null;
  isActive: boolean;
  createdAt: string;
  restaurant?: {
    id: string;
    name: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
}

export default function SuperAdminUsersPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      router.push("/dashboard");
    }
  }, [authLoading, isSuperAdmin, router]);

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*, restaurant:restaurants(id, name)")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      // Load restaurants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from("restaurants")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (restaurantsError) throw restaurantsError;

      setUsers(usersData || []);
      setRestaurants(restaurantsData || []);
    } catch (error: any) {
      console.error("Error loading data:", error.message);
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
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">User Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
        <p className="text-gray-600">
          Manage restaurant admins and super admins
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === "SUPER_ADMIN").length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Restaurant Admins</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === "RESTAURANT_ADMIN").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Restaurant</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="font-semibold">{user.name}</div>
                </td>
                <td>
                  <div className="text-sm space-y-1">
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {user.email}
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.role === "SUPER_ADMIN"
                        ? "badge-danger"
                        : "badge-info"
                    }`}
                  >
                    {user.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : "Restaurant Admin"}
                  </span>
                </td>
                <td>
                  {user.restaurant ? (
                    <span className="text-sm">{user.restaurant.name}</span>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.isActive ? "badge-success" : "badge-warning"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          restaurants={restaurants}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

// Create User Modal
function CreateUserModal({
  restaurants,
  onClose,
  onSuccess,
}: {
  restaurants: Restaurant[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "RESTAURANT_ADMIN" as "SUPER_ADMIN" | "RESTAURANT_ADMIN",
    restaurantId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create user in Supabase Auth
      const authPayload: any = {
        password: formData.password,
        user_metadata: {
          role: formData.role,
          name: formData.name,
        },
      };

      if (formData.email) {
        authPayload.email = formData.email;
      } else if (formData.phone) {
        authPayload.phone = formData.phone;
        authPayload.user_metadata.phone = formData.phone;
      } else {
        throw new Error("Email or phone is required");
      }

      if (formData.role === "RESTAURANT_ADMIN" && formData.restaurantId) {
        authPayload.user_metadata.restaurantId = formData.restaurantId;
      }

      // Note: This requires admin privileges
      // You'll need to use Supabase Admin API or create the user via Dashboard
      alert(
        "⚠️ User creation via API requires admin privileges.\n\nPlease create users in Supabase Dashboard:\n1. Go to Authentication > Users\n2. Add user with the above details\n3. Set user_metadata as shown",
      );

      // For now, just show the instructions
      console.log("User details to create:", authPayload);

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold">Add New User</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role *</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as any,
                })
              }
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
                onChange={(e) =>
                  setFormData({ ...formData, restaurantId: e.target.value })
                }
                className="input"
                required
              >
                <option value="">Select restaurant...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              📋 Manual Creation Required
            </p>
            <p className="text-xs text-blue-600">
              User creation via dashboard requires Supabase Admin API. For now,
              create users in Supabase Dashboard with the details above.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
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
      </div>
    </div>
  );
}
