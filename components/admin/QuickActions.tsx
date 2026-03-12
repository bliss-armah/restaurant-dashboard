"use client";

import { useRouter } from "next/navigation";
import { Building2, Users, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 group transition-all"
              onClick={() => router.push("/dashboard/admin/restaurants")}
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Manage Restaurants</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 group transition-all"
              onClick={() => router.push("/dashboard/admin/users")}
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Database", status: "Connected" },
              { label: "WhatsApp API", status: "Active" },
              { label: "Backend Service", status: "Running" },
            ].map(({ label, status }) => (
              <div
                key={label}
                className="flex items-center justify-between pb-3 border-b border-border/40 last:border-0 last:pb-0"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {label}
                </span>
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 border-transparent shadow-sm"
                >
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RecentActivity() {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">
          Recent Platform Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10 flex flex-col items-center justify-center rounded-xl bg-muted/20 border border-dashed border-border/60 mt-2 transition-colors hover:bg-muted/30">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-primary/40" />
          </div>
          <p className="font-medium text-muted-foreground">
            Activity log coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
