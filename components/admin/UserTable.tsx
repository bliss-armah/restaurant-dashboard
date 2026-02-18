"use client";

import { Mail, Phone, Users } from "lucide-react";
import { User } from "@/lib/types";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="card text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No users found</p>
      </div>
    );
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Restaurant</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="font-semibold">{user.name}</div>
              </td>
              <td>
                <div className="text-sm space-y-1">
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {user.email}
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {user.phone}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <span
                  className={`badge ${
                    user.role === "SUPER_ADMIN" ? "badge-danger" : "badge-info"
                  }`}
                >
                  {user.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : "Restaurant Admin"}
                </span>
              </td>
              <td>
                {user.restaurant ? (
                  <span className="text-sm">{user.restaurant.name}</span>
                ) : (
                  <span className="text-sm text-gray-400">N/A</span>
                )}
              </td>
              <td>
                <span
                  className={`badge ${
                    user.is_active ? "badge-success" : "badge-warning"
                  }`}
                >
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="text-sm text-gray-600">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
