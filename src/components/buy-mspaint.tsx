import AnimatedShinyText from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ShoppingBagIcon } from "lucide-react";

export default function BuyMspaintButton() {
    return <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
        <ShoppingBagIcon className="mr-2" /><span>Buy mspaint lifetime</span>
        <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </AnimatedShinyText>;
}