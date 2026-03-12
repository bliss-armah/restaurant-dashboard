"use client";

import { useState } from "react";
import { Building2, Users, TrendingUp, Plus } from "lucide-react";
import { useAdminGuard } from "@/lib/hooks/useAdminGuard";
import { useRestaurants } from "@/lib/hooks/useRestaurants";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { RestaurantTable } from "@/components/admin/RestaurantTable";
import { RestaurantModal } from "@/components/admin/RestaurantModal";
import { Button } from "@/components/ui/button";
import { type Restaurant } from "@/lib/types";

export default function SuperAdminRestaurantsPage() {
  const { isReady, loading: authLoading } = useAdminGuard();
  const { restaurants, loading, createRestaurant, updateRestaurant } =
    useRestaurants(isReady);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  if (authLoading || loading) return <LoadingSpinner />;
  if (!isReady) return null;

  const thisMonth = restaurants.filter((r) => {
    const d = new Date(r.created_at);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleSubmit = async (
    formData: Parameters<typeof createRestaurant>[0],
  ) => {
    if (editingRestaurant) {
      await updateRestaurant(editingRestaurant.id, formData);
    } else {
      await createRestaurant(formData);
    }
    handleClose();
  };

  return (
    <div>
      <PageHeader
        title="Restaurants"
        subtitle="Manage all restaurants on the platform"
        action={
          <Button
            onClick={() => setShowModal(true)}
            className="font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Restaurant
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Building2}
          label="Total Restaurants"
          value={restaurants.length}
        />
        <StatCard
          icon={Users}
          label="Active"
          value={restaurants.filter((r) => r.is_active).length}
        />
        <StatCard icon={TrendingUp} label="This Month" value={thisMonth} />
      </div>

      <RestaurantTable
        restaurants={restaurants}
        onEdit={handleEdit}
        onAdd={() => setShowModal(true)}
      />

      {showModal && (
        <RestaurantModal
          restaurant={editingRestaurant}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
