interface SearchBarProps {
  search: string;
  category: string;
  categories: string[];
  onSearch: (q: string) => void;
  onCategoryChange: (cat: string) => void;
  onLayoutChange: (layout: 'grid' | 'table') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  category,
  categories,
  onSearch,
  onCategoryChange,
  onLayoutChange,
}) => {
  return (
    <div className="bg-base-100 flex flex-col gap-3 rounded-md p-2 shadow-sm ring ring-neutral-200 md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full max-w-4xl rounded-md border px-3 py-2 shadow-sm focus:ring"
      />

      <div className="flex items-center gap-2">
        <button onClick={() => onLayoutChange('grid')} className="rounded-md border px-3 py-1">
          Grid
        </button>

        <button onClick={() => onLayoutChange('table')} className="rounded-md border px-3 py-1">
          Table
        </button>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-md border px-3 py-2 shadow-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
