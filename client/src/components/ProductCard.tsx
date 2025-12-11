import { ImageDown, ImageOff } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Supplier {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image?: string;
  price: number;
  stock: number;
  isActive: boolean;
  unit: string;
}

interface ProductCardProps {
  product: Product;
  layout: 'grid' | 'table';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout }) => {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:scale-[1.005] hover:shadow-md ${
        layout === 'grid'
          ? 'flex flex-col items-center text-center'
          : 'flex items-center justify-between'
      }`}
    >
      {/* Product Image */}
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className={`object-cover ${
            layout === 'grid' ? 'mb-3 h-32 w-32 rounded-t-lg' : 'mr-4 h-20 w-20 rounded-l-lg'
          }`}
        />
      ) : (
        <div
          className={`flex items-center justify-center bg-gray-300 ${
            layout === 'grid' ? 'mb-3 h-55 w-full rounded-t-lg' : 'mr-4 h-40 w-40 rounded-l-lg'
          }`}
        >
          <ImageOff className="size-12 text-gray-400" />
        </div>
      )}

      {/* Product Info */}
      <div className={`w-full px-3.5 ${layout === 'grid' ? '' : 'flex-1'}`}>
        <p className="text-xs text-gray-500">{product.category}</p>
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{product.description}</p>

        {layout === 'table' && (
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
            <span>Price: ₹{product.price}</span>
            <span>
              Stock: {product.stock} {product.unit}
            </span>
            <span>SKU: {product.sku}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {layout === 'grid' && (
        <div className="mt-2 flex w-full items-center justify-between px-3.5 py-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
          <Link to={`/admin/products/${product._id}`}>
            <button className="text-sm text-gray-600">View Details</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
