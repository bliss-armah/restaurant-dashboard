import {
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  FolderOpen,
  UtensilsCrossed,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

async function getDashboardStats() {
  // Placeholder data - in production this would fetch from API
  return {
    totalOrders: 142,
    revenue: 15240,
    customers: 89,
    avgOrderValue: 107.5,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      subLabel: "+12% from last month",
    },
    {
      label: "Revenue",
      value: `GHS ${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      subLabel: "+23% from last month",
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: Users,
      subLabel: "+8% from last month",
    },
    {
      label: "Avg Order Value",
      value: `GHS ${stats.avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      subLabel: "+5% from last month",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening today."
      />

      {/* Stats Grid */}
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

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-black mb-4">Recent Activity</h2>
        <p className="text-black-400 text-center py-8">
          Recent orders and activities will appear here
        </p>
      </div>
    </div>
  );
}
