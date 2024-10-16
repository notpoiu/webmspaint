import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "mspaint",
  description: "mspaint | the best free roblox doors script",
  openGraph: {
		images: 'https://mspaint.upio.dev/icon.png',
	}
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
          <Toaster className="z-[5000]" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
