import type { Metadata } from "next";
import "./globals.css";
import { Cursor } from "@/components/Cursor";
import { PageTransition } from "@/components/PageTransition";
import { UploadProvider } from "@/components/Uploads";
import { UploadPanel } from "@/components/UploadPanel";

export const metadata: Metadata = {
  title: "GANGHUI — Visual Designer",
  description: "An interactive portfolio by Ganghui Lee.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <UploadProvider><Cursor /><PageTransition>{children}</PageTransition>{process.env.NODE_ENV !== "production" && <UploadPanel />}</UploadProvider>
      </body>
    </html>
  );
}
