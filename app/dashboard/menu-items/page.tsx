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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        <Card className="overflow-hidden border-border/60 shadow-sm bg-card animate-in fade-in slide-in-from-bottom-2 duration-500">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold px-6 h-12">
                      Item
                    </TableHead>
                    <TableHead className="font-semibold px-6">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold px-6">Price</TableHead>
                    <TableHead className="font-semibold px-6">Status</TableHead>
                    <TableHead className="font-semibold px-6 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {item.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="font-medium bg-muted text-muted-foreground border-transparent"
                        >
                          {item.category?.name || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-bold tracking-tight">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Button
                          variant={item.is_available ? "default" : "secondary"}
                          size="sm"
                          className={`rounded-full text-xs h-7 px-4 font-semibold shadow-none ${item.is_available ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                          onClick={() => toggleItemAvailable(item)}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </Button>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => openEdit(item)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
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
