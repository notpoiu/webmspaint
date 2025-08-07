"use client";

import * as React from "react";
import { BarChart2Icon, KeyIcon, UserCogIcon } from "lucide-react";

import Image from "next/image";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
//test
const data = {
  navMain: [
    {
      title: "Serials",
      url: "#",
      icon: KeyIcon,
      isActive: true,
      items: [
        {
          title: "Create Serial",
          url: "/dashboard/serials/create",
        },
        {
          title: "Modify Serial",
          url: "/dashboard/serials/modify",
        },
      ],
    },

    {
      title: "Users",
      url: "#",
      icon: UserCogIcon,
      isActive: true,
      items: [
        {
          title: "Edit Users",
          url: "/dashboard/users/edit",
        },        
        {
          title: "Luarmor Sync",
          url: "/dashboard/users/luarmor",
        },
      ],
    },

    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart2Icon,
      isActive: true,
    },
  ],
};

export function AppSidebar({
  session_data,
}: {
  session_data: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <Sidebar variant="sidebar" className="bg-black">
      <SidebarHeader className="bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src={"/icon.png"}
                    alt="mspaint logo"
                    width={256}
                    height={256}
                    className="size-6"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">mspaint</span>
                  <span className="truncate text-xs">dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <NavMain title="Serial Managment" items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <NavUser user={session_data} />
      </SidebarFooter>
    </Sidebar>
  );
}