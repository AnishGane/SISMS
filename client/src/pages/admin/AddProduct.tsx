import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Trash } from 'lucide-react';

interface SupplierData {
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  notes: string;
}

type ImageKey = 'image1' | 'image2' | 'image3' | 'image4';
interface ProductMetadata {
  key: string; // e.g., "Color / Colors"
  value: string; // e.g., "Black / Black,Red"
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
    supplier: {
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      notes: '',
    },
  });

  const [images, setImages] = useState<Record<ImageKey, File | null>>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  // Metadata Dynamic Fields
  const [metadata, setMetadata] = useState<ProductMetadata[]>([{ key: '', value: '' }]);

  const handleMetadataChange = (index: number, field: 'key' | 'value', value: string) => {
    setMetadata((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addMetadataField = () => {
    setMetadata((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadata((prev) => prev.filter((_, i) => i !== index));
  };

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

      // Converting the array of metadata objects into a single object
      const metadataObject: Record<string, any> = {};

      metadata.forEach((item) => {
        if (item.key.trim() !== '') {
          // if value contains commas, store as array
          metadataObject[item.key] = item.value.includes(',')
            ? item.value.split(',').map((v) => v.trim())
            : item.value;
        }
      });
      data.append('metadata', JSON.stringify(metadataObject));

      console.log('Submitting product data...');

      // Make API request
      const response = await axiosInstance.post(API_PATHS.ADMIN.PRODUCT.CREATE_PRODUCT, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
      setMetadata([]);
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
      <h1 className="mb-6 text-2xl font-medium">Add New Product</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-4">
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add_form space-y-6">
        {/* Basic Information */}
        <div className="card bg-base-200 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Product Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-bordered w-full rounded-sm outline-none"
                required
                placeholder="Wireless Mac Keyboard"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">
                Category<span className="text-error"> *</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input input-bordered w-full rounded-sm outline-none"
                required
                placeholder="Electronics"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium">
                Description<span className="text-error"> *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full rounded-sm outline-none"
                placeholder="Description here"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-base-200 rounded-lg p-6 shadow">
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
                className="input input-bordered w-full rounded-sm outline-none"
                required
                placeholder="99.99"
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
                className="input input-bordered w-full rounded-sm outline-none"
                required
                placeholder="99.99"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="select select-bordered w-full rounded-sm outline-none"
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Inventory */}
          <div className="bg-base-200 rounded-lg p-6 shadow">
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
                  className="input input-bordered w-full rounded-sm outline-none"
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
                  className="input input-bordered w-full rounded-sm outline-none"
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
                  className="input input-bordered w-full rounded-sm outline-none"
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
                  className="input input-bordered w-full rounded-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Product Metadata */}
          <div className="bg-base-200 rounded-lg p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Product Metadata <span className="text-base font-normal">(Optional)</span>
            </h2>

            {metadata.map((meta, index) => (
              <div
                key={index}
                className="mb-4 flex flex-col gap-4 rounded-lg md:flex-row md:items-end"
              >
                {/* Name */}
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={meta.key}
                    onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                    placeholder="e.g., Color"
                    className="input input-bordered w-full outline-none"
                  />
                </div>

                {/* Value */}
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Value</label>
                  <input
                    type="text"
                    value={meta.value}
                    onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                    placeholder="e.g., Black"
                    className="input input-bordered w-full outline-none"
                  />
                </div>

                {/* Remove Button */}
                {metadata.length > 1 && (
                  <div className="flex justify-end md:w-24">
                    <button
                      type="button"
                      onClick={() => removeMetadataField(index)}
                      className="btn btn-error btn-sm mb-1 w-full md:w-auto"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Another */}
            <button
              type="button"
              onClick={addMetadataField}
              className="btn btn-neutral btn-sm mt-2 py-5"
            >
              + Add Another
            </button>
          </div>
        </div>

        {/* Supplier Information */}
        <div className="bg-base-200 rounded-lg p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Supplier Information <span className="text-base font-normal">(Optional)</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Supplier Name</label>
              <input
                type="text"
                name="name"
                value={formData.supplier.name}
                onChange={handleSupplierChange}
                className="input input-bordered w-full rounded-sm outline-none"
                placeholder="Supplier Name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.supplier.phone}
                onChange={handleSupplierChange}
                className="input input-bordered w-full rounded-sm outline-none"
                placeholder="Phone Number"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.supplier.email}
                onChange={handleSupplierChange}
                className="input input-bordered w-full rounded-sm outline-none"
                placeholder="Email Address"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.supplier.contactPerson}
                onChange={handleSupplierChange}
                className="input input-bordered w-full rounded-sm outline-none"
                placeholder="Contact Person"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.supplier.address}
                onChange={handleSupplierChange}
                className="input input-bordered w-full rounded-sm outline-none"
                placeholder="Address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.supplier.notes}
                onChange={handleSupplierChange}
                rows={4}
                className="input input-bordered w-full resize-none rounded-sm pt-1 outline-none"
                placeholder="Notes"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="card bg-base-100 p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Product Images <span className="text-error">*</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(['image1', 'image2', 'image3', 'image4'] as ImageKey[]).map((imageKey, idx) => (
              <div key={imageKey} className="space-y-1">
                <label className="label">
                  <span className="label-text">
                    Image {idx + 1} {idx === 0 && <span className="text-error">*</span>}
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, imageKey)}
                  className="file-input file-input-bordered file-input-primary w-full"
                  required={idx === 0}
                />

                {images[imageKey] && (
                  <p className="text-success mt-1 text-xs">✓ {images[imageKey]?.name}</p>
                )}
              </div>
            ))}
          </div>

          <p className="text-base-content/70 mt-2 text-xs">Max size: 5MB per image.</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-outline rounded-md"
            disabled={loading}
          >
            Cancel
          </button>

          <button type="submit" disabled={loading} className="btn btn-primary rounded-md">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
