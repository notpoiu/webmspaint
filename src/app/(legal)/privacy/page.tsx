/*
Privacy Policy

Introduction

We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website&apos;s payment gateway in connection with Discord OAuth. By using the website&apos;s payment gateway, you agree to the practices described in this policy.

1. Information We Collect

When you log in using Discord OAuth, we collect the following data:
	•	Discord User ID: A unique identifier for your Discord account.
	•	Basic Profile Information: This may includes your username, avatar, email address.
	•	OAuth Token: Temporary tokens used for authentication and authorization purposes.
	•	Additional Data: Any other permissions or data explicitly granted by you during the OAuth process.

We do not collect unnecessary data beyond what is required for the functionality of the App.

2. How We Use Your Information

The information collected is used for the following purposes:
	•	Failsafe: We ONLY use your Discord User ID to ensure that you do not accidentally buy a product for someone else.
	•	Payment Processing: We use your Discord User ID to process payments securely and efficiently.

We will not sell, rent, or share your information with third parties, except as required by law or as described in this Privacy Policy.

3. Data Retention

We retain your Discord User ID forever as it helps us with support and troubleshooting. We do not retain any other data. You can be sure that you data is not retained by checking our website&apos;s source code.

4. Sharing Your Information

Your discord user id may be shared in the following limited circumstances:
	•	Service Providers: Neon (our database provider)
	•	Legal Compliance: If required by law, regulation, or legal process, we may disclose available information to comply with legal obligations.

5. Security of Your Information

We take appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.

6. Your Rights

Depending on your jurisdiction, you may have the following rights regarding your personal data:
	•	Access the data we hold about you.
	•	Request corrections to inaccuracies in your data.
	•	Request deletion of your data.
	•	Withdraw consent to data processing (where applicable).

To exercise any of these rights, please contact us at support@mspaint.cc

7. Cookies and Tracking Technologies

Our website only uses cookies to store session information (discord user information). No tracking technologies are used.

8. Contact Us

If you have questions or concerns about this Privacy Policy, please contact us at:
	•	Email: support@mspaint.cc
    •	Discord: https://discord.gg/mspaint

*/

export default function Privacy(){
    return (
        <main className="flex flex-col items-center justify-center md:px-32 px-5 ml-5 mr-5">
            <div className="py-16">
                <h1 className="text-3xl font-bold flex flex-col">
                    <strong>Privacy Policy</strong>
                </h1>

                <p className="mb-2 mt-4 font-bold">Introduction</p>
                <p>We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website&apos;s payment gateway with Discord OAuth. By using our services, you agree to the practices described in this policy.</p>

                <p className="mt-5 font-bold">1. Information We Collect</p>
                <p>When you authenticate using Discord OAuth, the following data is potentially available to us:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>Discord User ID: A unique identifier for your Discord account.</li>
                    <li>Basic Profile Information: Including username, avatar, and email address.</li>
                    <li>OAuth Token: Temporary tokens used for authentication purposes.</li>
                </ul>
                <p className="mt-2"><strong>Important:</strong> While our authentication system (AuthJS) requires email access during the OAuth process, we do not store or process your email on our servers. Your email is only stored as an encrypted cookie on your device and is never accessed on our server side.</p>
                
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-md p-3 my-4">
                    <p className="text-sm"><strong>What we actually store:</strong> We only store your Discord User ID in our database. This is the minimum information needed to associate your purchases with your Discord account so our script licensing bot (luarmor) can deliver your product keys.</p>
                </div>

                <p className="mt-5 font-bold">2. How We Use Your Information</p>
                <p>The Discord User ID we collect is used exclusively for:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>Account Association: Connecting your purchases to your Discord account.</li>
                    <li>Product Delivery: Enabling our Discord bot to deliver your purchased product keys.</li>
                    <li>Purchase Verification: Ensuring you don&apos;t accidentally purchase products for someone else.</li>
                </ul>
                <p>We do not use your information for marketing, tracking, profiling, or any purpose beyond what&apos;s required to deliver our services.</p>

                <div className="bg-blue-900/30 border border-blue-500/50 rounded-md p-3 my-4">
                    <p className="text-sm"><strong>Product Telemetry:</strong> When you use our products, we collect minimal telemetry data on startup, including job ID, game ID, and executor name. This data helps us improve our products and troubleshoot issues. This information is not linked to personal information and is used solely for operational purposes.</p>
                </div>

                <p className="mt-5 font-bold">3. Data Retention</p>
                <p>We retain only your Discord User ID in our database indefinitely to maintain records of purchases and to facilitate support. All other Discord data that may be temporarily available during the authentication process is not permanently stored by us.</p>

                <p className="mt-5 font-bold">4. Sharing Your Information</p>
                <p>Your Discord User ID may be shared in the following limited circumstances:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>Service Providers: Neon (our database provider) stores this data securely.</li>
                    <li>Legal Compliance: If required by law, regulation, or legal process.</li>
                </ul>

                <p className="mt-5 font-bold">5. Security of Your Information</p>
                <p>We implement appropriate security measures to protect your Discord User ID. Authentication data is handled using industry-standard protocols, and we use encrypted cookies for session management. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

                <p className="mt-5 font-bold">6. Transparency</p>
                <p>Our website is open source, allowing you to verify our data collection practices. You can confirm that we only store the Discord User ID as stated in this privacy policy.</p>

                <p className="mt-5 font-bold">7. Changes to this Privacy Policy</p>
                <p>We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes. Your continued use of our website after any changes to this Privacy Policy will constitute your acceptance of such changes.</p>

                <p className="mt-5 font-bold">8. Contact Us</p>
                <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@mspaint.cc" className="text-blue-400 hover:underline">support@mspaint.cc</a> or through our <a href="https://discord.gg/mspaint" className="text-blue-400 hover:underline">Discord server</a>.</p>
            </div>
        </main>
    )
}