"use client";

import { Pencil, Trash2, Building2, Plus } from "lucide-react";
import { Restaurant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>
                  <div className="font-semibold">{restaurant.name}</div>
                  {restaurant.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {restaurant.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{restaurant.phone}</div>
                    {restaurant.email && (
                      <div className="text-muted-foreground">
                        {restaurant.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={restaurant.isActive ? "default" : "secondary"}
                  >
                    {restaurant.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={restaurant.isOpen ? "default" : "destructive"}
                    className={restaurant.isOpen ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                  >
                    {restaurant.isOpen ? "Open" : "Closed"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {restaurant.subscriptionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(restaurant)}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {onToggleOpen && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleOpen(restaurant, !restaurant.isOpen)}
                        className={restaurant.isOpen ? "text-red-600 hover:text-red-700 hover:bg-red-50 text-xs" : "text-green-600 hover:text-green-700 hover:bg-green-50 text-xs"}
                        title={restaurant.isOpen ? "Close restaurant" : "Open restaurant"}
                      >
                        {restaurant.isOpen ? "Close" : "Open"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
