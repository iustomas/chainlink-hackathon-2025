// next
import type { Metadata } from "next";

// fonts
import localFont from "next/font/local";
import { Poppins } from "next/font/google";

// context
import ContextProvider from "../../context";

// styles
import "./globals.css";
import { headers } from "next/headers";

const nocturneSerif = localFont({
  src: "../../public/assets/fonts/NocturneSerif-Regular.ttf",
  variable: "--font-nocturne",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
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
    <html lang="en" className={`${nocturneSerif.variable} ${poppins.variable}`}>
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
