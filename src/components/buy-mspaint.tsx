"use client";

import { memo } from 'react';
import dynamic from 'next/dynamic';
import AnimatedShinyText from "@/components/magicui/animated-shiny-text";

const ShoppingBagIcon = dynamic(() => import('lucide-react').then(module => module.ShoppingBagIcon), { loading: () => <></>, ssr: false });
const ArrowRightIcon = dynamic(() => import('@radix-ui/react-icons').then(module => module.ArrowRightIcon), { loading: () => <></>, ssr: false });

const BuyMspaintButton = memo(() => {
    return <AnimatedShinyText 
        className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
        aria-label="Buy mspaint lifetime"
    >
        <ShoppingBagIcon className="mr-2" />
        <span>Buy mspaint lifetime</span>
        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </AnimatedShinyText>;
});
BuyMspaintButton.displayName = 'BuyMspaintButton';

export default dynamic(() => Promise.resolve(BuyMspaintButton), {
    loading: () => <></>,
    ssr: false,
});