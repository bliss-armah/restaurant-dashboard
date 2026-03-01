"use client";

import { useState } from "react";
import { Plus, Edit2, UtensilsCrossed } from "lucide-react";
import { useMenuItems } from "@/lib/hooks/useMenuItems";
import { useAuth } from "@/lib/auth-context";
import { formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MenuItemModal } from "@/components/dashboard/MenuItemModal";
import { RestaurantSelector } from "@/components/ui/RestaurantSelector";
import type { MenuItem } from "@/lib/types";

export default function MenuItemsPage() {
  const { isSuperAdmin } = useAuth();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const {
    menuItems,
    categories,
    loading,
    createMenuItem,
    updateMenuItem,
    toggleItemAvailable,
  } = useMenuItems(selectedRestaurantId || undefined);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };
  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (data: Parameters<typeof createMenuItem>[0]) => {
    if (editingItem) await updateMenuItem(editingItem.id, data);
    else await createMenuItem(data);
    closeModal();
  };

  const canCreate = !isSuperAdmin || !!selectedRestaurantId;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Menu Items"
        subtitle="Manage your restaurant menu • Real-time ⚡"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <RestaurantSelector
              value={selectedRestaurantId}
              onChange={setSelectedRestaurantId}
            />
            {canCreate && (
              <button onClick={openCreate} className="btn btn-primary">
                <Plus className="w-5 h-5" /> Add Item
              </button>
            )}
          </div>
        }
      />

      {isSuperAdmin && !selectedRestaurantId ? (
        <div className="card text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Select a restaurant
          </h3>
          <p className="text-gray-400">
            Choose a restaurant above to view and manage its menu items.
          </p>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : menuItems.length === 0 ? (
        <div className="card text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No menu items yet
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first menu item to get started
          </p>
          {canCreate && (
            <button onClick={openCreate} className="btn btn-primary mx-auto">
              <Plus className="w-5 h-5" /> Add Menu Item
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td>
                    <div className="font-semibold text-black">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-400 mt-1">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {item.category?.name || "N/A"}
                    </span>
                  </td>
                  <td className="font-semibold">{formatPrice(item.price)}</td>
                  <td>
                    <button
                      onClick={() => toggleItemAvailable(item)}
                      className={`badge ${item.is_available ? "badge-success" : "badge-warning"}`}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => openEdit(item)}
                      className="btn btn-ghost p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <MenuItemModal
          categories={categories}
          title={editingItem ? "Edit Menu Item" : "Create Menu Item"}
          initialData={
            editingItem
              ? {
                  name: editingItem.name,
                  description: editingItem.description || "",
                  price: editingItem.price.toString(),
                  category_id: editingItem.category_id,
                  image_url: editingItem.image_url || "",
                  sort_order: editingItem.sort_order,
                }
              : undefined
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
