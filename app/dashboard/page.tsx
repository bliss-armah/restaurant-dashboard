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
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              className="animate-pulse h-32 bg-muted/40 border border-border/50 rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
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
      <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/dashboard/categories"
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <FolderOpen className="w-5 h-5" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Manage Categories
              </span>
            </a>
            <a
              href="/dashboard/menu-items"
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Manage Menu
              </span>
            </a>
            <a
              href="/dashboard/orders"
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 hover:border-primary/30 transition-all group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                View Orders
              </span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders — Restaurant Admin only */}
      {isRestaurantAdmin && (
        <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-10 rounded-xl bg-muted/20 border border-dashed border-border mt-2">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground font-medium">
                  No orders yet — orders will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 pr-2 hover:bg-muted/10 transition-colors rounded-lg px-2 -mx-2"
                  >
                    <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          #{order.order_number}
                          <span className="ml-2 text-muted-foreground font-medium">
                            · {order.customer?.name || order.customer?.phone}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                          {new Date(order.created_at).toLocaleString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 ml-12 sm:ml-0">
                      <p className="text-base font-bold text-foreground">
                        GHS {order.total_amount.toFixed(2)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity — Super Admin only */}
      {isSuperAdmin && (
        <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 rounded-xl bg-muted/20 border border-dashed border-border mt-2">
              <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium">
                Recent system activity will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
