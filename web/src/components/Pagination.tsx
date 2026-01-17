type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pages, onPageChange }: Props) {
  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center">
      <ul className="border-border flex overflow-hidden rounded-lg border">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`border-border hover:bg-muted cursor-pointer border-r px-3 py-2 last:border-r-0 ${
              page === number
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background"
            }`}
          >
            <button
              onClick={() => onPageChange(number)}
              className="h-full w-full text-sm font-medium focus:outline-none"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
