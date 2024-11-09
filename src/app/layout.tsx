import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

const gameKeywordGenerator = (game: string) => {
  return [
    `roblox ${game}`,
    `roblox ${game} script`,
    `roblox ${game} mod`,
    `roblox ${game} mods`,
    `roblox ${game} modding`,
    `${game}`,
    `${game} script`,
    `${game} mod`,
    `${game} mods`,
    `${game} modding`,
    `${game.toUpperCase()}`,
    `${game.toUpperCase()} script`,
    `${game.toUpperCase()} mod`,
    `${game.toUpperCase()} mods`,
    `${game.toUpperCase()} modding`,
    `${game.toLowerCase()}`,
    `${game.toLowerCase()} script`,
    `${game.toLowerCase()} mod`,
    `${game.toLowerCase()} mods`,
    `${game.toLowerCase()} modding`,
  ]
}

const DOORS_KEYWORDS = gameKeywordGenerator("doors");
const IKEA_KEYWORDS = gameKeywordGenerator("3008");
const RND_KEYWORDS = gameKeywordGenerator("Rooms & Doors");
const PRESSURE_KEYWORDS = gameKeywordGenerator("Pressure");
const FISCH_KEYWORDS = gameKeywordGenerator("Fisch");
const BABFT_KEYWORDS = gameKeywordGenerator("BABFT");

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    default: "mspaint",
    template: "%s | mspaint",
  },
  openGraph: {
    description: "mspaint, the best free roblox doors script",
		images: 'https://mspaint.upio.dev/icon.png',
	},
  keywords: [
    "mspaint",
    "roblox script",
    "script",
    "roblox doors",

    ...DOORS_KEYWORDS,
    ...IKEA_KEYWORDS,
    ...RND_KEYWORDS,
    ...PRESSURE_KEYWORDS,
    ...FISCH_KEYWORDS,
    ...BABFT_KEYWORDS,
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
