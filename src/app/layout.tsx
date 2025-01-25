import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";

export const metadata = {
  title: "Bazinga Properties",
};

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className} data-theme="light">
      <body>{children}</body>
    </html>
  );
}
