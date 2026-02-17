"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, FolderOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  isActive: boolean;
  restaurantId: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sort_order: 0,
  });

  useEffect(() => {
    loadCategories();

    // Real-time subscription for category changes
    const subscription = supabase
      .channel("categories")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_categories",
        },
        () => {
          loadCategories();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadCategories = async () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (editingCategory) {
        const { error } = await supabase
          .from("menu_categories")
          .update(formData)
          .eq("id", editingCategory.id);

        if (error) throw error;
      } else {
        // Get user's restaurant ID (you'll need to add this to your User table or fetch logic)
        const { error } = await supabase.from("menu_categories").insert([
          {
            ...formData,
            restaurantId: "1", // TODO: Get from user session/metadata
          },
        ]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", sort_order: 0 });
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      sort_order: category.sort_order,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const { error } = await supabase
        .from("menu_categories")
        .update({ isActive: !category.isActive })
        .eq("id", category.id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to toggle category:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Categories</h1>
          <p className="text-black-400 mt-2">
            Organize your menu • Real-time updates ⚡
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              name: "",
              description: "",
              sort_order: categories.length,
            });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="card text-center py-12">
          <FolderOpen className="w-16 h-16 text-black-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No categories yet
          </h3>
          <p className="text-black-400 mb-6">
            Get started by creating your first category
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary mx-auto"
          >
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
                  onClick={() => handleEdit(category)}
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
                  className={`badge ${category.isActive ? "badge-success" : "badge-warning"}`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full animate-slide-up">
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Main Dishes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input resize-none"
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value),
                    })
                  }
                  className="input"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
