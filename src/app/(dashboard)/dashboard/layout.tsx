import { auth } from "@/auth";
import { isUserAllowedOnDashboard } from "@/server/authutils";
import { Metadata, Viewport } from "next";
import { notFound, redirect } from "next/navigation";

const description = "mspaint is the best free roblox script hub supporting games such as doors, 3008, room & doors, pressure, fisch and build a boat for treasure";

export const metadata: Metadata = {
  title: {
    default: "dashboard",
    template: "%s - dashboard",
  },
  description: description,
  manifest: "/dashboard/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "mspaint dashboard",
  },
  openGraph: {
    description: description,
		images: 'https://mspaint.upio.dev/icon.png',
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
  ],
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session && session.user) {
    const isAuthorized = await isUserAllowedOnDashboard();

    if (!isAuthorized ) {
      return notFound();
    }
  } else {
    return redirect("/signin");
  }

  return children;
}
