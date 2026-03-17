"use client";

import { useState } from "react";
import { Plus, Edit2, FolderOpen } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryModal } from "@/components/dashboard/CategoryModal";
import { RestaurantSelector } from "@/components/ui/RestaurantSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const { isSuperAdmin } = useAuth();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    toggleCategoryActive,
  } = useCategories(selectedRestaurantId || undefined);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };
  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (data: Parameters<typeof createCategory>[0]) => {
    if (editingCategory) await updateCategory(editingCategory.id, data);
    else await createCategory(data);
    closeModal();
  };

  // Super admin must pick a restaurant first before creating items
  const canCreate = !isSuperAdmin || !!selectedRestaurantId;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Categories"
        subtitle="Organize your menu • Real-time updates ⚡"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <RestaurantSelector
              value={selectedRestaurantId}
              onChange={setSelectedRestaurantId}
            />
            {canCreate && (
              <Button onClick={openCreate}>
                <Plus className="w-5 h-5" /> Add Category
              </Button>
            )}
          </div>
        }
      />

      {isSuperAdmin && !selectedRestaurantId ? (
        <Card className="border-dashed bg-muted/30 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Select a restaurant
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Choose a restaurant above to view and manage its categories.
            </p>
          </CardContent>
        </Card>
      ) : loading ? (
        <LoadingSpinner />
      ) : categories.length === 0 ? (
        <Card className="border-dashed bg-muted/30 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No categories yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Get started by creating your first category to organize your menu
              items.
            </p>
            {canCreate && (
              <Button
                onClick={openCreate}
                size="lg"
                className="rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 mr-2" /> Create Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1 bg-card border-border/60"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => openEdit(category)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                    Order: {category.sortOrder}
                  </span>
                  <Button
                    variant={category.isActive ? "default" : "secondary"}
                    size="sm"
                    className={`rounded-full text-xs h-7 px-4 font-semibold shadow-none ${category.isActive ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                    onClick={() => toggleCategoryActive(category)}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <CategoryModal
          title={editingCategory ? "Edit Category" : "Create Category"}
          initialData={
            editingCategory
              ? {
                  name: editingCategory.name,
                  description: editingCategory.description || "",
                  sortOrder: editingCategory.sortOrder,
                }
              : { name: "", description: "", sortOrder: categories.length }
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
