import type { Metadata } from "next";
import { PracticeSetupScreen } from "@/features/practice/PracticeSetupScreen";

export const metadata: Metadata = { title: "Practice details" };

export default function PracticePage() {
  return <PracticeSetupScreen />;
}
