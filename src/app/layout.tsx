import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Bazinga Properties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="emerald">
      <body className="min-h-screen bg-base-100">
        {children}
      </body>
    </html>
  );
}
