import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { SerialDataTable, SerialDef } from "./table/serialtable";
import { sql } from "@vercel/postgres";

export default async function Page() {
    const session = await auth();

    if (!session || !session.user) {
        return redirect("/signin");
    }

    const { rows } = await sql`SELECT * FROM mspaint_keys`;

    return (
        <SidebarProvider>
        <AppSidebar
            session_data={{
                name: session.user.name ?? "unknown",
                email: session.user.email ?? "example@upio.dev",
                avatar: session.user.image ?? "https://avatar.vercel.sh/42",
            }}
        />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                        Dashboard
                    </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Serials</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Modify</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb>
            </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <SerialDataTable data={rows as SerialDef[]} />
            </div>
        </SidebarInset>
        </SidebarProvider>
    );
}
