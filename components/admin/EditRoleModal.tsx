"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Restaurant } from "@/lib/types";

const schema = z.object({
  role: z.enum(["SUPER_ADMIN", "RESTAURANT_ADMIN"]),
  restaurantId: z.string().optional(),
});

type FormValues = z.output<typeof schema>;

interface EditRoleModalProps {
  user: User;
  restaurants: Restaurant[];
  onClose: () => void;
  onSubmit: (
    userId: string,
    role: "SUPER_ADMIN" | "RESTAURANT_ADMIN",
    restaurantId?: string,
  ) => Promise<void>;
}

export function EditRoleModal({
  user,
  restaurants,
  onClose,
  onSubmit,
}: EditRoleModalProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role:
        (user.role as "SUPER_ADMIN" | "RESTAURANT_ADMIN") ?? "RESTAURANT_ADMIN",
      restaurantId: user.restaurantId ?? "",
    },
  });

  const role = watch("role");
  const restaurantId = watch("restaurantId");

  const onValid = async (data: FormValues) => {
    if (data.role === "RESTAURANT_ADMIN" && !data.restaurantId) {
      setError("restaurantId", {
        message: "Restaurant is required for Restaurant Admin",
      });
      return;
    }
    try {
      await onSubmit(user.id, data.role, data.restaurantId || undefined);
    } catch (err: any) {
      setError("root", { message: err.message || "Failed to update role" });
    }
  };

  return (
    <Modal title={`Edit Role — ${user.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {errors.root && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
            {errors.root.message}
          </p>
        )}

        <div className="space-y-1.5">
          <Label>Role *</Label>
          <Select
            value={role}
            onValueChange={(v) =>
              setValue("role", v as "SUPER_ADMIN" | "RESTAURANT_ADMIN", {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RESTAURANT_ADMIN">Restaurant Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {role === "RESTAURANT_ADMIN" && (
          <div className="space-y-1.5">
            <Label>Restaurant *</Label>
            <Select
              value={restaurantId}
              onValueChange={(v) =>
                setValue("restaurantId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select restaurant…" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.restaurantId && (
              <p className="text-xs text-destructive">
                {errors.restaurantId.message}
              </p>
            )}
          </div>
        )}

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
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
