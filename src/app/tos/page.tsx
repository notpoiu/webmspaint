/*
# **mspaint Terms of Service**

By purchasing and using mspaint products, you agree to the following Terms of Service. Violating any of these terms will result in **permanent blacklisting** from all mspaint products.

### **Usage and Distribution**
- **No Resale**: You may not resell any mspaint product(s) without express permission.
- **No Paywalling**: You are prohibited from placing any mspaint product(s) behind a paywall or charging others for access to our products.
- **No Key Sharing**: Do not share your license keys with others.
- **No Key System Bypass**: Bypassing or attempting to bypass our key system is strictly prohibited.

### **Refunds and Chargebacks**
- **Final Sales**: All purchases are **final**. `mspaint does not offer refunds for any reason.`
- **No Chargebacks**: Chargebacks are not permitted under any circumstances. **Initiating a chargeback will lead to a permanent ban.**

### **Tampering and Security**
- **No Tampering or Cracking**: You may not deobfuscate, reverse-engineer, tamper with, or crack mspaint products. Any attempt to modify or bypass product protections is strictly prohibited.

> **Violation of any of these terms will result in a permanent ban from all current and future mspaint products.**
*/

import BlurFade from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default async function TOS(
    props: {
        searchParams?: Promise<{ [key: string]: string | string[] | undefined }> 
    }
) {
    const searchParams = await props.searchParams;
    return (
        <main className={"overflow-x-hidden h-[100vh]" + (searchParams?.no_bg == "true" ? " bg-black" : "")}>
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] -z-50" + (searchParams?.no_bg == "true" ? " hidden" : ""),
                )}
            />
    
            <div className="flex flex-col items-center justify-center px-2 ml-5 mr-5">
                <BlurFade delay={0.2 + (1 * 0.05)} className="mt-5" inView>
                    <h1 className="text-3xl font-bold text-center flex flex-col">
                        <strong>mspaint Terms of Service</strong>
                    </h1>
                </BlurFade>

                <BlurFade delay={0.4 + (1 * 0.05)} className="mb-5 mt-2" inView>
                    <p className="text-center">By purchasing and/or using mspaint products, you agree to the following Terms of Service. Violating any of these terms will result in <strong>permanent blacklist</strong> from all mspaint products.</p>

                    {/* Usage and Distribution */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Usage and Distribution</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>No Resale</strong>: You may not resell any mspaint product(s) without express permission.</p>
                        <p>- <strong>No Paywalling</strong>: You are prohibited from placing any mspaint product(s) behind a paywall or charging others for access to our products.</p>
                        <p>- <strong>No Key Sharing</strong>: Do not share your license keys with others.</p>
                        <p>- <strong>No Key System Bypass</strong>: Bypassing or attempting to bypass our key system is strictly prohibited.</p>
                    </div>
                
                    {/* Refunds and Chargebacks */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Refunds and Chargebacks</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>Final Sales</strong>: All purchases are <strong>final</strong>. <code>mspaint does not offer refunds for any reason.</code></p>
                        <p>- <strong>No Chargebacks</strong>: Chargebacks are not permitted under any circumstances. <strong>Initiating a chargeback will lead to a permanent ban.</strong></p>
                    </div>

                    {/* Tampering and Security */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Tampering and Security</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>No Tampering or Cracking</strong>: You may not deobfuscate, reverse-engineer, tamper with, or crack mspaint products. Any attempt to modify or bypass product protections is strictly prohibited.</p>
                    </div>

                    {/* Reserving the right to modify the Terms of Service & discontinuing the Services */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Our Rights</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>Modification of Terms of Service</strong>: We reserve the right to modify these Terms of Service at any time without prior notice. We will notify users of any changes to the Terms of Service.</p>
                        <p>- <strong>Discontinuation of Services</strong>: We reserve the right to discontinue the Services at any time without prior notice. If we discontinue the service, you are not entitled to any refunds or credits.</p>
                    </div>

                    <p className="text-center text-bold mt-5">Violation of any of these terms will either result in a permanent ban from all current and future mspaint products or may result in legal action.</p>
                </BlurFade>
            </div>
        </main>
    )
}