"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { MenuItemFormData, Category } from "@/lib/types";

interface MenuItemModalProps {
  categories: Category[];
  initialData?: MenuItemFormData;
  title: string;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => Promise<void>;
}

export function MenuItemModal({
  categories,
  initialData,
  title,
  onClose,
  onSubmit,
}: MenuItemModalProps) {
  const [formData, setFormData] = useState<MenuItemFormData>(
    initialData ?? {
      name: "",
      description: "",
      price: "",
      category_id: categories[0]?.id || "",
      image_url: "",
      sort_order: 0,
    },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set =
    (field: keyof MenuItemFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to save menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Item Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={set("name")}
            className="input"
            placeholder="e.g., Jollof Rice"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            value={formData.category_id}
            onChange={set("category_id")}
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
          <label className="block text-sm font-medium mb-2">
            Price (GHS) *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={set("price")}
            className="input"
            placeholder="25.00"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={set("description")}
            className="input resize-none"
            rows={3}
            placeholder="Brief description..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={set("image_url")}
            className="input"
            placeholder="https://..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
