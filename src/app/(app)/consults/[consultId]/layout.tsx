import { Suspense, type ReactNode } from "react";

/**
 * The consult id in the page address is only known when the page is opened,
 * so Next.js needs a Suspense boundary around the screens that read it.
 * The fallback is empty because the consult loads from the browser instantly.
 */
export default function ConsultLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
