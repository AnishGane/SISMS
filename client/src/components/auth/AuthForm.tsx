import React from "react";
import Input from "../ui/Input";
import { useAuth } from "../../context/AuthContext";

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
  const {handleChange} = useAuth();
  return (
    <div className="w-full max-w-xl mx-auto p-8">
      <h2 className="text-3xl font-semibold text-gray-900 text-center mb-1">
        {title}
      </h2>

      <p className="text-center text-gray-500 text-sm mb-10">{subtitle}</p>

      <form onSubmit={onSubmit} className="space-y-5">

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

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {buttonText}
        </button>
      </form>

      {bottomLinks && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {bottomLinks}
        </div>
      )}
    </div>
  );
};

export default AuthForm;
