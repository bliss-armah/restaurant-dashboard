"use client";

import { Mail, Phone, Pencil, Users } from "lucide-react";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";

interface UserTableProps {
  users: User[];
  onEditRole?: (user: User) => void;
}

export function UserTable({ users, onEditRole }: UserTableProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found</p>
        </CardContent>
      </Card>
    );
  }

  const columns: ColumnDef<User>[] = [
    {
      header: "User",
      cell: (user) => (
        <span className="font-semibold text-foreground">{user.name}</span>
      ),
    },
    {
      header: "Contact",
      cell: (user) => (
        <div className="space-y-1">
          {user.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3 h-3 shrink-0" />
              {user.email}
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3 h-3 shrink-0" />
              {user.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Role",
      cell: (user) => (
        <Badge
          variant={user.role === "SUPER_ADMIN" ? "destructive" : "secondary"}
        >
          {user.role === "SUPER_ADMIN" ? "Super Admin" : "Restaurant Admin"}
        </Badge>
      ),
    },
    {
      header: "Restaurant",
      cell: (user) =>
        user.restaurant ? (
          <span>{user.restaurant.name}</span>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        ),
    },
    {
      header: "Status",
      cell: (user) => (
        <Badge variant={user.isActive ? "default" : "secondary"}>
          {user.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Created",
      className: "whitespace-nowrap",
      cell: (user) => (
        <span className="text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    ...(onEditRole
      ? [
          {
            header: "Actions",
            cell: (user: User) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRole(user);
                }}
                className="gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Role
              </Button>
            ),
          } satisfies ColumnDef<User>,
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={users}
      keyExtractor={(user) => user.id}
    />
  );
}
