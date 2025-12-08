import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import SearchBar from '../../components/SearchBar';
import AdminLayout from '../../layouts/AdminLayout';
import ProductCard from '../../components/ProductCard';
import { useDebounce } from '../../hooks/useDebounce';
import { API_PATHS } from '../../utils/apiPath';

const categories = ['Clothing', 'Electronics', 'Cosmetics', 'Stationery'];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useSearchParams();
  const initialSearch = params.get('search') || '';
  const initialCategory = params.get('category') || 'all';

  // Local state to control the inputs immediately
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  /** Fetch products from API */
  const fetchProducts = async (query: string, cat: string) => {
    setLoading(true);
    try {
      const trimmedQuery = query.trim();
      const hasSearch = Boolean(trimmedQuery);

      const apiParams: any = {};
      if (hasSearch) apiParams.search = trimmedQuery;
      if (cat !== 'all') apiParams.category = cat;

      // Only hit the search endpoint when a search term is present.
      // Category-only filtering uses the general products endpoint.
      const url = hasSearch
        ? API_PATHS.ADMIN.PRODUCT.SEARCH_PRODUCTS
        : API_PATHS.ADMIN.PRODUCT.GET_PRODUCTS;
      const res = await axiosInstance.get(url, { params: apiParams });
      setProducts(res.data?.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /** Debounced fetch */
  const debouncedFetch = useDebounce((q, c) => fetchProducts(q, c), 400);

  /** Sync URL params when search or category changes */
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (search.trim()) newParams.set('search', search);
    if (category !== 'all') newParams.set('category', category);
    setParams(newParams);

    debouncedFetch(search, category);
  }, [search, category]);

  return (
    <AdminLayout>
      <SearchBar
        search={search}
        category={category}
        categories={categories}
        onSearch={(value) => setSearch(value)}
        onCategoryChange={(value) => setCategory(value)}
        onLayoutChange={setLayout}
      />

      {loading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No products found</div>
      ) : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3'
              : 'flex flex-col gap-2 p-4'
          }
        >
          {products.map((p: any) => (
            <ProductCard key={p._id} product={p} layout={layout} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
