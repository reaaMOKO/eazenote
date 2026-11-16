import type { Metadata } from "next";
import { RecordScreen } from "@/features/consult/RecordScreen";

export const metadata: Metadata = { title: "Record consult" };

export default function Page() {
  return <RecordScreen />;
}
