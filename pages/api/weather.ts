import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie, getCookie } from 'cookies-next';

export default async function weather(req: NextApiRequest, res: NextApiResponse) {
  const cookieRequest = getCookie('weather-last-local-request', { req, res });
  const storedRequest = cookieRequest && typeof cookieRequest === 'string' ? JSON.parse(cookieRequest) : undefined;
  if (!req.query) return res.status(400).json({ error: { message: 'query is required' } });
  const queryRequest = req.query.query;
  const [lat, lon] = (queryRequest as string).split(',');
  const sameLocation = storedRequest && String(storedRequest.location.lat) === Number(lat).toFixed(2) && String(storedRequest.location.lon) === Number(lon).toFixed(2);
  if (storedRequest && sameLocation) {
    return res.status(200).json(storedRequest);
  }
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&lang=pt&q=${queryRequest}`);
  const data = await response.json();
  if (data.error) return res.status(400).json(data);
  Object.defineProperty(data.current.condition, 'icon', {
    value: `https:${data.current.condition.icon.replace('64x64', '128x128')}`
  });
  const oneHour = 3600;
  setCookie('weather-last-local-request', data, {
    maxAge: oneHour,
    httpOnly: true,
    req,
    res,
  });
  if (!getCookie('geo-permission', { req, res })) setCookie('geo-permission', 'previous-granted', { req, res });
  return res.status(200).json(data);
}
