import { isUserAllowedOnDashboard } from "@/server/authutils";
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthorized = await isUserAllowedOnDashboard();

  if (!isAuthorized) {
    return notFound();
  }

  return children;
}
