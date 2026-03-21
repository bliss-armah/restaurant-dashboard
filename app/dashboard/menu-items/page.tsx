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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
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

  const columns: ColumnDef<MenuItem>[] = [
    {
      header: "Item",
      cell: (item) => (
        <div>
          <div className="font-semibold text-foreground">{item.name}</div>
          {item.description && (
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {item.description}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Category",
      cell: (item) => (
        <Badge
          variant="secondary"
          className="font-medium bg-muted text-muted-foreground border-transparent"
        >
          {item.category?.name ?? "N/A"}
        </Badge>
      ),
    },
    {
      header: "Price",
      cell: (item) => (
        <span className="font-bold tracking-tight">
          {formatPrice(item.price)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (item) => (
        <Button
          variant={item.isAvailable ? "default" : "secondary"}
          size="sm"
          className={`rounded-full text-xs h-7 px-4 font-semibold shadow-none ${
            item.isAvailable ? "bg-green-500 hover:bg-green-600 text-white" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleItemAvailable(item);
          }}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </Button>
      ),
    },
    {
      header: "Actions",
      align: "right",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            openEdit(item);
          }}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

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
              <Button onClick={openCreate}>
                <Plus className="w-5 h-5" /> Add Item
              </Button>
            )}
          </div>
        }
      />

      {isSuperAdmin && !selectedRestaurantId ? (
        <Card className="border-dashed bg-muted/30 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <UtensilsCrossed className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Select a restaurant
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Choose a restaurant above to view and manage its menu items.
            </p>
          </CardContent>
        </Card>
      ) : loading ? (
        <LoadingSpinner />
      ) : menuItems.length === 0 ? (
        <Card className="border-dashed bg-muted/30 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <UtensilsCrossed className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No menu items yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Create your first menu item to get started
            </p>
            {canCreate && (
              <Button
                onClick={openCreate}
                size="lg"
                className="rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 mr-2" /> Add Menu Item
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          rows={menuItems}
          keyExtractor={(item) => item.id}
        />
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
                  categoryId: editingItem.categoryId,
                  imageUrl: editingItem.imageUrl || "",
                  sortOrder: editingItem.sortOrder,
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
