import type { JSX } from 'react/jsx-runtime';

type ButtonProps = {
  icon?: JSX.Element;
  text?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => Promise<void> | void;
};
const Button = ({ icon, text, variant = 'primary', onClick }: ButtonProps) => {
  const base =
    ' p-2 cursor-pointer rounded-md transition-colors font-medium duration-200 flex gap-2 items-center justify-center';
  const variantcn = {
    primary: 'btn-linear text-white w-full',
    secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-400',
  };
  return (
    <button onClick={onClick} type="submit" className={`${base} ${variantcn[variant]}`}>
      {icon} {text}
    </button>
  );
};

export default Button;
