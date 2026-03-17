"use client";

import { useState } from "react";
import { Check, X, ChefHat, Package, CircleCheck, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (
    orderId: string,
    status?: string,
    paymentStatus?: string,
  ) => Promise<void>;
}

const STATUS_ACTIONS: {
  label: string;
  value: string;
  icon: React.ReactNode;
  variant: "default" | "outline" | "destructive";
  allowedFrom: string[];
}[] = [
  {
    label: "Confirm",
    value: "CONFIRMED",
    icon: <Check className="w-4 h-4" />,
    variant: "default",
    allowedFrom: ["PENDING"],
  },
  {
    label: "Preparing",
    value: "PREPARING",
    icon: <ChefHat className="w-4 h-4" />,
    variant: "outline",
    allowedFrom: ["CONFIRMED"],
  },
  {
    label: "Ready",
    value: "READY",
    icon: <Package className="w-4 h-4" />,
    variant: "outline",
    allowedFrom: ["PREPARING"],
  },
  {
    label: "Complete",
    value: "COMPLETED",
    icon: <CircleCheck className="w-4 h-4" />,
    variant: "default",
    allowedFrom: ["READY"],
  },
  {
    label: "Reject",
    value: "CANCELLED",
    icon: <X className="w-4 h-4" />,
    variant: "destructive",
    allowedFrom: ["PENDING", "CONFIRMED", "PREPARING"],
  },
];

export function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAction = async (status: string, paymentStatus?: string) => {
    if (pendingAction) return;
    setPendingAction(status);
    setActionError(null);
    try {
      await onUpdateStatus(order.id, status, paymentStatus);
    } catch (err: any) {
      setActionError(err.message || "Action failed. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  const availableActions = STATUS_ACTIONS.filter((a) =>
    a.allowedFrom.includes(order.status),
  );

  return (
    <Modal title={order.orderNumber} onClose={onClose}>
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground -mt-2">
          {formatDate(order.createdAt)}
        </p>

        {/* Customer */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-1">Customer</h3>
          <p className="text-sm text-muted-foreground">
            {order.customer.name || "Unknown"} • {order.customer.phone}
          </p>
          {order.deliveryAddress && (
            <p className="text-xs text-muted-foreground mt-1">
              📍 {order.deliveryAddress}
            </p>
          )}
          {order.customerNotes && (
            <p className="text-xs text-muted-foreground mt-1">
              📝 {order.customerNotes}
            </p>
          )}
        </div>

        {/* Items */}
        <div>
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{item.itemName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity}x @ {formatPrice(item.itemPrice)}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>

        {/* Error feedback */}
        {actionError && (
          <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
            {actionError}
          </p>
        )}

        {/* Payment pending verification */}
        {order.paymentStatus === "PENDING_VERIFICATION" &&
          order.status === "PENDING" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                💳 Payment Pending Verification
              </p>
              <p className="text-xs text-yellow-700 mb-3">
                Customer has claimed payment. Confirm to verify, or Reject to
                cancel.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAction("CONFIRMED")}
                  disabled={!!pendingAction}
                  className="flex-1"
                  size="sm"
                >
                  {pendingAction === "CONFIRMED" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Check className="w-4 h-4 mr-1" />
                  )}
                  Confirm &amp; Verify
                </Button>
                <Button
                  onClick={() => handleAction("CANCELLED")}
                  disabled={!!pendingAction}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  {pendingAction === "CANCELLED" ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <X className="w-4 h-4 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          )}

        {/* General status actions */}
        {availableActions.length > 0 &&
          !(
            order.paymentStatus === "PENDING_VERIFICATION" &&
            order.status === "PENDING"
          ) && (
            <div>
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {availableActions.map((action) => (
                  <Button
                    key={action.value}
                    onClick={() => handleAction(action.value)}
                    disabled={!!pendingAction}
                    variant={action.variant}
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    {pendingAction === action.value ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      action.icon
                    )}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

        {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
          <p className="text-sm text-center text-muted-foreground">
            This order is {order.status.toLowerCase()} — no further actions
            available.
          </p>
        )}
      </div>
    </Modal>
  );
}
