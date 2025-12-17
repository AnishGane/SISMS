import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ThemeSelection from '../../components/ThemeSelection';
import { User, Store, Bell, Shield, Save, Pen, X, Trash2 } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/admin/ManageStaff/ConfirmModal';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [form, setForm] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    storeName: '',
    storeAddress: '',
    storeCurrency: 'NPR',
    timezone: 'Asia/Kathmandu',
    isNotificationEnabled: false,
  });
  const { loading, setLoading, confirmConfig, setConfirmConfig } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const fetchUserSettingData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.ADMIN.SETTING.GET_SETTING);
      setLoading(false);
      setForm(res.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.put(API_PATHS.ADMIN.SETTING.UPDATE_SETTING(form._id), form);
      setForm(res.data.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setConfirmConfig({
      title: 'Delete Staff',
      message: `Delete this account? This cannot be undone.`,
      confirmText: 'Delete',
      action: async () => {
        await axiosInstance.delete(API_PATHS.ADMIN.SETTING.DELETE_SETTING(form._id));
        setConfirmConfig(null);
        toast.success('Account deleted successfully');
      },
    });
  };

  useEffect(() => {
    fetchUserSettingData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin Settings</h1>
        <p className="text-sm text-gray-500">Manage your account, store and system preferences</p>
      </div>

      {/* Theme Settings */}
      <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Shield size={18} />
          <h2 className="font-medium">Appearance</h2>
        </div>
        <ThemeSelection />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <User size={18} />
            <h2 className="font-medium">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              Name
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="name"
                value={form.name}
                readOnly
                placeholder="Full Name"
                onChange={handleChange}
              />{' '}
            </div>
            <div className="flex flex-col">
              Email
              <input
                className="input input-bordered mt-1.5"
                name="email"
                value={form.email}
                placeholder="Email Address"
                readOnly={!isEditing}
                disabled
              />
            </div>
            <div className="flex flex-col">
              Contact Number
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="phone"
                value={form.phone}
                placeholder="Phone Number"
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Store Settings */}
        <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Store size={18} />
            <h2 className="font-medium">Store Settings</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              Store Name
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="storeName"
                placeholder="Store Name"
                readOnly={!isEditing}
                value={form.storeName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              Store Address
              <input
                className="input input-bordered mt-1.5 outline-none"
                name="storeAddress"
                placeholder="Store Address"
                readOnly={!isEditing}
                value={form.storeAddress}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              Store Currency
              <select
                className="select select-bordered mt-1.5 outline-none"
                name="storeCurrency"
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="NPR">NPR (Rs)</option>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="flex flex-col">
              Timezone
              <select
                className="select select-bordered mt-1.5 outline-none"
                name="timezone"
                onChange={(e) => handleChange(e)}
                disabled={!isEditing}
              >
                <option value="Asia/Kathmandu">Asia/Kathmandu</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-base-200 mt-6 space-y-4 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Bell size={18} />
          <h2 className="font-medium">Notifications</h2>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            name="isNotificationEnabled"
            checked={form.isNotificationEnabled}
            onChange={handleChange}
          />
          <span className="text-sm">Enable low stock alerts</span>
        </label>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <Button title="Delete account" className="btn btn-error btn-outline" onClick={handleDelete}>
          <Trash2 size={18} />
          Delete Account
        </Button>

        {!isEditing ? (
          <Button title="Edit" className="btn btn-primary px-3" onClick={() => setIsEditing(true)}>
            <Pen size={18} />
            <span>Edit</span>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <Button title="Save" className="btn border-error border shadow-sm" onClick={handleUpdate}>
              <X size={18} />
              <span>Cancel</span>
            </Button>
            <Button title="Save" className="btn btn-success" onClick={handleUpdate}>
              <Save size={18} />
              <span>Save</span>
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
