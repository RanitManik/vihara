import { hotelFacilities } from "@/lib/hotel-options";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FacilitiesFilter({ selectedFacilities, onChange }: Props) {
  return (
    <div className="border-border border-b pb-5">
      <h4 className="text-md mb-2 font-semibold">Facilities</h4>
      {hotelFacilities.map((facility) => (
        <label
          key={facility}
          className="flex cursor-pointer items-center space-x-2 py-1"
        >
          <input
            type="checkbox"
            className="text-primary focus:ring-primary rounded border-gray-300"
            value={facility}
            checked={selectedFacilities.includes(facility)}
            onChange={onChange}
          />
          <span className="text-foreground text-sm">{facility}</span>
        </label>
      ))}
    </div>
  );
}
