import type { Metadata } from "next";
import { NewConsultScreen } from "@/features/consult/NewConsultScreen";

export const metadata: Metadata = { title: "New consult" };

export default function Page() {
  return <NewConsultScreen />;
}
