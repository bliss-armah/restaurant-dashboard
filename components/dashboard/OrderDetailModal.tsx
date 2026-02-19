"use client";

import { Modal } from "@/components/ui/Modal";
import { formatPrice, formatDate } from "@/lib/utils";
import { Check, X } from "lucide-react";
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

const STATUS_ACTIONS = [
  { label: "Confirm", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Complete", value: "COMPLETED", primary: true },
];

export function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
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

        {/* Payment verification */}
        {order.payment_status === "PENDING_VERIFICATION" && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-semibold text-yellow-800 mb-3">
              Payment Pending Verification
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateStatus(order.id, undefined, "VERIFIED")}
                className="btn btn-primary flex-1 text-sm"
              >
                <Check className="w-4 h-4" /> Verify
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, undefined, "FAILED")}
                className="btn btn-secondary flex-1 text-sm"
              >
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        )}

        {/* Status update */}
        <div>
          <h3 className="font-semibold mb-3">Update Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_ACTIONS.map((action) => (
              <button
                key={action.value}
                onClick={() => onUpdateStatus(order.id, action.value)}
                className={`btn text-sm ${action.primary ? "btn-primary" : "btn-secondary"}`}
                disabled={order.status === action.value}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
