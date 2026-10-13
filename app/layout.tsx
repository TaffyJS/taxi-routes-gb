import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Габрово Улици и Маршрути",
  description: "Приложение за учене и тестове по улици, обекти и таксиметрови маршрути в Габрово.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}
