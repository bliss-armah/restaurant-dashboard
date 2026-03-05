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
import { Restaurant } from "@/lib/types";
import { type RestaurantFormData } from "@/lib/hooks/useRestaurants";

const schema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  description: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().optional(),
  momoNumber: z.string().min(1, "MoMo number is required"),
  momoName: z.string().min(1, "MoMo name is required"),
});

type FormValues = z.output<typeof schema>;

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => Promise<void>;
}

export function RestaurantModal({
  restaurant,
  onClose,
  onSubmit,
}: RestaurantModalProps) {
  const isEditing = restaurant !== null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      phone: restaurant?.phone || "",
      email: restaurant?.email || "",
      momoNumber: restaurant?.momo_number || "",
      momoName: restaurant?.momo_name || "",
    },
  });

  const onValid = async (data: FormValues) => {
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError("root", {
        message:
          err.message ||
          `Failed to ${isEditing ? "update" : "create"} restaurant`,
      });
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Restaurant" : "Add New Restaurant"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {errors.root && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
            {errors.root.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="r-name">Restaurant Name *</Label>
            <Input
              id="r-name"
              {...register("name")}
              placeholder="Amazing Restaurant"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-phone">Phone *</Label>
            <Input
              id="r-phone"
              type="tel"
              {...register("phone")}
              placeholder="+233501234567"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="r-desc">Description</Label>
          <Textarea
            id="r-desc"
            {...register("description")}
            rows={3}
            placeholder="Brief description of the restaurant…"
            className="resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="r-email">Email</Label>
          <Input
            id="r-email"
            type="email"
            {...register("email")}
            placeholder="contact@restaurant.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="r-momo">MoMo Number *</Label>
            <Input
              id="r-momo"
              type="tel"
              {...register("momoNumber")}
              placeholder="0501234567"
            />
            {errors.momoNumber && (
              <p className="text-xs text-destructive">
                {errors.momoNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="r-momoname">MoMo Name *</Label>
            <Input
              id="r-momoname"
              {...register("momoName")}
              placeholder="John Doe"
            />
            {errors.momoName && (
              <p className="text-xs text-destructive">
                {errors.momoName.message}
              </p>
            )}
          </div>
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
            {isSubmitting
              ? isEditing
                ? "Updating…"
                : "Creating…"
              : isEditing
                ? "Update Restaurant"
                : "Create Restaurant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
