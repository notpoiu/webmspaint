import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.mspaint.cc/',
      lastModified: new Date(),
      priority: 1,
    },
    {
        url: 'https://www.mspaint.cc/key',
        lastModified: new Date(),
        priority: 0.8,
    },
    {
        url: 'https://www.mspaint.cc/shop',
        lastModified: new Date(),
        priority: 0.7,
    },
    {
        url: 'https://www.mspaint.cc/tos',
        lastModified: new Date(),
        priority: 0.5,
    }
  ]
}