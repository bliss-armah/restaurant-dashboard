"use client";

import { Mail, Phone, Users, Pencil } from "lucide-react";
import { User } from "@/lib/types";
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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {onEditRole && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-semibold">{user.name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {user.email}
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "SUPER_ADMIN" ? "destructive" : "secondary"
                    }
                  >
                    {user.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : "Restaurant Admin"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.restaurant ? (
                    <span className="text-sm">{user.restaurant.name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                {onEditRole && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditRole(user)}
                      className="gap-1"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit Role
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
