import { Star } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  selectedStars: string[];
  onChange: (value: string, checked: boolean) => void;
};

export function StarRatingFilter({ selectedStars, onChange }: Props) {
  return (
    <div className="border-border/70 space-y-3 border-b pb-4">
      <h4 className="font-heading text-xl leading-none font-semibold">
        Property rating
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {["5", "4", "3", "2", "1"].map((star) => {
          const checked = selectedStars.includes(star);

          return (
            <Label
              key={star}
              className="border-border/70 bg-background/70 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 whitespace-nowrap"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(nextChecked) =>
                    onChange(star, nextChecked === true)
                  }
                />
                <span className="text-sm font-medium">{star} stars & up</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: Number(star) }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-current text-current"
                  />
                ))}
              </div>
            </Label>
          );
        })}
      </div>
    </div>
  );
}
