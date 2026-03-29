"use client";

import { ReactNode } from "react";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterSheetProps {
  children: ReactNode;
}

export function FilterSheet({ children }: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="surface-panel mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-full lg:hidden"
        >
          <Filter className="h-4 w-4" />
          Refine your search
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-border/60 w-[92vw] overflow-y-auto border-r bg-[linear-gradient(180deg,rgba(255,250,243,0.98),rgba(250,244,232,0.98))] sm:w-107.5"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-4xl leading-none">
            Refine your search
          </SheetTitle>
          <SheetDescription className="text-sm leading-6">
            Narrow the results with better controls for price, category, and
            amenities.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
