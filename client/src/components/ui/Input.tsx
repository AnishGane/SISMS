import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  onChange
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="block text-gray-700 mb-2 text-sm font-medium"
      >
        {label} {required && "*"}
      </label>

      <input
        type={inputType}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange?.(e)}
        className="w-full px-4 py-3 border border-gray-300 text-sm outline-none focus:border-neutral-500 rounded-lg"
      />

      {/* Password Toggle */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 translate-y-1/2 text-gray-500"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;
