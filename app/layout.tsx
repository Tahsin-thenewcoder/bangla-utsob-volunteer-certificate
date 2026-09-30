import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "কৃতজ্ঞতার স্মারক | ৪র্থ বাংলা উৎসব",
  description:
    "৪র্থ বাংলা উৎসব ১৪৩৩ বঙ্গাব্দ-এর স্বেচ্ছাসেবকদের কৃতজ্ঞতার স্মারক সংগ্রহ করুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}