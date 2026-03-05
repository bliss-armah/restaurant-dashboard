"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Restaurant } from "@/lib/types";

// Use a flat schema without .refine so the inferred type is always fully resolved.
// Cross-field validation (restaurant required for RESTAURANT_ADMIN) is done at submit time.
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8, "Minimum 8 characters"),
  role: z.enum(["SUPER_ADMIN", "RESTAURANT_ADMIN"]),
  restaurantId: z.string().optional(),
});

type FormValues = z.output<typeof schema>;

interface UserFormData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: "SUPER_ADMIN" | "RESTAURANT_ADMIN";
  restaurantId?: string;
}

interface UserModalProps {
  restaurants: Restaurant[];
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserModal({ restaurants, onClose, onSubmit }: UserModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "RESTAURANT_ADMIN",
      restaurantId: "",
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
      await onSubmit(data);
    } catch (err: any) {
      setError("root", { message: err.message || "Failed to create user" });
    }
  };

  return (
    <Modal title="Add New User" onClose={onClose}>
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {errors.root && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
            {errors.root.message}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="u-name">Name *</Label>
          <Input id="u-name" {...register("name")} placeholder="John Doe" />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="u-email">Email</Label>
            <Input
              id="u-email"
              type="email"
              {...register("email")}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="u-phone">Phone</Label>
            <Input
              id="u-phone"
              type="tel"
              {...register("phone")}
              placeholder="+233501234567"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="u-password">Password *</Label>
          <div className="relative">
            <Input
              id="u-password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters
            </p>
          )}
        </div>

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
            {isSubmitting ? "Creating…" : "Create User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
