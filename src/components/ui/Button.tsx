import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * primary:   the one main action on a screen.
 * secondary: other actions.
 * danger:    stops or removes something (for example "Stop recording").
 * quiet:     low-emphasis text action.
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "quiet";

// Every button is at least 48px tall, comfortably above the 44px touch-target minimum.
const SHARED_CLASSES =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold transition-colors disabled:cursor-not-allowed";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-deep text-white hover:bg-green disabled:bg-line disabled:text-slate",
  secondary:
    "border-2 border-deep bg-white text-deep hover:bg-tint disabled:border-line disabled:text-slate disabled:hover:bg-white",
  danger: "bg-danger text-white hover:bg-[#861f18]",
  quiet: "px-2 text-deep underline underline-offset-4 hover:text-green",
};

function buildButtonClasses(variant: ButtonVariant, extraClasses = ""): string {
  return `${SHARED_CLASSES} ${VARIANT_CLASSES[variant]} ${extraClasses}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, type = "button", ...buttonProps }: ButtonProps) {
  return <button type={type} className={buildButtonClasses(variant, className)} {...buttonProps} />;
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

/** A link that looks like a button. Use it when the action goes to another screen. */
export function ButtonLink({ href, variant = "primary", className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buildButtonClasses(variant, className)}>
      {children}
    </Link>
  );
}
