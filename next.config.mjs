/** @type {import('next').NextConfig} */
const nextConfig = {
    
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/app/dashboard",
});

export default withPWA(nextConfig);