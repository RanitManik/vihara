import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

function buildPageItems(page: number, pages: number) {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, 4, "...", pages];
  }

  if (page >= pages - 2) {
    return [1, "...", pages - 3, pages - 2, pages - 1, pages];
  }

  return [1, "...", page - 1, page, page + 1, "...", pages];
}

export function Pagination({ page, pages, onPageChange }: Props) {
  if (pages <= 1) {
    return null;
  }

  const items = buildPageItems(page, pages);

  return (
    <div className="flex justify-center">
      <div className="surface-panel flex items-center gap-2 px-3 py-2">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {items.map((item, index) =>
            item === "..." ? (
              <div
                key={`ellipsis-${index}`}
                className="text-muted-foreground flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors",
                  page === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          disabled={page === pages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
