"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { formatPrice, formatDate } from "@/lib/utils";
import { Check, X, ChefHat, Package, CircleCheck, Loader2 } from "lucide-react";
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

// Status actions available once an order is in a given state.
// Actions are gated by the current status so the UI auto-hides inapplicable buttons.
const STATUS_ACTIONS: {
  label: string;
  value: string;
  icon: React.ReactNode;
  variant: "primary" | "secondary" | "danger";
  allowedFrom: string[]; // only show when order is in one of these statuses
}[] = [
  {
    label: "Confirm",
    value: "CONFIRMED",
    icon: <Check className="w-4 h-4" />,
    variant: "primary",
    allowedFrom: ["PENDING"],
  },
  {
    label: "Preparing",
    value: "PREPARING",
    icon: <ChefHat className="w-4 h-4" />,
    variant: "secondary",
    allowedFrom: ["CONFIRMED"],
  },
  {
    label: "Ready",
    value: "READY",
    icon: <Package className="w-4 h-4" />,
    variant: "secondary",
    allowedFrom: ["PREPARING"],
  },
  {
    label: "Complete",
    value: "COMPLETED",
    icon: <CircleCheck className="w-4 h-4" />,
    variant: "primary",
    allowedFrom: ["READY"],
  },
  {
    label: "Reject",
    value: "CANCELLED",
    icon: <X className="w-4 h-4" />,
    variant: "danger",
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
    if (pendingAction) return; // prevent double-click
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
    <Modal title={order.order_number} onClose={onClose}>
      <div className="space-y-6">
        <p className="text-sm text-gray-500 -mt-2">
          {formatDate(order.created_at)}
        </p>

        {/* Customer */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-1">Customer</h3>
          <p className="text-sm text-gray-600">
            {order.customer.name || "Unknown"} • {order.customer.phone}
          </p>
          {order.delivery_address && (
            <p className="text-xs text-gray-400 mt-1">
              📍 {order.delivery_address}
            </p>
          )}
          {order.customer_notes && (
            <p className="text-xs text-gray-400 mt-1">
              📝 {order.customer_notes}
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
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-sm">{item.item_name}</p>
                  <p className="text-xs text-gray-400">
                    {item.quantity}x @ {formatPrice(item.item_price)}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-bold pt-2 border-t-2 border-black">
          <span>Total</span>
          <span>{formatPrice(order.total_amount)}</span>
        </div>

        {/* Error feedback */}
        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {actionError}
          </div>
        )}

        {/* Payment pending verification — approve/reject */}
        {order.payment_status === "PENDING_VERIFICATION" &&
          order.status === "PENDING" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                💳 Payment Pending Verification
              </p>
              <p className="text-xs text-yellow-700 mb-3">
                Customer has claimed payment. Confirm to verify and progress the
                order, or Reject to cancel it.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction("CONFIRMED")}
                  disabled={!!pendingAction}
                  className="btn btn-primary flex-1 text-sm"
                >
                  {pendingAction === "CONFIRMED" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Confirm &amp; Verify
                </button>
                <button
                  onClick={() => handleAction("CANCELLED")}
                  disabled={!!pendingAction}
                  className="btn btn-secondary flex-1 text-sm border-red-300 text-red-600 hover:bg-red-50"
                >
                  {pendingAction === "CANCELLED" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          )}

        {/* General status actions */}
        {availableActions.length > 0 &&
          !(
            order.payment_status === "PENDING_VERIFICATION" &&
            order.status === "PENDING"
          ) && (
            <div>
              <h3 className="font-semibold mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {availableActions.map((action) => (
                  <button
                    key={action.value}
                    onClick={() => handleAction(action.value)}
                    disabled={!!pendingAction}
                    className={`btn text-sm flex items-center gap-1.5 ${
                      action.variant === "primary"
                        ? "btn-primary"
                        : action.variant === "danger"
                          ? "btn-secondary border-red-300 text-red-600 hover:bg-red-50"
                          : "btn-secondary"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pendingAction === action.value ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      action.icon
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Terminal states — nothing more to do */}
        {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
          <p className="text-sm text-center text-gray-400">
            This order is {order.status.toLowerCase()} — no further actions
            available.
          </p>
        )}
      </div>
    </Modal>
  );
}
