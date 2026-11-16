import type { ReactNode } from "react";
import { SignedInShell } from "@/components/layout/SignedInShell";

/** Every screen inside the "(app)" folder needs a signed-in doctor and shares the top bar. */
export default function SignedInLayout({ children }: { children: ReactNode }) {
  return <SignedInShell>{children}</SignedInShell>;
}
