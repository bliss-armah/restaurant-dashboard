import { type LucideIcon } from "lucide-react";

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
  iconBgColor = "bg-black",
}: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subLabel && <p className="text-xs text-gray-500">{subLabel}</p>}
        </div>
      </div>
    </div>
  );
}
