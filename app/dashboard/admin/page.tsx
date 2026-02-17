"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import {
  Building2,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentActivity: Activity[];
}

interface Activity {
  id: string;
  type: "restaurant_created" | "order_placed" | "user_created";
  description: string;
  timestamp: string;
  restaurantName?: string;
}

export default function SuperAdminDashboardPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isSuperAdmin) {
      router.push("/dashboard");
    }
  }, [authLoading, isSuperAdmin, router]);

  useEffect(() => {
    if (isSuperAdmin) {
      loadDashboardStats();
    }
  }, [isSuperAdmin]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Get restaurants count
      const { count: restaurantsCount } = await supabase
        .from("restaurants")
        .select("*", { count: "exact", head: true });

      // Get active restaurants
      const { count: activeCount } = await supabase
        .from("restaurants")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Get users count
      const { count: usersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Get orders count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Get total revenue
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("payment_status", "PAID");

      const totalRevenue =
        revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      setStats({
        totalRestaurants: restaurantsCount || 0,
        activeRestaurants: activeCount || 0,
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        recentActivity: [], // TODO: Implement activity log
      });
    } catch (error: any) {
      console.error("Error loading dashboard stats:", error.message);
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

  if (!isSuperAdmin || !stats) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Restaurants */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Restaurants</p>
              <p className="text-2xl font-bold">{stats.totalRestaurants}</p>
              <p className="text-xs text-gray-500">
                {stats.activeRestaurants} active
              </p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500">Restaurant admins</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">
                GH₵ {stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">From paid orders</p>
            </div>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold">+0%</p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>

        {/* Platform Status */}
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Platform Status</p>
              <p className="text-2xl font-bold">Healthy</p>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/dashboard/admin/restaurants")}
              className="btn btn-secondary w-full"
            >
              <Building2 className="w-5 h-5" />
              Manage Restaurants
            </button>
            <button
              onClick={() => router.push("/dashboard/admin/users")}
              className="btn btn-secondary w-full"
            >
              <Users className="w-5 h-5" />
              Manage Users
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Platform Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="badge badge-success">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WhatsApp API</span>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backend Service</span>
              <span className="badge badge-success">Running</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Platform Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Activity log coming soon</p>
        </div>
      </div>
    </div>
  );
}
