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
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box ring-neutral ring-1">
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
            className="input input-bordered w-full outline-none"
            value={form.phone || ''}
            onChange={onChange}
          />

          <div className="modal-action">
            <button type="button" className="btn btn-ghost rounded-md font-normal" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary rounded-md font-medium" disabled={submitting}>
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : isEdit ? (
                'Update'
              ) : (
                'Create'
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
