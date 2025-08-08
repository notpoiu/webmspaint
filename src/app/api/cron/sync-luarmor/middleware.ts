import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/api/cron/sync-luarmor',
}

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.LRM_PROXY_API_KEY}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  return NextResponse.next()
}
