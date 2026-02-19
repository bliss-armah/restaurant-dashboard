"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MenuItemModal } from "@/components/dashboard/MenuItemModal";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
  sort_order: number;
}

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase
          .from("menu_items")
          .select("*, category:category_id(id, name)")
          .order("sort_order"),
        supabase.from("menu_categories").select("id, name").order("sort_order"),
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
  }, []);

  useEffect(() => {
    loadData();
    const sub = supabase
      .channel("menu-items")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        loadData,
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, [loadData]);

  const openCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = async (formData: MenuItemFormData) => {
    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category_id: formData.category_id,
      image_url: formData.image_url || null,
      sort_order: formData.sort_order,
      updated_at: new Date().toISOString(),
    };

    if (editingItem) {
      const { error } = await supabase
        .from("menu_items")
        .update(payload)
        .eq("id", editingItem.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("menu_items").insert(payload);
      if (error) throw error;
    }
    setShowModal(false);
    setEditingItem(null);
    await loadData();
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    const { error } = await supabase
      .from("menu_items")
      .update({
        is_available: !item.is_available,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);
    if (error) console.error("Failed to toggle item:", error);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Menu Items"
        subtitle="Manage your restaurant menu • Real-time ⚡"
        action={
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        }
      />

      {menuItems.length === 0 ? (
        <div className="card text-center py-12">
          <UtensilsCrossed className="w-16 h-16 text-black-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No menu items yet
          </h3>
          <p className="text-black-400 mb-6">
            Create your first menu item to get started
          </p>
          <button onClick={openCreate} className="btn btn-primary mx-auto">
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
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
