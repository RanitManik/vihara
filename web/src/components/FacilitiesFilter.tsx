import { hotelFacilities } from "@/lib/hotel-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  selectedFacilities: string[];
  onChange: (value: string, checked: boolean) => void;
};

export function FacilitiesFilter({ selectedFacilities, onChange }: Props) {
  return (
    <div className="space-y-3">
      <h4 className="font-heading text-xl leading-none font-semibold">
        Facilities
      </h4>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {hotelFacilities.map((facility) => (
          <Label
            key={facility}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2.5 text-sm font-medium"
          >
            <Checkbox
              checked={selectedFacilities.includes(facility)}
              onCheckedChange={(checked) =>
                onChange(facility, checked === true)
              }
            />
            <span>{facility}</span>
          </Label>
        ))}
      </div>
    </div>
  );
}
