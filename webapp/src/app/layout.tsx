// next
import type { Metadata } from "next";

// fonts
import { Oxanium } from "next/font/google";

// styles
import "./globals.css";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomas -  Your web3 legal agent",
  description: "Tomas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={oxanium.variable}>
      <body>{children}</body>
    </html>
  );
}
