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

import { BlurFade } from "@/components/magicui/blur-fade";
import DotPattern from "@/components/magicui/dot-pattern";
import Image from "next/image";
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
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] -z-50 opacity-50" + (searchParams?.no_bg == "true" ? " hidden" : ""),
                )}
            />
    
            <div className="flex flex-col items-center justify-center ml-5 mr-5 py-10 md:py-20 px-4 md:px-20">
                <BlurFade delay={0.2 + (1 * 0.05)} className="flex flex-row items-center justify-center">
                    <Image src="/icon.png" alt="mspaint logo" width={35} height={35} className="mr-2" />
                    <h1 className="text-3xl font-bold text-center flex flex-col">
                        <strong>mspaint Terms of Service</strong>
                    </h1>
                </BlurFade>

                <BlurFade delay={0.4 + (1 * 0.05)} className="mb-5 mt-2">
                    <p className="text-center">By purchasing, accessing, or using any mspaint products or services (&quot;Services&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. Violation of these terms may result in <strong>immediate termination of access</strong> and <strong>permanent exclusion</strong> from all mspaint products.</p>

                    <div className="bg-blue-900/30 border border-blue-500/50 rounded-md p-3 my-4">
                        <p className="text-center text-sm"><strong>Important Note:</strong> These Terms of Service apply exclusively to the current closed-source version of mspaint products. The previous open-source version, which was released under the MIT License, remains governed by that license. Users of the archived open-source version are free to use, modify, and distribute it according to the terms of the MIT License.</p>
                    </div>

                    {/* Usage and Distribution */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Usage and Distribution</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>License Limitations</strong>: Your purchase grants you a personal, non-transferable license to use the Services solely as intended.</p>
                        <p>- <strong>No Resale</strong>: You may not resell, redistribute, or sublicense any mspaint product(s) without prior written permission.</p>
                        <p>- <strong>No Paywalling</strong>: You are prohibited from placing any mspaint product(s) behind a paywall or charging others for access.</p>
                        <p>- <strong>License Integrity</strong>: Do not share your license keys or authentication credentials with others. Each license is valid for a single user only.</p>
                        <p>- <strong>No Circumvention</strong>: Bypassing or attempting to bypass our licensing or authentication systems is strictly prohibited.</p>
                    </div>
                                
                    {/* Refunds and Chargebacks */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Payment and Billing</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>Final Sales</strong>: All purchases are <strong>final</strong>. <code>mspaint does not provide refunds under any circumstances.</code></p>
                        <p>- <strong>Prohibited Payment Actions</strong>: Chargebacks, payment disputes, or similar payment reversals are not permitted and constitute a violation of these terms. <strong>Such actions will result in immediate and permanent termination of access to all Services.</strong></p>
                        <p>- <strong>Payment Obligations</strong>: You are responsible for all charges incurred under your account and for any applicable taxes.</p>
                    </div>

                    {/* Intellectual Property and Security */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Intellectual Property and Security</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>Ownership</strong>: All Services remain the exclusive property of mspaint. Your purchase grants you limited usage rights only.</p>
                        <p>- <strong>No Reverse Engineering</strong>: You may not decompile, disassemble, reverse-engineer, or otherwise attempt to derive source code or underlying algorithms of any mspaint product.</p>
                        <p>- <strong>No Modification</strong>: Any unauthorized modification, tampering with, or attempting to circumvent security measures within mspaint products is strictly prohibited.</p>
                        <p>- <strong>Content Rights</strong>: Unless explicitly stated otherwise, you retain rights to content you create using mspaint products, subject to our non-exclusive license to use such content for service improvement.</p>
                    </div>

                    {/* Company Rights */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Our Rights</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>Service Modifications</strong>: We reserve the right to modify, update, or enhance the Services at our discretion without prior notice.</p>
                        <p>- <strong>Terms Updates</strong>: We may modify these Terms of Service at any time. Continued use of the Services after such modifications constitutes acceptance of the updated terms.</p>
                        <p>- <strong>Service Discontinuation</strong>: We reserve the right to suspend or terminate the Services in whole or in part at any time. In such event, no refunds, credits, or compensation will be provided.</p>
                        <p>- <strong>Enforcement</strong>: We may take any legal and technical measures to prevent violations of these terms and to protect our Services.</p>
                    </div>

                    {/* Limitation of Liability */}
                    <h2 className="text-2xl font-bold flex flex-col mt-6"><strong>Limitation of Liability</strong></h2>
                    <div className="flex flex-col *:ml-5">
                        <p>- <strong>Service Warranty</strong>: The Services are provided &quot;as is&quot; without any warranty of any kind, either express or implied.</p>
                        <p>- <strong>Damage Limitation</strong>: In no event shall mspaint be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our Services.</p>
                    </div>

                    <p className="text-center font-semibold mt-7 text-red-400">Violation of any of these terms will result in immediate termination of access to all current and future mspaint products and may subject you to legal action.</p>
                    
                    <p className="text-center text-sm mt-4 text-gray-400">Last Updated: April 7, 2025</p>
                </BlurFade>
            </div>
        </main>
    )
}