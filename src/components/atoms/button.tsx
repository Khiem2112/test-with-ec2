import type { ButtonHTMLAttributes, JSX } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps): JSX.Element => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm",
    secondary: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200",
    outline: "border border-neutral-700 hover:bg-neutral-800 text-neutral-300",
    ghost: "hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
