"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function MenuItemsPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    sortOrder: 0,
  });

  useEffect(() => {
    loadData();

    // Real-time subscription for menu items
    const subscription = supabase
      .channel("menu-items")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "MenuItem",
        },
        () => {
          loadData();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase
          .from("MenuItem")
          .select(
            `
            *,
            category:categoryId (
              id,
              name
            )
          `,
          )
          .order("sortOrder"),
        supabase.from("MenuCategory").select("id, name").order("sortOrder"),
      ]);

      if (itemsRes.error) throw itemsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setMenuItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error: any) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl || null,
        sortOrder: formData.sortOrder,
      };

      if (editingItem) {
        const { error } = await supabase
          .from("MenuItem")
          .update(data)
          .eq("id", editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("MenuItem").insert([data]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: "",
        sortOrder: 0,
      });
    } catch (error) {
      console.error("Failed to save menu item:", error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl || "",
      sortOrder: item.sortOrder,
    });
    setShowModal(true);
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from("MenuItem")
        .update({ isAvailable: !item.isAvailable })
        .eq("id", item.id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to toggle item:", error);
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
          <h1 className="text-3xl font-bold text-black">Menu Items</h1>
          <p className="text-black-400 mt-2">
            Manage your restaurant menu • Real-time ⚡
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              name: "",
              description: "",
              price: "",
              categoryId: categories[0]?.id || "",
              imageUrl: "",
              sortOrder: menuItems.length,
            });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Menu Items Table */}
      {menuItems.length === 0 ? (
        <div className="card text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-black-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No menu items yet
          </h3>
          <p className="text-black-400 mb-6">
            Create your first menu item to get started
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add Menu Item
          </button>
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
                  className="hover:bg-black-50 transition-colors"
                >
                  <td>
                    <div>
                      <div className="font-semibold text-black">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-black-400 mt-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {item.category?.name || "N/A"}
                    </span>
                  </td>
                  <td className="font-semibold">{formatPrice(item.price)}</td>
                  <td>
                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className={`badge ${item.isAvailable ? "badge-success" : "badge-warning"}`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
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

      {/* Modal - Same as before */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full my-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingItem ? "Edit Menu Item" : "Create Menu Item"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input"
                  placeholder="e.g., Jollof Rice"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Price (GHS)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="input"
                  placeholder="25.00"
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
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="input"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
