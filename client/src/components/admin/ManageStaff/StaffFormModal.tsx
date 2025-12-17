import React from 'react';
import Button from '../../ui/Button';
import ProfilePhotoSelector from '../../ui/ProfilePhotoSelector';
import type { StaffForm } from '../../../types/staff';

interface Props {
  open: boolean;
  title: string;
  submitting: boolean;
  error?: string | null;
  form: StaffForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<StaffForm>>;
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
  setForm,
  isEdit = false,
}) => {
  if (!open) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box ring-neutral ring-1">
        <h3 className="mb-4 text-lg font-medium">{title}</h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <ProfilePhotoSelector
            image={form.avatar ?? null}
            onChange={(img) =>
              setForm((prev) => ({
                ...prev,
                avatar: img,
              }))
            }
          />

          <input
            name="name"
            placeholder="Full Name"
            className="input input-bordered w-full rounded-md outline-none"
            value={form.name}
            onChange={onChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full rounded-md outline-none"
            value={form.email}
            onChange={onChange}
            required
          />

          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full rounded-md outline-none"
              value={form.password || ''}
              onChange={onChange}
              required
            />
          )}

          <input
            name="phone"
            placeholder="Phone"
            className="input input-bordered w-full rounded-md outline-none"
            value={form.phone || ''}
            onChange={onChange}
          />

          <div className="modal-action">
            <Button
              title="Cancel"
              text="Cancel"
              className="btn btn-ghost font-normal"
              onClick={onClose}
            />

            <Button title="Submit" className="btn btn-success font-medium" disabled={submitting}>
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : isEdit ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default StaffFormModal;
