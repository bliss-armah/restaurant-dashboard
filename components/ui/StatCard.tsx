import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subLabel?: string;
  iconBgColor?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subLabel,
  iconBgColor = "bg-primary/10 text-primary",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card group">
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${iconBgColor} group-hover:bg-primary group-hover:text-primary-foreground shadow-sm`}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {subLabel && (
              <p className="text-sm text-muted-foreground/80 mt-1 flex items-center gap-1.5">
                {subLabel}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
