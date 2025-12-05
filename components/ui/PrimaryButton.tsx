import { ButtonHTMLAttributes } from "react";
import Link from "next/link";

type BaseProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = BaseProps & { href: string };

const variantClasses = {
  primary:
    "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]",
  secondary:
    "bg-white text-violet-600 border border-violet-100 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
};

const getClasses = (variant: "primary" | "secondary", extra: string) =>
  `inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${variantClasses[variant]} ${extra}`;

export function PrimaryButton(props: ButtonProps | LinkProps) {
  if ("href" in props) {
    const { href, children, className = "", variant = "primary" } = props;
    return (
      <Link href={href} className={getClasses(variant, className)}>
        {children}
      </Link>
    );
  }

  const {
    children,
    className = "",
    variant = "primary",
    ...buttonProps
  } = props;
  return (
    <button {...buttonProps} className={getClasses(variant, className)}>
      {children}
    </button>
  );
}
