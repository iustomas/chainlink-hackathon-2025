// next
import type { Metadata } from "next";

// fonts
import { Oxanium } from "next/font/google";

// context
import ContextProvider from "../../context";

// styles
import "./globals.css";
import { headers } from "next/headers";

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
  const cookieStore = headers();
  const cookies = cookieStore.toString();
  return (
    <html lang="en" className={oxanium.variable}>
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
