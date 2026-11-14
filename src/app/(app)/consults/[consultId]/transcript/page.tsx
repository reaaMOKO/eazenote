import type { Metadata } from "next";
import { TranscriptScreen } from "@/features/consult/TranscriptScreen";

export const metadata: Metadata = { title: "Transcript" };

export default function Page() {
  return <TranscriptScreen />;
}
