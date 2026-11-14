import type { Metadata } from "next";
import { ConsultListScreen } from "@/features/consult/ConsultListScreen";

export const metadata: Metadata = { title: "Consults" };

export default function Page() {
  return <ConsultListScreen />;
}
