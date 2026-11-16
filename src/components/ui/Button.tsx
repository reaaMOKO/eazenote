import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * primary:   the one main action on a screen.
 * secondary: other actions.
 * danger:    stops or removes something (for example "Stop recording").
 * quiet:     low-emphasis text action.
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "quiet";

/**
 * standard: the normal button used across the app.
 * hero:     a larger pill, for the single headline action on the home screen.
 */
export type ButtonEmphasis = "standard" | "hero";

const SHARED_CLASSES =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed";

// Every button is at least 48px tall, comfortably above the 44px touch-target minimum.
const EMPHASIS_CLASSES: Record<ButtonEmphasis, string> = {
  standard: "min-h-12 rounded-lg px-5 text-base",
  hero: "min-h-14 rounded-full px-8 text-lg shadow-lg shadow-forest/20",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-deep text-white hover:bg-green disabled:bg-line disabled:text-slate",
  secondary:
    "border-2 border-deep bg-white text-deep hover:bg-tint disabled:border-line disabled:text-slate disabled:hover:bg-white",
  danger: "bg-danger text-white hover:bg-[#861f18]",
  quiet: "text-deep underline underline-offset-4 hover:text-green",
};

function buildButtonClasses(
  variant: ButtonVariant,
  emphasis: ButtonEmphasis,
  extraClasses = "",
): string {
  return `${SHARED_CLASSES} ${EMPHASIS_CLASSES[emphasis]} ${VARIANT_CLASSES[variant]} ${extraClasses}`.trim();
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, type = "button", ...buttonProps }: ButtonProps) {
  return (
    <button type={type} className={buildButtonClasses(variant, "standard", className)} {...buttonProps} />
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  emphasis?: ButtonEmphasis;
  className?: string;
  children: ReactNode;
}

/** A link that looks like a button. Use it when the action goes to another screen. */
export function ButtonLink({
  href,
  variant = "primary",
  emphasis = "standard",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buildButtonClasses(variant, emphasis, className)}>
      {children}
    </Link>
  );
}
