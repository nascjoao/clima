import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const newHeaders = new Headers(req.headers);
  if (req.geo) {
    newHeaders.set('Latitude', req.geo.latitude || 'null');
    newHeaders.set('Longitude', req.geo.longitude || 'null');
  }
  return NextResponse.next({
    headers: newHeaders
  });
}
