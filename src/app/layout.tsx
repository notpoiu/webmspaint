import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

const description = "mspaint is the best free roblox script hub supporting games such as doors, 3008, room & doors, pressure, fisch, build a boat for treasure and grace";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    default: "mspaint",
    template: "%s | mspaint",
  },
  description: description,
  openGraph: {
    description: description,
		images: 'https://www.mspaint.cc/icon.png',
	},
  keywords: [
    "mspaint",
    "roblox",
    "script",
    "doors",
    "3008",
    "room & doors",
    "r&d",
    "pressure",
    "fisch",
    "babft",
    "grace"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body
        className={`${inter.className} antialiased`}
      >
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
