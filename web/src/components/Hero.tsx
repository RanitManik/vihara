import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-8 px-4 py-24 pb-32 text-center md:pb-48 lg:py-32">
      {/* Background Gradient/Image Placeholder */}
      <div className="absolute inset-0 -z-10 bg-slate-950">
        {/* You would typically use an Image component here with object-cover */}
        <div className="from-primary/20 via-background to-background absolute inset-0 bg-gradient-to-tr opacity-40"></div>
        <div className="absolute inset-0 bg-[url('/assets/hero-pattern.svg')] opacity-10"></div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Find your next <span className="text-primary">stay</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-[700px] text-lg sm:text-xl">
          Search low prices on hotels for your dream vacation...
        </p>
      </div>

      <div className="mt-8 w-full max-w-5xl">
        <SearchBar />
      </div>
    </div>
  );
}
