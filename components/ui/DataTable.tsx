import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Column definition ────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  /** Header label shown in the thead */
  header: string;
  /** Render function for each cell */
  cell: (row: T) => React.ReactNode;
  /** Horizontal alignment — defaults to left */
  align?: "left" | "right" | "center";
  /**
   * Extra Tailwind classes applied to BOTH the <th> and <td> for this column.
   * Use this for things like `whitespace-nowrap` or `w-32`.
   */
  className?: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  /** Must return a stable unique string for each row (used as React key) */
  keyExtractor: (row: T) => string;
  /**
   * When provided, every row becomes clickable and a ChevronRight indicator
   * is appended automatically. Action buttons inside cells should call
   * e.stopPropagation() to prevent triggering the row click.
   */
  onRowClick?: (row: T) => void;
  /** Extra classes on the wrapping Card */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALIGN_CLASS = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const clickable = !!onRowClick;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 shadow-none bg-card",
        className,
      )}
    >
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            {/* ── Header ─────────────────────────────────────────────────── */}
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/60">
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={cn(
                      "h-11 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap",
                      ALIGN_CLASS[col.align ?? "left"],
                      col.className,
                    )}
                  >
                    {col.header}
                  </TableHead>
                ))}
                {/* Spacer for the chevron column */}
                {clickable && <TableHead className="w-8 px-4" />}
              </TableRow>
            </TableHeader>

            {/* ── Body ───────────────────────────────────────────────────── */}
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border/40 transition-colors",
                    clickable
                      ? "cursor-pointer hover:bg-muted/40 group"
                      : "hover:bg-muted/30",
                  )}
                >
                  {columns.map((col, i) => (
                    <TableCell
                      key={i}
                      className={cn(
                        "px-4 py-3.5 text-sm align-middle",
                        ALIGN_CLASS[col.align ?? "left"],
                        col.className,
                      )}
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
