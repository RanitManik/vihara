import { hotelTypes } from "@/lib/hotel-options";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props = {
  selectedHotelTypes: string[];
  onChange: (value: string, checked: boolean) => void;
};

export function HotelTypesFilter({ selectedHotelTypes, onChange }: Props) {
  return (
    <div className="border-border/70 space-y-3 border-b pb-4">
      <h4 className="font-heading text-xl leading-none font-semibold">
        Stay type
      </h4>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {hotelTypes.map((type) => (
          <Label
            key={type}
            className="border-border/70 bg-background/70 flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium"
          >
            <Checkbox
              checked={selectedHotelTypes.includes(type)}
              onCheckedChange={(checked) => onChange(type, checked === true)}
            />
            <span>{type}</span>
          </Label>
        ))}
      </div>
    </div>
  );
}
