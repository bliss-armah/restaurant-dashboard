"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryFormData } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

type FormValues = z.infer<typeof schema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? { name: "", description: "", sortOrder: 0 },
  });

  const onValid = async (data: FormValues) => {
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError("root", { message: err.message || "Failed to save category" });
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        {errors.root && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
            {errors.root.message}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="cat-name">Category Name *</Label>
          <Input
            id="cat-name"
            {...register("name")}
            placeholder="e.g., Main Dishes"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-desc">Description (Optional)</Label>
          <Textarea
            id="cat-desc"
            {...register("description")}
            placeholder="Brief description…"
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cat-order">Sort Order</Label>
          <Input
            id="cat-order"
            type="number"
            min={0}
            {...register("sortOrder", { valueAsNumber: true })}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
