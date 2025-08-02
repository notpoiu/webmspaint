import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api',
        '/dashboard',
        '/admin-sign-in',
        '/sign-in',
        '/signout',
        '/purchase'
      ],
    },
    sitemap: 'https://www.mspaint.cc/sitemap.xml',
  }
}