"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, FolderOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CategoryModal } from "@/components/dashboard/CategoryModal";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  restaurant_id: string;
  created_at: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  sort_order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
    const sub = supabase
      .channel("categories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        loadCategories,
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, [loadCategories]);

  const openCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    if (editingCategory) {
      const { error } = await supabase
        .from("menu_categories")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", editingCategory.id);
      if (error) throw error;
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const restaurantId = user?.user_metadata?.restaurantId;
      const { error } = await supabase.from("menu_categories").insert({
        ...formData,
        restaurant_id: restaurantId,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    }
    setShowModal(false);
    setEditingCategory(null);
    await loadCategories();
  };

  const handleToggleActive = async (category: Category) => {
    const { error } = await supabase
      .from("menu_categories")
      .update({
        is_active: !category.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", category.id);
    if (error) console.error("Failed to toggle category:", error);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Categories"
        subtitle="Organize your menu • Real-time updates ⚡"
        action={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-5 h-5" />
            Add Category
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
            <Plus className="w-5 h-5" />
            Create Category
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
                  onClick={() => handleToggleActive(category)}
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
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
