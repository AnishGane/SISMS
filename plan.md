<!-- import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Edit2, Trash2, User2, UserCheck, UserX } from 'lucide-react';
import StaffFormModal from './StaffFormModal';
import ConfirmModal from './ConfirmModal';

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

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

  const toggleStatus = async (staff: Staff) => {
    setConfirmAction(() => async () => {
      await axiosInstance.patch(API_PATHS.ADMIN.STAFF.TOGGLE_STATUS(staff._id));
      setConfirmOpen(false);
      fetchStaff();
    });
    setConfirmOpen(true);
  };

  const deleteStaff = async (id: string) => {
    setConfirmAction(() => async () => {
      await axiosInstance.delete(API_PATHS.ADMIN.STAFF.DELETE_STAFF(id));
      setConfirmOpen(false);
      fetchStaff();
    });
    setConfirmOpen(true);
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
        open={confirmOpen}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmAction}
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Staff</h1>
          <p className="text-sm text-gray-500">Create and manage staff accounts</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Staff
        </button>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table-zebra table">
              <thead>
                <tr>
                  <th>Profile Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
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
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.phone || '-'}</td>
                      <td>
                        <span
                          className={`badge rounded-full text-xs ${s.isActive ? 'badge-success' : 'badge-error'}`}
                        >
                          {s.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="flex w-fit items-center justify-end gap-1 group-hover:cursor-pointer">
                        <Button title="Edit staff" onClick={() => openEdit(s)}>
                          <Edit2 size={17} />
                        </Button>

                        <Button
                          title={s.isActive ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleStatus(s)}
                        >
                          {s.isActive ? <UserX size={17} /> : <UserCheck size={17} />}
                        </Button>

                        <Button title="Delete staff" onClick={() => deleteStaff(s._id)}>
                          <Trash2 size={17} />
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

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-lg font-bold">Add Staff</h3>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="input input-bordered w-full"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={form.password}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="input input-bordered w-full"
                value={form.phone}
                onChange={handleChange}
              />

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setForm({ name: '', email: '', password: '', phone: '', avatar: '' });
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* backdrop */}
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
        </div>
      )}
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

export default ManageStaff; -->

import React from 'react';

interface StaffForm {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
}

interface Props {
  open: boolean;
  title: string;
  submitting: boolean;
  error?: string | null;
  form: StaffForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isEdit?: boolean;
}

const StaffFormModal: React.FC<Props> = ({
  open,
  title,
  submitting,
  error,
  form,
  onChange,
  onClose,
  onSubmit,
  isEdit = false,
}) => {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="mb-4 text-lg font-bold">{title}</h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            className="input input-bordered w-full"
            value={form.name}
            onChange={onChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={onChange}
            required
          />

          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={form.password || ''}
              onChange={onChange}
              required
            />
          )}

          <input
            name="phone"
            placeholder="Phone"
            className="input input-bordered w-full"
            value={form.phone || ''}
            onChange={onChange}
          />

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                isEdit ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default StaffFormModal;
    interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    }

    const ConfirmModal: React.FC<Props> = ({
    open,
    title,
    message,
    confirmText = 'Yes',
    onConfirm,
    onCancel,
    }) => {
    if (!open) return null;

    return (
        <div className="modal modal-open">
        <div className="modal-box">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="py-4">{message}</p>

            <div className="modal-action">
            <button className="btn btn-ghost" onClick={onCancel}>
                No
            </button>
            <button className="btn btn-error" onClick={onConfirm}>
                {confirmText}
            </button>
            </div>
        </div>

        <div className="modal-backdrop" onClick={onCancel} />
        </div>
    );
    };

    export default ConfirmModal;
