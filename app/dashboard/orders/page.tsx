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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order, OrderFilterKey } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  PREPARING:
    "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
  READY:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200",
  COMPLETED: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
};
const PAYMENT_BADGE: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  PENDING_VERIFICATION:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
  VERIFIED:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200",
  FAILED: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
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
      return o.paymentStatus === "PENDING_VERIFICATION";
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
    <Button
      onClick={() => setFilter(key)}
      variant={filter === key ? "default" : "outline"}
      size="sm"
    >
      {label}
    </Button>
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
        <Card className="border-dashed bg-muted/30 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Select a restaurant
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Use the dropdown above to choose a restaurant and view its orders.
            </p>
          </CardContent>
        </Card>
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5 shadow-none">
          <CardContent className="py-8 text-center text-destructive font-medium">
            {error}
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-dashed bg-muted/30 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No orders found
            </h3>
            <p className="text-muted-foreground">
              Orders will appear here as customers place them
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <Card
              key={order.id}
              className="group cursor-pointer hover:shadow-lg transition-all hover:border-primary/30 border-border/60 bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {order.orderNumber}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`font-semibold border ${STATUS_BADGE[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`font-semibold border ${PAYMENT_BADGE[order.paymentStatus]}`}
                    >
                      {order.paymentStatus.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="font-semibold border">
                      {order.fulfillmentType === "DELIVERY" ? "🚚 Delivery" : "🏪 Pickup"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap text-sm text-muted-foreground gap-x-6 gap-y-2 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      Customer:{" "}
                      <span className="text-foreground">
                        {order.customer.name || order.customer.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      Items:{" "}
                      <span className="text-foreground">
                        {order.items.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/50">
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </CardContent>
            </Card>
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
