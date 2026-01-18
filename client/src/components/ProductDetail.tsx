import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import AdminLayout from '../layouts/AdminLayout';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';
import ConfirmModal from './admin/ManageStaff/ConfirmModal';
import type { IProduct } from '../types/admin';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const {confirmConfig, setConfirmConfig} = useAdmin();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.ADMIN.PRODUCT.GET_EACH_PRODUCT(id));
        const p = res.data.data as IProduct;

        setProduct(p);
        setSelectedImage(Array.isArray(p.image) && p.image.length > 0 ? p.image[0] : '');
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found.</p>;

  const thumbnails = product.image && product.image.length > 0 ? product.image : [];


  const delete_product = async () => {
    setConfirmConfig({
      title: "Delete Product?",
      message: `Delete the product ${product.name}? This action cannot be undone.`,
      confirmText: "Delete",
      action: async ()=>{
        try {
          await axiosInstance.delete(API_PATHS.ADMIN.PRODUCT.DELETE_PRODUCT(product._id));
          setConfirmConfig(null);
          toast.success("Product deleted successfully");
          navigate("/admin/products");
        } catch (error) {
          console.error("Error deleting product:", error);
          toast.error("Failed to delete product");
          setConfirmConfig(null);
        }
      }
    })
  };

  return (
    <AdminLayout>
        <ConfirmModal
        open={!!confirmConfig}
        title={confirmConfig?.title || ''}
        message={confirmConfig?.message || ''}
        confirmText={confirmConfig?.confirmText}
        onCancel={() => setConfirmConfig(null)}
        onConfirm={confirmConfig?.action || (() => {})}
      />
      <div>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex cursor-pointer items-center gap-0.5 text-sm"
        >
          <ArrowLeft size={16} />
          <div className="group leading-4">
            <p>Back</p>
            <hr className="w-0 transition-all duration-200 group-hover:w-full" />
          </div>
        </button>
        <h1 className="mb-6 text-2xl font-medium">Product Details</h1>

        {/* ---------- TOP CONTENT: IMAGE LEFT + DETAILS RIGHT ---------- */}
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* LEFT: IMAGES */}
          <div className="lg:w-[40%]">
            {/* BIG MAIN IMAGE */}
            <div className="mb-3 h-96 w-full overflow-hidden rounded-lg bg-gray-200">
              {selectedImage ? (
                <img src={selectedImage} alt="Product" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3">
              {thumbnails.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 w-20 cursor-pointer rounded-md border-2 object-cover ${
                    selectedImage === img ? 'border-base-content' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFORMATION */}
          <div className="space-y-2 lg:w-1/2">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>

            <div className="text-lg font-semibold">Rs. {product.price}</div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock} {product.unit}
              </p>
              <p>
                <strong>Cost Price:</strong> Rs. {product.cost}
              </p>
              <p>
                <strong>Reorder Level:</strong> {product.reorderLevel}
              </p>
              <p>
                <strong>Lead Time:</strong> {product.leadTimeDays} days
              </p>
              <p>
                <strong>Location:</strong> {product.location || 'N/A'}
              </p>
              <p>
                <strong>Avg Daily Sales:</strong> {product.avgDailySales || 'N/A'}
              </p>
              <p>
                <strong>Last Reorder:</strong>{' '}
                {product.lastReorderDate ? new Date(product.lastReorderDate).toDateString() : 'N/A'}
              </p>

              {product.metadata && Object.keys(product.metadata).length > 0 && (
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Metadata</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    {Object.entries(product.metadata).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong>{' '}
                        {Array.isArray(value) ? value.join(', ') : value?.toString() || 'N/A'}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-8">

            {product.stock <= product.reorderLevel && (
              <button className='btn btn-primary rounded-sm font-normal cursor-pointer'>Reorder product</button>
            )}
            <button onClick={delete_product} className='btn bg-red-500 p-3 rounded-sm font-normal cursor-pointer' title='Delete product'><Trash2 size={20} /></button>
            </div>
          </div>
        </div>

        {/* ------------------ SUPPLIER INFORMATION ------------------ */}
        <div className="bg-base-200 mt-10 rounded-lg p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Supplier Information</h2>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <strong>Name:</strong> {product.supplier?.name || 'N/A'}
            </p>
            <p>
              <strong>Phone:</strong> {product.supplier?.phone || 'N/A'}
            </p>
            <p>
              <strong>Email:</strong> {product.supplier?.email || 'N/A'}
            </p>
            <p>
              <strong>Address:</strong> {product.supplier?.address || 'N/A'}
            </p>
            <p>
              <strong>Contact Person:</strong> {product.supplier?.contactPerson || 'N/A'}
            </p>
            <p>
              <strong>Notes:</strong> {product.supplier?.notes || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductDetail;
