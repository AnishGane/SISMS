import { Grid, Plus, Search, Table2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface SearchBarProps {
  search: string;
  category: string;
  layout: string;
  categories: string[];
  onSearch: (q: string) => void;
  onCategoryChange: (cat: string) => void;
  onLayoutChange: (layout: 'grid' | 'table') => void;
  onSortChange: (sort: 'recent' | 'oldest' | 'price') => void;
  sort: 'recent' | 'oldest' | 'price';
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  category,
  categories,
  layout,
  onSearch,
  onCategoryChange,
  onLayoutChange,
  onSortChange,
  sort,
}) => {
  return (
    <div className="bg-base-100 ring-base-300 flex flex-col gap-3 rounded-md p-1 shadow-md ring md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-4xl">
        <input
          type="text"
          title="Search products by name"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search products by name"
          className="bg-base-200 focus:ring-neutral-content/60 w-full rounded-sm border-none px-3 py-2 shadow-sm outline-none focus:ring"
        />
        <Search className="text-base-content pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
      </div>

      <div className="flex items-center gap-8">
        <div>
          <Link to={'/admin/products/new'}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              title="Add New Product"
              className="cursor-pointer rounded-full bg-[#ff7477] p-1 text-white"
            >
              <Plus />
            </motion.div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            title="Grid Layout"
            onClick={() => onLayoutChange('grid')}
            className={`cursor-pointer rounded-md p-1 transition-colors duration-200 ${
              layout === 'grid'
                ? 'bg-[#FF7477] text-white'
                : 'ring ring-neutral-400 hover:bg-black/5'
            }`}
          >
            <Grid />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            title="Table Layout"
            onClick={() => onLayoutChange('table')}
            className={`cursor-pointer rounded-md p-1 transition-colors duration-200 ${
              layout === 'table'
                ? 'bg-[#FF7477] text-white'
                : 'ring ring-neutral-400 hover:bg-black/5'
            }`}
          >
            <Table2 />
          </motion.button>

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="select select-bordered capitalize outline-none"
          >
            <div className="max-h-40 overflow-y-auto">
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </div>
          </select>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="select select-bordered capitalize outline-none"
          >
            <option value="recent">Sort by Recent</option>
            <option value="oldest">Sort by Oldest</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
