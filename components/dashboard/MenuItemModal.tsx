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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MenuItemFormData, Category } from "@/lib/types";

const schema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional().default(""),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Price must be a positive number",
    }),
  category_id: z.string().min(1, "Please select a category"),
  image_url: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional()
    .default(""),
  sort_order: z.coerce.number().int().min(0).default(0),
});

type FormValues = z.infer<typeof schema>;

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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      name: "",
      description: "",
      price: "",
      category_id: categories[0]?.id || "",
      image_url: "",
      sort_order: 0,
    },
  });

  const categoryId = watch("category_id");

  const onValid = async (data: FormValues) => {
    try {
      await onSubmit(data as MenuItemFormData);
    } catch (err: any) {
      setError("root", { message: err.message || "Failed to save menu item" });
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
          <Label htmlFor="item-name">Item Name *</Label>
          <Input
            id="item-name"
            {...register("name")}
            placeholder="e.g., Jollof Rice"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select
            value={categoryId}
            onValueChange={(v) =>
              setValue("category_id", v, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-xs text-destructive">
              {errors.category_id.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="item-price">Price (GHS) *</Label>
          <Input
            id="item-price"
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="25.00"
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="item-desc">Description (Optional)</Label>
          <Textarea
            id="item-desc"
            {...register("description")}
            placeholder="Brief description…"
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="item-img">Image URL (Optional)</Label>
          <Input
            id="item-img"
            type="url"
            {...register("image_url")}
            placeholder="https://…"
          />
          {errors.image_url && (
            <p className="text-xs text-destructive">
              {errors.image_url.message}
            </p>
          )}
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
