import React, {
  type FC,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import Link from "next/link";

type ButtonOrAnchorProps =
  ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

interface ButtonProps extends ButtonOrAnchorProps {
  variant?: "primary" | "secondary-gray" | "tertiary-gray";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  href?: string;
}

const Button: FC<ButtonProps> = ({
  onClick,
  variant = "primary",
  size = "md",
  href,
  disabled,
  className = "",
  children,
  ...props
}) => {
  const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-6 py-3 text-base",
    "2xl": "px-7 py-3.5 text-lg",
  };

  const variantClasses: Record<
    NonNullable<ButtonProps["variant"]>,
    string
  > = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    "secondary-gray":
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
    "tertiary-gray":
      "bg-transparent text-gray-800 hover:bg-gray-100 disabled:text-gray-400",
  };

  const buttonClasses = [
    className,
    sizeClasses[size],
    variantClasses[variant],
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
