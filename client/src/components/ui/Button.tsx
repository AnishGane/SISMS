import type { JSX } from 'react/jsx-runtime';

type ButtonProps = {
  icon?: JSX.Element;
  text?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => Promise<void> | void;
  className?: string;
};
const Button = ({ icon, text, variant = 'primary', onClick, className }: ButtonProps) => {
  const base =
    ' p-2 cursor-pointer transition-colors font-medium duration-200 flex gap-2 items-center justify-center';
  const variantcn = {
    primary: 'btn-linear text-white w-full rounded-md',
    secondary: 'bg-base-200 text-base-content hover:bg-base-300/40 border border-base-content',
  };
  return (
    <button
      onClick={onClick}
      type="submit"
      title={text}
      className={`${base} ${className} ${variantcn[variant]}`}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
