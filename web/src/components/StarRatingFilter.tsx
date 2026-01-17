type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function StarRatingFilter({ selectedStars, onChange }: Props) {
  return (
    <div className="border-border border-b pb-5">
      <h4 className="text-md mb-2 font-semibold">Property Rating</h4>
      {["5", "4", "3", "2", "1"].map((star) => (
        <label
          key={star}
          className="flex cursor-pointer items-center space-x-2 py-1"
        >
          <input
            type="checkbox"
            className="text-primary focus:ring-primary rounded border-gray-300"
            value={star}
            checked={selectedStars.includes(star)}
            onChange={onChange}
          />
          <span className="text-foreground text-sm">{star} Stars</span>
        </label>
      ))}
    </div>
  );
}
