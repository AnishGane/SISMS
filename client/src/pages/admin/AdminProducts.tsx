import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import SearchBar from '../../components/SearchBar';
import AdminLayout from '../../layouts/AdminLayout';
import ProductCard from '../../components/ProductCard';
import { useDebounce } from '../../hooks/useDebounce';
import { API_PATHS } from '../../utils/apiPath';
import ProductCardSkeleton from '../../components/ui/skeletons/ProductCardSkeleton';

type SortType = 'recent' | 'oldest' | 'price';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [params, setParams] = useSearchParams();
  const initialSearch = params.get('search') || '';
  const initialCategory = params.get('category') || 'all';

  // Local state to control the inputs immediately
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  // For Sorting products
  const [sort, setSort] = useState<SortType>('recent');

  const handleSortProduct = (value: SortType) => {
    setSort(value);
  };

  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (sort) {
      case 'recent':
        return list.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case 'oldest':
        return list.sort(
          (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case 'price':
        return list.sort((a: any, b: any) => a.price - b.price);

      default:
        return list;
    }
  }, [products, sort]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.ADMIN.PRODUCT.GET_CATEGORIES);

        const cats = res.data.data
          .map((c: any) => c._id)
          .filter((c: string) => typeof c === 'string' && c.trim() !== '');

        setCategories(cats);
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    };

    fetchCategories();
  }, []);

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

  const getSkeletonCount = (layout: 'grid' | 'table') => {
    return layout === 'grid' ? 12 : 6;
  };

  return (
    <AdminLayout>
      <SearchBar
        search={search}
        category={category}
        categories={categories}
        onSearch={(value) => setSearch(value)}
        onCategoryChange={(value) => setCategory(value)}
        layout={layout}
        onLayoutChange={setLayout}
        onSortChange={handleSortProduct}
        sort={sort}
      />

      {loading ? (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-4'
              : 'flex flex-col gap-2 p-4'
          }
        >
          {Array.from({ length: getSkeletonCount(layout) }).map((_, i) => (
            <ProductCardSkeleton key={i} layout={layout} />
          ))}
        </div>
      ) : products.length === 0 ? null : (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-4'
              : 'flex flex-col gap-2 p-4'
          }
        >
          {sortedProducts.map((p: any) => (
            <ProductCard key={p._id} product={p} layout={layout} />
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
