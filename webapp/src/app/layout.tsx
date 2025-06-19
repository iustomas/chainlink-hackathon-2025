// next
import type { Metadata } from "next";

// fonts
import { Spectral } from "next/font/google";

// context
import ContextProvider from "../../context";

// styles
import "./globals.css";
import { headers } from "next/headers";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={spectral.variable}>
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
