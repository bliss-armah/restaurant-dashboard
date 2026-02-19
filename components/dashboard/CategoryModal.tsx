"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface CategoryFormData {
  name: string;
  description: string;
  sort_order: number;
}

interface CategoryModalProps {
  initialData?: CategoryFormData;
  title: string;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function CategoryModal({
  initialData,
  title,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData ?? { name: "", description: "", sort_order: 0 },
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to save category");
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
          <label className="block text-sm font-medium mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="e.g., Main Dishes"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">Sort Order</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              setFormData({
                ...formData,
                sort_order: parseInt(e.target.value) || 0,
              })
            }
            className="input"
            min="0"
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
