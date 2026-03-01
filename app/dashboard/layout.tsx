"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Users,
  Shield,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const restaurantNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
  { name: "Menu Items", href: "/dashboard/menu-items", icon: UtensilsCrossed },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const superAdminNavigation = [
  { name: "Overview", href: "/dashboard/admin", icon: Shield },
  {
    name: "Restaurants",
    href: "/dashboard/admin/restaurants",
    icon: Building2,
  },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isSuperAdmin, signOut } = useAuth();

  const navigation = isSuperAdmin ? superAdminNavigation : restaurantNavigation;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-black text-white transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-bold">
                {isSuperAdmin ? "Super Admin" : "Restaurant Admin"}
              </h2>
              {isSuperAdmin && (
                <p className="text-xs text-gray-400">Platform Manager</p>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-white text-black font-semibold"
                        : "text-white hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Separator for super admin */}
            {isSuperAdmin && (
              <>
                <div className="my-4 border-t border-gray-800" />
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Restaurant View
                  </p>
                </div>
                {restaurantNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${
                          isActive
                            ? "bg-white text-black font-semibold"
                            : "text-white hover:bg-gray-800"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium truncate">
                {user?.name || user?.email || user?.phone}
              </p>
              <p className="text-xs text-gray-400">
                {isSuperAdmin ? "Super Admin" : "Restaurant Admin"}
              </p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn-ghost p-2"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {isSuperAdmin && (
                <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                  Super Admin
                </div>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-black">
                  {user?.name || user?.email || user?.phone}
                </p>
                <p className="text-xs text-gray-600">Supabase Auth</p>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
