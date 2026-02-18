"use client";

import {
  Building2,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";
import { useAdminGuard } from "@/lib/hooks/useAdminGuard";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuickActions, RecentActivity } from "@/components/admin/QuickActions";

export default function SuperAdminDashboardPage() {
  const { isReady, loading: authLoading } = useAdminGuard();
  const { stats, loading: statsLoading } = useDashboardStats(isReady);

  if (authLoading || statsLoading || !stats) return <LoadingSpinner />;
  if (!isReady) return null;

  return (
    <div className="p-8">
      <PageHeader
        title="Super Admin Dashboard"
        subtitle="Platform overview and analytics"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Building2}
          label="Total Restaurants"
          value={stats.totalRestaurants}
          subLabel={`${stats.activeRestaurants} active`}
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          subLabel="Restaurant admins"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.totalOrders}
          subLabel="All time"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`GH₵ ${stats.totalRevenue.toFixed(2)}`}
          subLabel="From paid orders"
        />
        <StatCard
          icon={TrendingUp}
          label="Growth Rate"
          value="+0%"
          subLabel="This month"
        />
        <StatCard
          icon={Activity}
          label="Platform Status"
          value="Healthy"
          subLabel="All systems operational"
          iconBgColor="bg-green-600"
        />
      </div>

      <div className="mb-8">
        <QuickActions />
      </div>

      <RecentActivity />
    </div>
  );
}
