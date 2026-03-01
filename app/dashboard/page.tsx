"use client";

import {
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  FolderOpen,
  UtensilsCrossed,
  Store,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useAuth } from "@/lib/auth-context";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useRestaurantDashboardStats } from "@/lib/hooks/useRestaurantDashboardStats";

export default function DashboardPage() {
  const { user, isSuperAdmin, isRestaurantAdmin } = useAuth();

  const { stats: adminStats, loading: adminLoading } =
    useDashboardStats(isSuperAdmin);

  const {
    stats: restaurantStats,
    loading: restaurantLoading,
    recentOrders,
  } = useRestaurantDashboardStats(
    isRestaurantAdmin ? user?.restaurantId : undefined,
  );

  const loading = isSuperAdmin ? adminLoading : restaurantLoading;

  const superAdminCards = adminStats
    ? [
        {
          label: "Total Restaurants",
          value: adminStats.totalRestaurants,
          icon: Store,
          subLabel: `${adminStats.activeRestaurants} active`,
        },
        {
          label: "Total Users",
          value: adminStats.totalUsers,
          icon: Users,
          subLabel: "across all restaurants",
        },
        {
          label: "Total Orders",
          value: adminStats.totalOrders,
          icon: ShoppingBag,
          subLabel: "all time",
        },
        {
          label: "Total Revenue",
          value: `GHS ${adminStats.totalRevenue.toLocaleString("en-GH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: DollarSign,
          subLabel: "from paid orders",
        },
      ]
    : [];

  const restaurantAdminCards = restaurantStats
    ? [
        {
          label: "Total Orders",
          value: restaurantStats.totalOrders,
          icon: ShoppingBag,
          subLabel: `${restaurantStats.pendingOrders} pending`,
        },
        {
          label: "Revenue",
          value: `GHS ${restaurantStats.revenue.toLocaleString("en-GH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: DollarSign,
          subLabel: "from paid orders",
        },
        {
          label: "Avg Order Value",
          value: `GHS ${restaurantStats.avgOrderValue.toLocaleString("en-GH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: TrendingUp,
          subLabel: "per paid order",
        },
        {
          label: "Menu Items",
          value: restaurantStats.totalMenuItems,
          icon: UtensilsCrossed,
          subLabel: `${restaurantStats.totalCategories} categories`,
        },
      ]
    : [];

  const statCards = isSuperAdmin ? superAdminCards : restaurantAdminCards;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back ${user?.name ? `, ${user.name}` : ""}! Here's what's happening today.`}
      />

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="card animate-pulse h-28 bg-gray-100 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                subLabel={stat.subLabel}
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-black mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/dashboard/categories"
            className="btn btn-secondary justify-start text-left"
          >
            <FolderOpen className="w-5 h-5" />
            <span>Manage Categories</span>
          </a>
          <a
            href="/dashboard/menu-items"
            className="btn btn-secondary justify-start text-left"
          >
            <UtensilsCrossed className="w-5 h-5" />
            <span>Manage Menu</span>
          </a>
          <a
            href="/dashboard/orders"
            className="btn btn-secondary justify-start text-left"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>View Orders</span>
          </a>
        </div>
      </div>

      {/* Recent Orders — Restaurant Admin only */}
      {isRestaurantAdmin && (
        <div className="card">
          <h2 className="text-xl font-bold text-black mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No orders yet — orders will appear here in real time.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-black">
                        #{order.order_number}
                        <span className="ml-2 text-gray-500 font-normal">
                          · {order.customer?.name || order.customer?.phone}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">
                      GHS {order.total_amount.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity — Super Admin only */}
      {isSuperAdmin && (
        <div className="card">
          <h2 className="text-xl font-bold text-black mb-4">Recent Activity</h2>
          <p className="text-gray-400 text-center py-8">
            Recent system activity will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
