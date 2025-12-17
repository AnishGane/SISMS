import React from 'react';
import Input from '../ui/AuthInput';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import ProfilePhotoSelector from '../ui/ProfilePhotoSelector';

type Field = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
};

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: Field[];
  storeFields?: Field[];
  buttonText: string;
  bottomLinks?: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  showForgotPassword?: boolean;
  forgotPasswordPath?: string;
}

const AuthForm = ({
  title,
  subtitle,
  fields,
  storeFields = [],
  buttonText,
  bottomLinks,
  onSubmit,
  showForgotPassword,
  forgotPasswordPath,
}: AuthFormProps) => {
  const { handleChange, formData, setFormData } = useAuth();

  const getRegisterFromURL = window.location.pathname.includes('register') ? true : false;
  return (
    <div className="mx-auto w-full max-w-xl p-8">
      <h2 className="mb-1 text-center text-3xl font-semibold text-gray-900">{title}</h2>

      <p className="mb-10 text-center text-sm text-gray-500">{subtitle}</p>

      <form onSubmit={onSubmit} className="space-y-5">
        {getRegisterFromURL && (
          <ProfilePhotoSelector
            image={formData.avatar ?? null}
            onChange={(img) => setFormData((prev) => ({ ...prev, avatar: img }))}
          />
        )}

        {/* Normal fields */}
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            onChange={handleChange}
            showForgotPassword={showForgotPassword}
            forgotPasswordPath={forgotPasswordPath}
            required
          />
        ))}

        {/* Store section in 2-column grid */}
        {storeFields.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {storeFields.map((store) => (
              <Input
                key={store.name}
                label={store.label}
                name={store.name}
                type={store.type}
                placeholder={store.placeholder}
                onChange={handleChange}
                required
              />
            ))}
          </div>
        )}

        {/* <button
          type="submit"
          className="w-full py-2 btn-linear text-white cursor-pointer transition-colors"
        >
          {buttonText}
        </button> */}
        <Button text={buttonText} title="Submit" />
      </form>

      {bottomLinks && <div className="mt-6 text-center text-sm text-gray-500">{bottomLinks}</div>}
    </div>
  );
};

export default AuthForm;
