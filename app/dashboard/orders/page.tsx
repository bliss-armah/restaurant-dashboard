"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { useAuth } from "@/lib/auth-context";
import { formatPrice, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { OrderDetailModal } from "@/components/dashboard/OrderDetailModal";
import { RestaurantSelector } from "@/components/ui/RestaurantSelector";
import type { Order, OrderFilterKey } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
  PENDING: "badge-warning",
  CONFIRMED: "badge-info",
  PREPARING: "badge-info",
  READY: "badge-success",
  COMPLETED: "badge-success",
  CANCELLED: "badge-danger",
};
const PAYMENT_BADGE: Record<string, string> = {
  UNPAID: "badge-danger",
  PENDING_VERIFICATION: "badge-warning",
  VERIFIED: "badge-success",
  FAILED: "badge-danger",
};

export default function OrdersPage() {
  const { isSuperAdmin } = useAuth();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const { orders, loading, error, updateOrderStatus } = useOrders(
    selectedRestaurantId || undefined,
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderFilterKey>("all");

  const filteredOrders = orders.filter((o) => {
    if (filter === "pending-payment")
      return o.payment_status === "PENDING_VERIFICATION";
    if (filter === "active")
      return ["PENDING", "CONFIRMED", "PREPARING"].includes(o.status);
    return true;
  });

  const handleUpdateStatus = async (
    id: string,
    status?: string,
    paymentStatus?: string,
  ) => {
    await updateOrderStatus(id, status, paymentStatus);
    setSelectedOrder(null);
  };

  const filterBtn = (key: OrderFilterKey, label: string) => (
    <button
      onClick={() => setFilter(key)}
      className={`btn ${filter === key ? "btn-primary" : "btn-secondary"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders • Real-time ⚡"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <RestaurantSelector
              value={selectedRestaurantId}
              onChange={setSelectedRestaurantId}
            />
            {filterBtn("all", "All")}
            {filterBtn("pending-payment", "Pending Payment")}
            {filterBtn("active", "Active")}
          </div>
        }
      />

      {/* Prompt super admin to pick a restaurant */}
      {isSuperAdmin && !selectedRestaurantId ? (
        <div className="card text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            Select a restaurant
          </h3>
          <p className="text-gray-400">
            Use the dropdown above to choose a restaurant and view its orders.
          </p>
        </div>
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="card text-center py-12">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No orders found
          </h3>
          <p className="text-gray-400">
            Orders will appear here as customers place them
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={order.id}
              className="card cursor-pointer hover:shadow-xl transition-all animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black">
                      {order.order_number}
                    </h3>
                    <span className={`badge ${STATUS_BADGE[order.status]}`}>
                      {order.status}
                    </span>
                    <span
                      className={`badge ${PAYMENT_BADGE[order.payment_status]}`}
                    >
                      {order.payment_status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      Customer: {order.customer.name || order.customer.phone}
                    </p>
                    <p>Items: {order.items.length}</p>
                    <p>Date: {formatDate(order.created_at)}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-black">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
