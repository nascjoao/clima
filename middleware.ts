import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const newHeaders = new Headers(req.headers);
  const storedWeather = req.cookies.get('weather-last-local-request');
  if (storedWeather) {
    newHeaders.set('Latitude', JSON.parse(storedWeather.value).location.lat);
    newHeaders.set('Longitude', JSON.parse(storedWeather.value).location.lon);
  }
  if (req.geo && !storedWeather) {
    newHeaders.set('Latitude', req.geo.latitude || 'null');
    newHeaders.set('Longitude', req.geo.longitude || 'null');
  }
  return NextResponse.next({
    headers: newHeaders
  });
}
