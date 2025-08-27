import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { gamesList } from "@/data/games";
import type { ReactNode } from "react";

const description =
  "mspaint is the best premium roblox script hub supporting games such as doors, 3008, room & doors, pressure, fisch, build a boat for treasure, grace and murder mystery 2";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    default: "mspaint",
    template: "%s | mspaint",
  },
  description: description,
  openGraph: {
    description: description,
    images: "https://www.mspaint.cc/icon.png",
  },
  keywords: [
    "mspaint",
    "roblox",
    "script",
    "best script",
    "working script",
    "2024",
    "2025",
    ...gamesList,
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      {/* <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head> */}
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
