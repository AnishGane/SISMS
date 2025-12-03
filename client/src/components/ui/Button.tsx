type ButtonProps = {
  icon?: any;
  text: string;
  variant?: 'primary' | 'secondary';
};
const Button = ({ icon, text, variant = 'primary' }: ButtonProps) => {
  const base =
    'w-full py-2 cursor-pointer rounded-md transition-colors font-medium duration-200 flex gap-2 items-center justify-center';
  const variantcn = {
    primary: 'btn-linear text-white',
    secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-400',
  };
  return (
    <button type="submit" className={`${base} ${variantcn[variant]}`}>
      {icon} {text}
    </button>
  );
};

export default Button;
