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
import { EditRoleModal } from "@/components/admin/EditRoleModal";
import { User } from "@/lib/types";

export default function SuperAdminUsersPage() {
  const { isReady, loading: authLoading } = useAdminGuard();
  const { users, restaurants, loading, createUser, updateUserRole } =
    useUsers(isReady);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (authLoading || loading) return <LoadingSpinner />;
  if (!isReady) return null;

  const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const restaurantAdmins = users.filter(
    (u) => u.role === "RESTAURANT_ADMIN",
  ).length;

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage restaurant admins and super admins"
        action={
          <button
            onClick={() => setShowCreateModal(true)}
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

      <UserTable users={users} onEditRole={(user) => setEditingUser(user)} />

      {showCreateModal && (
        <UserModal
          restaurants={restaurants}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            await createUser(data);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingUser && (
        <EditRoleModal
          user={editingUser}
          restaurants={restaurants}
          onClose={() => setEditingUser(null)}
          onSubmit={async (userId, role, restaurantId) => {
            await updateUserRole(userId, role, restaurantId);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}
