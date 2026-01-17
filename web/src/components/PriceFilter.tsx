type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

export function PriceFilter({ selectedPrice, onChange }: Props) {
  return (
    <div>
      <h4 className="text-md mb-2 font-semibold">Max Price</h4>
      <select
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined,
          )
        }
      >
        <option value="">Select Max Price</option>
        {[50, 100, 200, 300, 500, 1000, 2000].map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  );
}
