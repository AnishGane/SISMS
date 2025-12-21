import type { JSX } from 'react/jsx-runtime';
import { motion } from 'motion/react';

type ButtonProps = {
  icon?: JSX.Element;
  text: string;
  onClick?: () => Promise<void> | void;
  className?: string;
  title: string;
  disabled?: boolean;
  children?: React.ReactNode;
};
const Button = ({ icon, text, title, children, disabled, onClick, className }: ButtonProps) => {
  const base =
    ' p-2 cursor-pointer font-medium flex gap-2 items-center justify-center tracking-wide rounded-md border-none';
  return (
    <motion.button
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onClick={onClick}
      type="submit"
      disabled={disabled}
      title={title}
      className={`${base} ${className}`}
    >
      {icon} {text}
      {children}
    </motion.button>
  );
};

export default Button;
