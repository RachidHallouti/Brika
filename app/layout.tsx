import type { Metadata } from "next";
import {

  Space_Grotesk,
} from "next/font/google";

import "./globals.css";



const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Brika",
  description: "Created by Rochdi.dev",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`
        
        ${spaceGrotesk.variable}
        h-full antialiased
      `}
    >
      <body className="flex min-h-full flex-col font-sora bg-white">
        {children}
      </body>
    </html>
  );
}