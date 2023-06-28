import { NextApiRequest, NextApiResponse } from 'next';

export default async function weather(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query) return res.status(400).json({ error: { message: 'query is required' } });
  const queryRequest = req.query.query;
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&lang=pt&q=${queryRequest}`);
  const data = await response.json();
  if (data.error) return res.status(400).json(data);
  Object.defineProperty(data.current.condition, 'icon', {
    value: `https:${data.current.condition.icon.replace('64x64', '128x128')}`
  });
  return res.status(200).json(data);
}
