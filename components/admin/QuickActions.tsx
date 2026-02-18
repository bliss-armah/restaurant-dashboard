"use client";

import { useRouter } from "next/navigation";
import { Building2, Users, Activity } from "lucide-react";

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          {[
            { label: "Database", status: "Connected" },
            { label: "WhatsApp API", status: "Active" },
            { label: "Backend Service", status: "Running" },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <span className="badge badge-success">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecentActivity() {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Recent Platform Activity</h2>
      <div className="text-center py-8 text-gray-500">
        <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>Activity log coming soon</p>
      </div>
    </div>
  );
}
