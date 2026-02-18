import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {action && <div>{action}</div>}
      </div>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
}
