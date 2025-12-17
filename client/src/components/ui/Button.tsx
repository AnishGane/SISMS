import type { JSX } from 'react/jsx-runtime';

type ButtonProps = {
  icon?: JSX.Element;
  text?: string;
  onClick?: () => Promise<void> | void;
  className?: string;
  title: string;
  disabled?: boolean;
  children?: React.ReactNode;
};
const Button = ({ icon, text, title, children, disabled, onClick, className }: ButtonProps) => {
  const base =
    ' p-2 cursor-pointer font-medium flex gap-2 items-center justify-center tracking-wide rounded-md';
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={disabled}
      title={title}
      className={`${base} ${className}`}
    >
      {icon} {text}
      {children}
    </button>
  );
};

export default Button;
