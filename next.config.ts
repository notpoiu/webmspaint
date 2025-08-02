import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add Discord domain for avatars
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      // Existing patterns
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/q5sBExIITNsAwzYsgE6Jd1Yu7jHXAosWPV5MnxqUgtz2BNCK",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/q5sBExIITNsAy07ylyEodEnluv6LfbZ04sCwrmkiRPq19FWQ",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/q5sBExIITNsAPkWgUY54JfWXEC7kbxjzUtwqByLTpnOSZdmY",
      },
      {
        protocol: "https",
        hostname: "ob4fgkbb3w.ufs.sh",
        pathname: "/f/q5sBExIITNsABaQo4HAKU9TJFX7q3z8ExZVAWyQeLOfamDgu",
      },
      
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsJ2hyPErBlZ5kfsQT24O8oeiR73u9rdc6zgm1",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAs9AEEhFodlyrJ6uEv40SUmQtNBXAzhP87IaKM",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsncwz3g7ulbhtMx156dQV3GozKUs08gOmX9jv",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsbnS21bRQaNIsxXOcZmM8nAt4WkiC0HGreJvP",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsKDiSPErg4CbGHLXhvIFxQV5pY6qirBw2Ju7n",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsH0LmZ6Layj1tLCfgrzV73ZonhEDeNGAiRdxQ",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsw0tQCS53yIYB4kajObRWsGN6r8uJDg2QVmKc",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAs98wtNJodlyrJ6uEv40SUmQtNBXAzhP87IaKM",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAs57LO68MxTny6kRILmGKFZcwpAtJ8zEgP1fNh",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsBsdLSiOKJxivCc6LDnOGta3RYUHkWNMdS51o",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsh99EheetQuqSgtNlpdaeF8iBM7RZIvJ02V9W",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsJ2uVLQbBlZ5kfsQT24O8oeiR73u9rdc6zgm1",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAskzKaZ1yN8Yh20HbLkz1KupR6QJWqIBGA9FOj",
      },

      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAslPmgsgFtT6a830HkYDKeuAh9RwMGsqd24CQZ",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsKTjfEJrg4CbGHLXhvIFxQV5pY6qirBw2Ju7n",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsOyrdiI2gWyJPGmIcCjwipUf8hTRZV4L3kb5n",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsT3nEx1yJXhEGA6wmQvc0jSk7ZrMVC3nTg5i9",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsfZjhFPc93HZnPaFmTiUcpydAzsQLVK54BWrO",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAs7HnqFJwU1AloGrev4cJZMCItwahsWYkL5y0u",
      },
      {
        protocol: "https",
        hostname: "q2p0njok3b.ufs.sh",
        pathname: "/f/Z155p1jPvLAsHV5ApBayj1tLCfgrzV73ZonhEDeNGAiRdxQ0",
      },
      {
        protocol: "https",
        hostname: "ob4fgkbb3w.ufs.sh",
        pathname: "/f/q5sBExIITNsABgYQjlAKU9TJFX7q3z8ExZVAWyQeLOfamDgu",
      },
    ],
  },
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  scope: "/app/dashboard",
});

export default withPWA(nextConfig);
