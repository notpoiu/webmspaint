/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "https://utfs.io/f/q5sBExIITNsAwzYsgE6Jd1Yu7jHXAosWPV5MnxqUgtz2BNCK",
        "https://utfs.io/f/q5sBExIITNsAy07ylyEodEnluv6LfbZ04sCwrmkiRPq19FWQ",
        "https://utfs.io/f/q5sBExIITNsAPkWgUY54JfWXEC7kbxjzUtwqByLTpnOSZdmY"
      ]
    }
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/app/dashboard",
});

export default withPWA(nextConfig);