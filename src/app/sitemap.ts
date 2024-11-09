import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mspaint.upio.dev/',
      lastModified: new Date(),
      priority: 1,
    },
    {
        url: 'https://mspaint.upio.dev/key',
        lastModified: new Date(),
        priority: 0.8,
    },
    {
        url: 'https://mspaint.upio.dev/shop',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://mspaint.upio.dev/tos',
        lastModified: new Date(),
        priority: 0.5,
    }
  ]
}