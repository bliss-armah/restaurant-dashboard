"use client";

import { useState } from "react";
import { Users, Shield, Building2, Plus } from "lucide-react";
import { useAdminGuard } from "@/lib/hooks/useAdminGuard";
import { useUsers } from "@/lib/hooks/useUsers";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { UserTable } from "@/components/admin/UserTable";
import { UserModal } from "@/components/admin/UserModal";

export default function SuperAdminUsersPage() {
  const { isReady, loading: authLoading } = useAdminGuard();
  const { users, restaurants, loading, createUser } = useUsers(isReady);
  const [showModal, setShowModal] = useState(false);

  if (authLoading || loading) return <LoadingSpinner />;
  if (!isReady) return null;

  const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const restaurantAdmins = users.filter(
    (u) => u.role === "RESTAURANT_ADMIN",
  ).length;

  return (
    <div className="p-8">
      <PageHeader
        title="User Management"
        subtitle="Manage restaurant admins and super admins"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} label="Total Users" value={users.length} />
        <StatCard icon={Shield} label="Super Admins" value={superAdmins} />
        <StatCard
          icon={Building2}
          label="Restaurant Admins"
          value={restaurantAdmins}
        />
      </div>

      <UserTable users={users} />

      {showModal && (
        <UserModal
          restaurants={restaurants}
          onClose={() => setShowModal(false)}
          onSubmit={async (data) => {
            await createUser(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
