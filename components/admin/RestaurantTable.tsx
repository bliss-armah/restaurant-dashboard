"use client";

import { Pencil, Trash2, Building2, Plus } from "lucide-react";
import { Restaurant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onAdd: () => void;
  onToggleOpen?: (restaurant: Restaurant, isOpen: boolean) => void;
}

export function RestaurantTable({
  restaurants,
  onEdit,
  onAdd,
  onToggleOpen,
}: RestaurantTableProps) {
  if (restaurants.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No restaurants yet</p>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add First Restaurant
          </Button>
        </CardContent>
      </Card>
    );
  }

  const columns: ColumnDef<Restaurant>[] = [
    {
      header: "Restaurant",
      cell: (r) => (
        <div>
          <div className="font-semibold text-foreground">{r.name}</div>
          {r.description && (
            <div className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
              {r.description}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Contact",
      cell: (r) => (
        <div className="space-y-0.5">
          <div>{r.phone}</div>
          {r.email && (
            <div className="text-muted-foreground text-xs">{r.email}</div>
          )}
        </div>
      ),
    },
    {
      header: "Active",
      cell: (r) => (
        <Badge variant={r.isActive ? "default" : "secondary"}>
          {r.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Orders",
      cell: (r) => (
        <Badge
          variant="outline"
          className={
            r.isOpen
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          }
        >
          {r.isOpen ? "Open" : "Closed"}
        </Badge>
      ),
    },
    {
      header: "Subscription",
      cell: (r) => <Badge variant="outline">{r.subscriptionStatus}</Badge>,
    },
    {
      header: "Created",
      className: "whitespace-nowrap",
      cell: (r) => (
        <span className="text-muted-foreground">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(r);
            }}
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {onToggleOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleOpen(r, !r.isOpen);
              }}
              className={
                r.isOpen
                  ? "text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                  : "text-green-600 hover:text-green-700 hover:bg-green-50 text-xs"
              }
            >
              {r.isOpen ? "Close" : "Open"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            title="Delete"
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={restaurants}
      keyExtractor={(r) => r.id}
    />
  );
}
