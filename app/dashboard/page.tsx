import {
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  FolderOpen,
  UtensilsCrossed,
} from "lucide-react";

// This would normally fetch from API using server component
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
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      change: "+12% from last month",
    },
    {
      title: "Revenue",
      value: `GHS ${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+23% from last month",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      change: "+8% from last month",
    },
    {
      title: "Avg Order Value",
      value: `GHS ${stats.avgOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      change: "+5% from last month",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-black-400 mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-black-400 font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-black mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-black-400 mt-2">{stat.change}</p>
                </div>
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
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

      {/* Recent Activity Placeholder */}
      <div className="card">
        <h2 className="text-xl font-bold text-black mb-4">Recent Activity</h2>
        <p className="text-black-400 text-center py-8">
          Recent orders and activities will appear here
        </p>
      </div>
    </div>
  );
}
