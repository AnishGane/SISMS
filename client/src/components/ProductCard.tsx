import React from "react";

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
  layout: "grid" | "table";
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout }) => {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:scale-[1.02] overflow-hidden ${
        layout === "grid"
          ? "flex flex-col items-center text-center p-4"
          : "flex items-center justify-between p-4"
      }`}
    >
      {/* Product Image */}
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className={`rounded-lg object-cover ${
          layout === "grid" ? "w-32 h-32 mb-3" : "w-20 h-20 mr-4"
        }`}
      />

      {/* Product Info */}
      <div className={`${layout === "grid" ? "" : "flex-1"}`}>
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-1 text-gray-600 text-sm truncate">{product.description}</p>

        {layout === "table" && (
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
            <span>Price: ₹{product.price}</span>
            <span>Stock: {product.stock} {product.unit}</span>
            <span>SKU: {product.sku}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {layout === "grid" && (
        <span
          className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${
            product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      )}
    </div>
  );
};

export default ProductCard;
