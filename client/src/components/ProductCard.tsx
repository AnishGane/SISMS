import { ImageOff } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image?: string[]; // array of images
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
  const mainImage = product.image && product.image.length > 0 ? product.image[0] : null;

  return (
    <div
      className={`card bg-base-200 rounded-md shadow-md transition-all hover:shadow-lg ${layout === 'grid' ? 'w-full text-center' : 'flex flex-row items-center rounded-md px-1.5'
        }`}
    >
      {/* ------ IMAGE SECTION ------ */}
      {mainImage ? (
        <figure
          className={`overflow-hidden ${layout === 'grid' ? 'h-56 w-full rounded-t-xl' : 'mr-4 h-32 w-32 rounded-lg'
            }`}
        >
          <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
        </figure>
      ) : (
        <div
          className={`bg-base-300 text-base-content/40 flex items-center justify-center ${layout === 'grid' ? 'h-56 w-full rounded-t-xl' : 'mr-4 h-32 w-32 rounded-lg'
            }`}
        >
          <ImageOff className="h-10 w-10" />
        </div>
      )}

      {/* ------ PRODUCT DETAILS ------ */}
      <Link
        to={`${layout === 'table' ? `/admin/products/${product._id}` : ''}`}
        className="hidden md:block"
      >
        <div
          className={`card-body p-4 text-left ${layout === 'table' ? 'flex-1 cursor-pointer' : ''}`}
        >
          <p className="text-xs opacity-60">{product.category}</p>
          <h2 className="card-title text-lg">{product.name}</h2>
          <p className="line-clamp-2 text-sm opacity-80">{product.description}</p>
          {layout === 'table' && (
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <span>Price: ₹{product.price}</span>
              <span>
                Stock: {product.stock} {product.unit}
              </span>
              <span>SKU: {product.sku}</span>
            </div>
          )}
          {/* ------ GRID ONLY: STOCK + BUTTON ------ */}
          {layout === 'grid' && (
            <div className="mt-3 flex items-center justify-between">
              <p className="text-neutral-500">
                Available in Stock: <span className="font-semibold">{product.stock}</span>
              </p>

              <Link to={`/admin/products/${product._id}`}>
                <div className="text-base-content  group cursor-pointer leading-4">
                  <p>View Details</p>
                  <hr className="w-0 transition-all duration-200 group-hover:w-full" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
