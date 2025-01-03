/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
          pathname: '/f/q5sBExIITNsAwzYsgE6Jd1Yu7jHXAosWPV5MnxqUgtz2BNCK',
        },
        {
          protocol: 'https',
          hostname: 'utfs.io',
          pathname: '/f/q5sBExIITNsAy07ylyEodEnluv6LfbZ04sCwrmkiRPq19FWQ',
        },
        {
          protocol: 'https',
          hostname: 'utfs.io',
          pathname: '/f/q5sBExIITNsAPkWgUY54JfWXEC7kbxjzUtwqByLTpnOSZdmY',
        }
      ],
    }
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/app/dashboard",
});

export default withPWA(nextConfig);