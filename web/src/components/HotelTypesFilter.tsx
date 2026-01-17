import { hotelTypes } from "@/lib/hotel-options";

type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function HotelTypesFilter({ selectedHotelTypes, onChange }: Props) {
  return (
    <div className="border-border border-b pb-5">
      <h4 className="text-md mb-2 font-semibold">Hotel Type</h4>
      {hotelTypes.map((type) => (
        <label
          key={type}
          className="flex cursor-pointer items-center space-x-2 py-1"
        >
          <input
            type="checkbox"
            className="text-primary focus:ring-primary rounded border-gray-300"
            value={type}
            checked={selectedHotelTypes.includes(type)}
            onChange={onChange}
          />
          <span className="text-foreground text-sm">{type}</span>
        </label>
      ))}
    </div>
  );
}
