"use client";

import { Pencil, Trash2, Building2, Plus } from "lucide-react";
import { Restaurant } from "@/lib/types";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onAdd: () => void;
}

export function RestaurantTable({
  restaurants,
  onEdit,
  onAdd,
}: RestaurantTableProps) {
  if (restaurants.length === 0) {
    return (
      <div className="card text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No restaurants yet</p>
        <button onClick={onAdd} className="btn btn-primary mt-4">
          <Plus className="w-5 h-5" />
          Add First Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Subscription</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id}>
              <td>
                <div className="font-semibold">{restaurant.name}</div>
                {restaurant.description && (
                  <div className="text-sm text-gray-600 truncate max-w-xs">
                    {restaurant.description}
                  </div>
                )}
              </td>
              <td>
                <div className="text-sm">
                  <div>{restaurant.phone}</div>
                  {restaurant.email && (
                    <div className="text-gray-600">{restaurant.email}</div>
                  )}
                </div>
              </td>
              <td>
                <span
                  className={`badge ${restaurant.is_active ? "badge-success" : "badge-warning"}`}
                >
                  {restaurant.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <span className="badge badge-info">
                  {restaurant.subscription_status}
                </span>
              </td>
              <td className="text-sm text-gray-600">
                {new Date(restaurant.created_at).toLocaleDateString()}
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(restaurant)}
                    className="btn-ghost p-2"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost p-2 text-red-600" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
