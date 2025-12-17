import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { Edit2, Trash2, User2, UserCheck, UserPlus, UserX } from 'lucide-react';
import StaffFormModal from '../../components/admin/ManageStaff/StaffFormModal';
import ConfirmModal from '../../components/admin/ManageStaff/ConfirmModal';
import Button from '../../components/ui/Button';
import { emptyForm, type Staff, type StaffForm } from '../../types/staff';
import toast from 'react-hot-toast';
import { useAdmin } from '../../context/AdminContext';

const ManageStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<StaffForm>(emptyForm);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const { loading, setLoading, confirmConfig, setConfirmConfig, error, setError } = useAdmin();

  /* ---------------- FETCH STAFF ---------------- */
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.ADMIN.STAFF.GET_STAFFS);
      setStaff(res.data.staff || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* ---------------- OPEN MODALS ---------------- */
  const openAdd = () => {
    setSelectedStaff(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: Staff) => {
    setSelectedStaff(s);
    setForm({
      name: s.name,
      email: s.email,
      password: '',
      phone: s.phone || '',
      avatar: s.avatar ?? null,
    });
    setShowModal(true);
  };

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- CREATE ---------------- */
  const handleCreateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          fd.append(key, value as any);
        }
      });

      await axiosInstance.post(API_PATHS.ADMIN.STAFF.CREATE_STAFF, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowModal(false);
      setForm(emptyForm);
      toast.success('Staff created successfully');
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create staff');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStaff) return;

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          fd.append(key, value as any);
        }
      });

      await axiosInstance.put(API_PATHS.ADMIN.STAFF.UPDATE_STAFF(selectedStaff._id), fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setShowModal(false);
      setSelectedStaff(null);
      setForm(emptyForm);
      toast.success('Staff updated successfully');
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update staff');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- TOGGLE STATUS ---------------- */
  const toggleStatus = (s: Staff) => {
    setConfirmConfig({
      title: s.isActive ? 'Deactivate Staff' : 'Activate Staff',
      message: s.isActive ? `Deactivate ${s.name}?` : `Activate ${s.name}?`,
      confirmText: s.isActive ? 'Deactivate' : 'Activate',
      action: async () => {
        await axiosInstance.patch(API_PATHS.ADMIN.STAFF.TOGGLE_STATUS(s._id));
        setConfirmConfig(null);
        toast.success(`${s.name} ${s.isActive ? 'deactivated' : 'activated'} successfully`);
        fetchStaff();
      },
    });
  };

  /* ---------------- DELETE ---------------- */
  const deleteStaff = (s: Staff) => {
    setConfirmConfig({
      title: 'Delete Staff',
      message: `Delete ${s.name}? This cannot be undone.`,
      confirmText: 'Delete',
      action: async () => {
        await axiosInstance.delete(API_PATHS.ADMIN.STAFF.DELETE_STAFF(s._id));
        setConfirmConfig(null);
        toast.success(`${s.name} deleted successfully`);
        fetchStaff();
      },
    });
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
        setForm={setForm}
        onChange={handleChange}
        onClose={() => {
          setShowModal(false);
          setSelectedStaff(null);
          setForm(emptyForm);
          setError(null);
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

        <Button
          title="Add Staff"
          icon={<UserPlus size={17} />}
          className="btn bg-primary rounded-md p-3 font-medium"
          text="Add Staff"
          onClick={openAdd}
        />
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table-zebra border-neutral table overflow-hidden rounded-md border">
              <thead>
                <tr className="text-neutral-content bg-base-300">
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
                        <ActionBtn title="Edit staff" onClick={() => openEdit(s)}>
                          <Edit2 size={17} />
                        </ActionBtn>

                        <ActionBtn
                          title={'Toggle ' + (s.isActive ? 'Deactivate' : 'Activate')}
                          onClick={() => toggleStatus(s)}
                        >
                          {s.isActive ? (
                            <UserX className="text-warning" size={17} />
                          ) : (
                            <UserCheck size={17} className="text-success" />
                          )}
                        </ActionBtn>

                        <ActionBtn title="Delete staff" onClick={() => deleteStaff(s)}>
                          <Trash2 size={17} className="text-error" />
                        </ActionBtn>
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

const ActionBtn = ({
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
