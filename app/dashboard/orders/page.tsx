"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliveryAddress: string | null;
  customerNotes: string | null;
  createdAt: string;
  customer: {
    name: string | null;
    phone: string;
  };
  items: Array<{
    id: string;
    itemName: string;
    itemPrice: number;
    quantity: number;
    subtotal: number;
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: "badge-warning",
  CONFIRMED: "badge-info",
  PREPARING: "badge-info",
  READY: "badge-success",
  COMPLETED: "badge-success",
  CANCELLED: "badge-danger",
};

const paymentColors: Record<string, string> = {
  UNPAID: "badge-danger",
  PENDING_VERIFICATION: "badge-warning",
  VERIFIED: "badge-success",
  FAILED: "badge-danger",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadOrders();

    // Real-time subscription for new orders
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Order",
        },
        (payload) => {
          // New order notification
          loadOrders();
          // You can add a toast notification here
          console.log("New order received!", payload);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Order",
        },
        () => {
          loadOrders();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("Order")
        .select(
          `
          id,
          orderNumber,
          totalAmount,
          status,
          paymentStatus,
          deliveryAddress,
          customerNotes,
          createdAt,
          customer:customerId (
            name,
            phone
          ),
          items:OrderItem (
            id,
            itemName,
            itemPrice,
            quantity,
            subtotal
          )
        `,
        )
        .order("createdAt", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    status?: string,
    paymentStatus?: string,
  ) => {
    try {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const { error } = await supabase
        .from("Order")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "pending-payment")
      return order.paymentStatus === "PENDING_VERIFICATION";
    if (filter === "active")
      return ["PENDING", "CONFIRMED", "PREPARING"].includes(order.status);
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Orders</h1>
          <p className="text-black-400 mt-2">
            Manage customer orders • Real-time ⚡
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending-payment")}
            className={`btn ${filter === "pending-payment" ? "btn-primary" : "btn-secondary"}`}
          >
            Pending Payment
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`btn ${filter === "active" ? "btn-primary" : "btn-secondary"}`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingBag className="w-16 h-16 text-black-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">
            No orders found
          </h3>
          <p className="text-black-400">
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
                      {order.orderNumber}
                    </h3>
                    <span className={`badge ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span
                      className={`badge ${paymentColors[order.paymentStatus]}`}
                    >
                      {order.paymentStatus.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-sm text-black-400 space-y-1">
                    <p>
                      Customer: {order.customer.name || order.customer.phone}
                    </p>
                    <p>Items: {order.items.length}</p>
                    <p>Date: {formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-black">
                    {formatPrice(order.totalAmount)}
                  </p>
                  {order.paymentStatus === "PENDING_VERIFICATION" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, undefined, "VERIFIED");
                        }}
                        className="btn btn-primary text-sm"
                      >
                        <Check className="w-4 h-4" />
                        Verify Payment
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, undefined, "FAILED");
                        }}
                        className="btn btn-secondary text-sm"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full my-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {selectedOrder.orderNumber}
                </h2>
                <p className="text-black-400 text-sm mt-1">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-ghost p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-black-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Customer</h3>
              <p className="text-black-600">
                {selectedOrder.customer.name || "Unknown"} •{" "}
                {selectedOrder.customer.phone}
              </p>
              {selectedOrder.deliveryAddress && (
                <p className="text-sm text-black-400 mt-1">
                  Address: {selectedOrder.deliveryAddress}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-black mb-3">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-black-200 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-black">{item.itemName}</p>
                      <p className="text-sm text-black-400">
                        {item.quantity}x @ {formatPrice(item.itemPrice)}
                      </p>
                    </div>
                    <p className="font-semibold text-black">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between text-xl font-bold text-black pt-4 border-t-2 border-black">
              <span>Total</span>
              <span>{formatPrice(selectedOrder.totalAmount)}</span>
            </div>

            {/* Status Actions */}
            <div className="mt-6 pt-6 border-t-2 border-black-200">
              <h3 className="font-semibold text-black mb-3">Update Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "CONFIRMED")
                  }
                  className="btn btn-secondary text-sm"
                >
                  Confirm
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "PREPARING")
                  }
                  className="btn btn-secondary text-sm"
                >
                  Preparing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "READY")}
                  className="btn btn-secondary text-sm"
                >
                  Ready
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, "COMPLETED")
                  }
                  className="btn btn-primary text-sm"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
