import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** Extra layout classes, e.g. "flex flex-col gap-4". */
  className?: string;
  /** Links the card to its heading for screen readers. */
  "aria-labelledby"?: string;
}

/**
 * A white panel with rounded corners and a soft green shadow, sitting on the
 * mint page background. The basic building block of the signed-in screens.
 * On paper it turns into a plain block, so printed documents have no frame.
 */
export function Card({ children, className = "", ...sectionProps }: CardProps) {
  return (
    <section
      {...sectionProps}
      className={`rounded-3xl bg-white p-5 shadow-card sm:p-7 print:rounded-none print:p-0 print:shadow-none ${className}`}
    >
      {children}
    </section>
  );
}
