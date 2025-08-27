import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { isUserAllowedOnDashboard } from "@/server/authutils";
import { maskEmail } from "@/server/stringutil";
import { Metadata, Viewport } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

const description =
  "mspaint is the best premium roblox script hub supporting games such as doors, 3008, room & doors, pressure, fisch and build a boat for treasure";

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
    images: "https://www.mspaint.cc/icon.png",
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
  children: ReactNode;
}>) {
  const session = await auth();

  if (session && session.user) {
    const isAuthorized = await isUserAllowedOnDashboard();

    if (!isAuthorized) {
      return notFound();
    }
  } else {
    return redirect("/admin-sign-in");
  }

  return (
    <SidebarProvider className="bg-black">
      <AppSidebar
        session_data={{
          name: session.user.name ?? "unknown",
          email: maskEmail(session.user.email ?? "example@upio.dev"),
          avatar: session.user.image ?? "https://avatar.vercel.sh/42",
        }}
      />
      <SidebarInset className="bg-black">{children}</SidebarInset>
    </SidebarProvider>
  );
}
