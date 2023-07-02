import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie, getCookie } from 'cookies-next';
import Weather from 'types/weather';

function getLocalStoredWeather(req: NextApiRequest, res: NextApiResponse) {
  const cookieRequest = getCookie('weather-last-local-request', { req, res });
  const storedRequest = cookieRequest && typeof cookieRequest === 'string' ? JSON.parse(cookieRequest) : undefined;
  const queryRequest = req.query.query;
  const [lat, lon] = (queryRequest as string).split(',');
  const sameLocation = storedRequest && String(storedRequest.location.lat) === Number(lat).toFixed(2) && String(storedRequest.location.lon) === Number(lon).toFixed(2);
  if (storedRequest && sameLocation) {
    return storedRequest;
  }
}

async function weatherApiRequest(query: string) {
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&lang=pt&q=${query}`);
  return await response.json();
}

function storeLocalWeather(data: Weather, req: NextApiRequest, res: NextApiResponse) {
  const oneHour = 3600;
  setCookie('weather-last-local-request', data, {
    maxAge: oneHour,
    httpOnly: true,
    req,
    res,
  });
}

export default async function weather(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query) return res.status(400).json({ error: { message: 'query is required' } });
  if (req.query.mode !== 'search') {
    const stored = getLocalStoredWeather(req, res);
    if (stored) return res.status(200).json(stored);
  }
  const data = await weatherApiRequest(String(req.query.query));
  if (data.error) return res.status(400).json(data);
  Object.defineProperty(data.current.condition, 'icon', {
    value: `https:${data.current.condition.icon.replace('64x64', '128x128')}`
  });
  if (req.query.mode !== 'search') {
    storeLocalWeather(data, req, res);
  }
  return res.status(200).json(data);
}
