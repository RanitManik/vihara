import { Slider } from "@/components/ui/slider";

type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const MIN_PRICE = 2500;
const MAX_PRICE = 30000;
const STEP = 500;

export function PriceFilter({ selectedPrice, onChange }: Props) {
  const sliderValue = selectedPrice ?? MAX_PRICE;

  return (
    <div className="border-border/70 space-y-3 border-b pb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-heading text-xl leading-none font-semibold">
            Max nightly budget
          </h4>
          <p className="text-muted-foreground mt-1 text-xs">
            Use the slider to cap the price range.
          </p>
        </div>
        <div className="bg-secondary rounded-full px-3 py-2 text-sm font-semibold">
          ₹{sliderValue.toLocaleString("en-IN")}
        </div>
      </div>

      <Slider
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={STEP}
        value={[sliderValue]}
        onValueChange={([value]) => onChange(value)}
      />

      <div className="text-muted-foreground flex justify-between text-xs font-medium">
        <span>₹{MIN_PRICE.toLocaleString("en-IN")}</span>
        <span>₹{MAX_PRICE.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
