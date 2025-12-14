import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Edit2, Trash2, User2, UserCheck, UserX } from 'lucide-react';
import StaffFormModal from '../../components/admin/ManageStaff/StaffFormModal';
import ConfirmModal from '../../components/admin/ManageStaff/ConfirmModal';

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatar?: string;
}

const ManageStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    avatar: '',
  });

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    confirmText: string;
    action: () => Promise<void> | void;
  } | null>(null);

  const openEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setForm({
      name: staff.name,
      email: staff.email,
      password: '', // Password is empty for edit, user can update if needed
      phone: staff.phone || '',
      avatar: staff.avatar || '',
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setSelectedStaff(null);
    setForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      avatar: '',
    });
    setShowModal(true);
  };

  const toggleStatus = (staff: Staff) => {
    setConfirmConfig({
      title: staff.isActive ? 'Deactivate Staff' : 'Activate Staff',
      message: staff.isActive
        ? `Are you sure you want to deactivate ${staff.name}? They will no longer be able to log in.`
        : `Do you want to activate ${staff.name}? They will regain access.`,
      confirmText: staff.isActive ? 'Deactivate' : 'Activate',
      action: async () => {
        await axiosInstance.patch(API_PATHS.ADMIN.STAFF.TOGGLE_STATUS(staff._id));
        setConfirmConfig(null);
        fetchStaff();
      },
    });
  };

  const deleteStaff = (staff: Staff) => {
    setConfirmConfig({
      title: 'Delete Staff',
      message: `Are you sure you want to permanently delete ${staff.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      action: async () => {
        await axiosInstance.delete(API_PATHS.ADMIN.STAFF.DELETE_STAFF(staff._id));
        setConfirmConfig(null);
        fetchStaff();
      },
    });
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.ADMIN.STAFF.GET_STAFFS);
      setStaff(res.data.staff || []);
    } catch (err) {
      console.error('Failed to fetch staff', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await axiosInstance.post(API_PATHS.ADMIN.STAFF.CREATE_STAFF, form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', phone: '', avatar: '' });
      setError(null);
      await fetchStaff();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to create staff. Please try again.';
      setError(errorMessage);
      console.error('Create staff failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStaff) return;

    setError(null);
    setSubmitting(true);
    try {
      await axiosInstance.put(API_PATHS.ADMIN.STAFF.UPDATE_STAFF(selectedStaff._id), form);
      setShowModal(false);
      setSelectedStaff(null);
      setForm({ name: '', email: '', password: '', phone: '', avatar: '' });
      setError(null);
      await fetchStaff();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update staff. Please try again.';
      setError(errorMessage);
      console.error('Update staff failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <StaffFormModal
        open={showModal}
        title={selectedStaff ? 'Edit Staff' : 'Add Staff'}
        isEdit={!!selectedStaff}
        submitting={submitting}
        error={error}
        form={form}
        onChange={handleChange}
        onClose={() => {
          setShowModal(false);
          setSelectedStaff(null);
        }}
        onSubmit={selectedStaff ? handleEdit : handleCreateStaff}
      />

      <ConfirmModal
        open={!!confirmConfig}
        title={confirmConfig?.title || ''}
        message={confirmConfig?.message || ''}
        confirmText={confirmConfig?.confirmText}
        onCancel={() => setConfirmConfig(null)}
        onConfirm={confirmConfig?.action || (() => {})}
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Manage Staff</h1>
          <p className="text-[13px] text-gray-500">Create and manage staff accounts</p>
        </div>

        <button className="btn bg-neutral rounded-md font-medium" onClick={openAdd}>
          + Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table-zebra table border overflow-hidden border-neutral rounded-md">
              <thead>
                <tr className="text-neutral-content bg-base-300 ">
                  <th>Profile Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center">
                      No staff found
                    </td>
                  </tr>
                ) : (
                  staff.map((s) => (
                    <tr className="group" key={s._id}>
                      <td>
                        {s.avatar ? (
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="size-8 rounded-full object-cover"
                          />
                        ) : (
                          <User2 className="bg-base-300 size-8 rounded-full p-1 text-neutral-500 shadow-sm" />
                        )}
                      </td>
                      <td className="w-[30%]">{s.name}</td>
                      <td className="w-[25%]">{s.email}</td>
                      <td>{s.phone || '-'}</td>
                      <td>
                        <span
                          className={`badge rounded-full text-xs ${s.isActive ? 'badge-success' : 'badge-error'}`}
                        >
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="flex items-center justify-center gap-1 group-hover:cursor-pointer">
                        <Button title="Edit staff" onClick={() => openEdit(s)}>
                          <Edit2 size={17} />
                        </Button>

                        <Button
                          title={'Toggle ' + (s.isActive ? 'Deactivate' : 'Activate')}
                          onClick={() => toggleStatus(s)}
                        >
                          {s.isActive ? (
                            <UserX className="text-warning" size={17} />
                          ) : (
                            <UserCheck size={17} className="text-success" />
                          )}
                        </Button>

                        <Button title="Delete staff" onClick={() => deleteStaff(s)}>
                          <Trash2 size={17} className="text-error" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const Button = ({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => Promise<void> | void;
}) => {
  return (
    <button
      className={
        'hover:bg-neutral/60 btn btn-sm scale-90 rounded-full p-2 opacity-0 transition-opacity duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100'
      }
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ManageStaff;
