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
        <main className="flex flex-col items-center justify-center px-32 ml-5 mr-5">
            <div className="py-16">
                <h1 className="text-3xl font-bold flex flex-col">
                    <strong>Privacy Policy</strong>
                </h1>

                <p className="mb-2">Introduction</p>
                <p>We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website&apos;s payment gateway in connection with Discord OAuth. By using the website&apos;s payment gateway, you agree to the practices described in this policy.</p>

                <p className="mt-5 font-bold">1. Information We Collect</p>
                <p>When you log in using Discord OAuth, the following data is made available to us:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>Discord User ID: A unique identifier for your Discord account.</li>
                    <li>Basic Profile Information: This may includes your username, avatar, email address.</li>
                    <li>OAuth Token: Temporary tokens used for authentication and authorization purposes.</li>
                    <li>Additional Data: Any other permissions or data explicitly granted by you during the OAuth process.</li>
                </ul>
                <p className="font-bold">However the only data we actually use & collect is your Discord User ID.</p>

                <p className="mt-5 font-bold">2. How We Use Your Information</p>
                <p>The information collected is used for the following purposes:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>Failsafe: We ONLY use your Discord User ID to ensure that you do not accidentally buy a product for someone else.</li>
                    <li>Payment Processing: We use your Discord User ID to process payments securely and efficiently.</li>
                </ul>
                <p>We will not sell, rent, or share your information with third parties, except as required by law or as described in this Privacy Policy.</p>

                <p className="mt-5 font-bold">3. Data Retention</p>
                <p>We retain your Discord User ID forever as it helps us with support and troubleshooting. We do not retain any other data. You can be sure that you data is not retained by checking our website&apos;s source code.</p>

                <p className="mt-5 font-bold">4. Sharing Your Information</p>
                <p>Your discord user id may be shared in the following limited circumstances:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>Service Providers: Neon (our database provider)</li>
                    <li>Legal Compliance: If required by law, regulation, or legal process, we may disclose available information to comply with legal obligations.</li>
                </ul>

                <p className="mt-5 font-bold">5. Security of Your Information</p>
                <p>We take appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

                <p className="mt-5 font-bold">6. Changes to this Privacy Policy</p>
                <p>We may update this Privacy Policy from time to time. We encourage you to review this page periodically for any changes. Your continued use of our website after any changes to this Privacy Policy will constitute your acceptance of such changes.</p>

                <p className="mt-5 font-bold">7. Contact Us</p>
                <p>If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@mspaint.dev">support@mspaint.dev</a>.</p>
            </div>
        </main>
    )
}
