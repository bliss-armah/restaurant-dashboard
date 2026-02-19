"use client";

import { useState } from "react";
import { Plus, Edit2, FolderOpen } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryModal } from "@/components/dashboard/CategoryModal";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    createCategory,
    updateCategory,
    toggleCategoryActive,
  } = useCategories();
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Categories"
        subtitle="Organize your menu • Real-time updates ⚡"
        action={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-5 h-5" /> Add Category
          </button>
        }
      />

      {categories.length === 0 ? (
        <div className="card text-center py-12">
          <FolderOpen className="w-16 h-16 text-black-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No categories yet
          </h3>
          <p className="text-black-400 mb-6">
            Get started by creating your first category
          </p>
          <button onClick={openCreate} className="btn btn-primary mx-auto">
            <Plus className="w-5 h-5" /> Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-black-400 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => openEdit(category)}
                  className="btn btn-ghost p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t-2 border-black-200">
                <span className="text-xs text-black-400">
                  Order: {category.sort_order}
                </span>
                <button
                  onClick={() => toggleCategoryActive(category)}
                  className={`badge ${category.is_active ? "badge-success" : "badge-warning"}`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
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
                  sort_order: editingCategory.sort_order,
                }
              : { name: "", description: "", sort_order: categories.length }
          }
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
