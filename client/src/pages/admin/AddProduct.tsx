import { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

interface SupplierData {
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  notes: string;
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  cost: string;
  unit: string;
  stock: string;
  reorderLevel: string;
  leadTimeDays: string;
  location: string;
  avgDailySales: string;
  supplier: SupplierData;
}

const AddProduct = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: '',
    cost: '',
    unit: 'pcs',
    stock: '0',
    reorderLevel: '10',
    leadTimeDays: '7',
    location: '',
    avgDailySales: '0',
    supplier: {
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      notes: '',
    },
  });

  const [images, setImages] = useState<{
    image1: File | null;
    image2: File | null;
    image3: File | null;
    image4: File | null;
  }>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImages((prev) => ({
        ...prev,
        [imageKey]: file,
      }));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.price || isNaN(Number(formData.price))) {
        throw new Error('Valid price is required');
      }
      if (!formData.cost || isNaN(Number(formData.cost))) {
        throw new Error('Valid cost is required');
      }
      if (!images.image1) {
        throw new Error('At least one product image is required');
      }

      // Create FormData object
      const data = new FormData();

      // Add text fields
      data.append('name', formData.name.trim());
      data.append('category', formData.category.trim());
      data.append('description', formData.description.trim());
      data.append('price', formData.price);
      data.append('cost', formData.cost);
      data.append('unit', formData.unit);
      data.append('stock', formData.stock);
      data.append('reorderLevel', formData.reorderLevel);
      data.append('leadTimeDays', formData.leadTimeDays);
      data.append('location', formData.location.trim());
      data.append('avgDailySales', formData.avgDailySales);

      // Add supplier as JSON string (only if supplier name is provided)
      if (formData.supplier.name.trim()) {
        data.append(
          'supplier',
          JSON.stringify({
            name: formData.supplier.name.trim(),
            phone: formData.supplier.phone.trim(),
            email: formData.supplier.email.trim(),
            address: formData.supplier.address.trim(),
            contactPerson: formData.supplier.contactPerson.trim(),
            notes: formData.supplier.notes.trim(),
          })
        );
      }

      // Add images
      if (images.image1) data.append('image1', images.image1);
      if (images.image2) data.append('image2', images.image2);
      if (images.image3) data.append('image3', images.image3);
      if (images.image4) data.append('image4', images.image4);

      console.log('Submitting product data...');

      // Make API request
      const response = await axiosInstance.post(API_PATHS.ADMIN.PRODUCT.CREATE_PRODUCT, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // If using cookies for auth
      });

      console.log('Response:', response.data);

      setSuccess('Product created successfully!');

      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        cost: '',
        unit: 'pcs',
        stock: '0',
        reorderLevel: '10',
        leadTimeDays: '7',
        location: '',
        avgDailySales: '0',
        supplier: {
          name: '',
          phone: '',
          email: '',
          address: '',
          contactPerson: '',
          notes: '',
        },
      });
      setImages({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });
    } catch (err: any) {
      console.error('Error creating product:', err);
      console.error('Error response:', err.response?.data);

      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to create product. Please try again.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-bold">Add New Product</h1>

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Pricing</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Cost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="ltr">Liters</option>
                <option value="box">Box</option>
                <option value="pack">Pack</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Inventory</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Lead Time (Days)</label>
              <input
                type="number"
                name="leadTimeDays"
                value={formData.leadTimeDays}
                onChange={handleInputChange}
                min="0"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Rack A2"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Avg Daily Sales</label>
              <input
                type="number"
                name="avgDailySales"
                value={formData.avgDailySales}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Supplier Information */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Supplier Information (Optional)</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Supplier Name</label>
              <input
                type="text"
                name="name"
                value={formData.supplier.name}
                onChange={handleSupplierChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.supplier.phone}
                onChange={handleSupplierChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.supplier.email}
                onChange={handleSupplierChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.supplier.contactPerson}
                onChange={handleSupplierChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.supplier.address}
                onChange={handleSupplierChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.supplier.notes}
                onChange={handleSupplierChange}
                rows={2}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Product Images <span className="text-red-500">*</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['image1', 'image2', 'image3', 'image4'].map((imageKey, index) => (
              <div key={imageKey}>
                <label className="mb-1 block text-sm font-medium">
                  Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, imageKey)}
                  className="w-full text-sm"
                  required={index === 0}
                />
                {images[imageKey as keyof typeof images] && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ {images[imageKey as keyof typeof images]?.name}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Max size: 5MB per image. At least one image required.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border px-6 py-2 hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
