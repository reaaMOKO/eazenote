import { redirect } from "next/navigation";

/** The app has no marketing home page: go straight to the consult list (which asks for sign-in if needed). */
export default function RootPage() {
  redirect("/consults");
}
