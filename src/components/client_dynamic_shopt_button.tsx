"use client";

import dynamic from "next/dynamic";

export const DynamicShopButton = dynamic(() => import("@/components/buy-mspaint"), {
    loading: () => <></>,
    ssr: false,
})