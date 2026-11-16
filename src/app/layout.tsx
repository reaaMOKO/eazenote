import type { Metadata, Viewport } from "next";
// Inter is bundled with the app, so no visitor data goes to a font service.
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "EazeNote", template: "%s | EazeNote" },
  description:
    "EazeNote drafts clinical notes, referral letters and prescriptions from a recorded consultation, for the doctor to check and approve.",
  // The app holds clinical drafts: keep it out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e5f4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
