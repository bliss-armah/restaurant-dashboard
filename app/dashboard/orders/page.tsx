"use client";

import { useState } from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
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
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import type { Order, OrderFilterKey } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED:  "bg-blue-100 text-blue-800 border-blue-200",
  PREPARING:  "bg-purple-100 text-purple-800 border-purple-200",
  READY:      "bg-emerald-100 text-emerald-800 border-emerald-200",
  COMPLETED:  "bg-gray-100 text-gray-600 border-gray-200",
  CANCELLED:  "bg-red-100 text-red-800 border-red-200",
};

const PAYMENT_BADGE: Record<string, string> = {
  UNPAID:               "bg-red-100 text-red-800 border-red-200",
  PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
  VERIFIED:             "bg-emerald-100 text-emerald-800 border-emerald-200",
  FAILED:               "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_VERIFICATION: "Pending",
  VERIFIED:   "Verified",
  UNPAID:     "Unpaid",
  FAILED:     "Failed",
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

  // ── table columns ─────────────────────────────────────────────────────────

  const orderColumns: ColumnDef<Order>[] = [
    {
      header: "Order #",
      className: "whitespace-nowrap",
      cell: (o) => (
        <span className="font-semibold text-foreground">{o.orderNumber}</span>
      ),
    },
    {
      header: "Customer",
      className: "whitespace-nowrap",
      cell: (o) => (
        <span className="text-foreground">
          {o.customer.name || o.customer.phone}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (o) => (
        <Badge
          variant="outline"
          className={`font-semibold border text-xs ${STATUS_BADGE[o.status]}`}
        >
          {o.status}
        </Badge>
      ),
    },
    {
      header: "Payment",
      cell: (o) => (
        <Badge
          variant="outline"
          className={`font-semibold border text-xs ${PAYMENT_BADGE[o.paymentStatus]}`}
        >
          {STATUS_LABEL[o.paymentStatus] ?? o.paymentStatus.replace("_", " ")}
        </Badge>
      ),
    },
    {
      header: "Type",
      className: "whitespace-nowrap",
      cell: (o) => (
        <span className="text-muted-foreground">
          {o.fulfillmentType === "DELIVERY" ? "🚚 Delivery" : "🏪 Pickup"}
        </span>
      ),
    },
    {
      header: "Items",
      align: "right",
      cell: (o) => (
        <span className="text-muted-foreground tabular-nums">
          {o.items.length}
        </span>
      ),
    },
    {
      header: "Total",
      align: "right",
      className: "whitespace-nowrap",
      cell: (o) => (
        <span className="font-bold tabular-nums text-foreground">
          {formatPrice(o.totalAmount)}
        </span>
      ),
    },
    {
      header: "Date",
      className: "whitespace-nowrap",
      cell: (o) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(o.createdAt)}
        </span>
      ),
    },
  ];

  // ── shared empty/error/loading states ──────────────────────────────────────

  const noRestaurant = isSuperAdmin && !selectedRestaurantId;

  const EmptyPrompt = ({ icon, title, sub }: { icon?: boolean; title: string; sub: string }) => (
    <Card className="border-dashed bg-muted/30 shadow-none">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{sub}</p>
      </CardContent>
    </Card>
  );

  // ── render ─────────────────────────────────────────────────────────────────

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

      {noRestaurant ? (
        <EmptyPrompt
          title="Select a restaurant"
          sub="Use the dropdown above to choose a restaurant and view its orders."
        />
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5 shadow-none">
          <CardContent className="py-8 text-center text-destructive font-medium">
            {error}
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <EmptyPrompt
          title="No orders found"
          sub="Orders will appear here as customers place them"
        />
      ) : (
        <>
          {/* ── DESKTOP TABLE (md+) ─────────────────────────────────────── */}
          <div className="hidden md:block">
            <DataTable
              columns={orderColumns}
              rows={filteredOrders}
              keyExtractor={(o) => o.id}
              onRowClick={setSelectedOrder}
            />
          </div>

          {/* ── MOBILE CARDS (< md) ─────────────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order, index) => (
              <Card
                key={order.id}
                className="group cursor-pointer hover:shadow-md transition-all hover:border-primary/30 border-border/60 bg-card animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="p-4">
                  {/* Top row: order number + amount */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-lg font-extrabold text-foreground">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </div>

                  {/* Customer + type */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {order.customer.name || order.customer.phone}
                    <span className="mx-2 text-border">·</span>
                    {order.fulfillmentType === "DELIVERY" ? "🚚 Delivery" : "🏪 Pickup"}
                    <span className="mx-2 text-border">·</span>
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`font-semibold border text-xs ${STATUS_BADGE[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`font-semibold border text-xs ${PAYMENT_BADGE[order.paymentStatus]}`}
                    >
                      {STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus.replace("_", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
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
