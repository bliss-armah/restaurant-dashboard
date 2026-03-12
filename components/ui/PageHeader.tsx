import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}
