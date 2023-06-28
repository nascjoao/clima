import weather from '@/pages/api/weather';
import { NextApiRequest, NextApiResponse } from 'next';

const originalFetch = global.fetch;

const weatherApiResponseMock = {
  location: {
    name: 'Vassouras',
    region: 'Rio de Janeiro',
    country: 'Brazil',
    lat: -22.41,
    lon: -43.66,
    tz_id: 'America/Sao_Paulo',
    localtime_epoch: 1687945913,
    localtime: '2023-06-28 :51'
  },
  current: {
    last_updated_epoch: 1687945500,
    last_updated: '2023-06-28 0:45',
    temp_c: 17.0,
    temp_f: 62.6,
    is_day: 1,
    condition: {
      text: 'Sol',
      icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      code: 1000
    },
    wind_mph: 4.3,
    wind_kph: 6.8,
    wind_degree: 350,
    wind_dir: 'N',
    pressure_mb: 1017.0,
    pressure_in: 30.03,
    precip_mm: 0.0,
    precip_in: 0.0,
    humidity: 94,
    cloud: 0,
    feelslike_c: 17.0,
    feelslike_f: 62.6,
    vis_km: 10.0,
    vis_miles: 6.0,
    uv: 1.0,
    gust_mph: 6.7,
    gust_kph: 10.8
  }
};

const fetchMockImplementation = (resolvedJson: object) => {
  return () =>
    Promise.resolve({
      json: () => Promise.resolve(resolvedJson),
    });
};

beforeEach(() => {
  global.fetch = jest.fn() as jest.Mock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

test('Should return information about current weather', async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(
    fetchMockImplementation(weatherApiResponseMock)
  );
  const req = {
    query: {
      query: 'Vassouras'
    }
  } as unknown as NextApiRequest;
  const json = jest.fn();
  const res = {
    status: () => {
      return { json };
    }
  } as unknown as NextApiResponse;
  await weather(req, res);
  expect(json.mock.calls[0][0].location.name).toBe('Vassouras');
  expect(json.mock.calls[0][0].current.condition.icon).toBe('https://cdn.weatherapi.com/weather/128x128/day/113.png');
});

test('Should set status 400 if request is not successful', async () => {
  (global.fetch as jest.Mock).mockImplementationOnce(
    fetchMockImplementation({
      error: {
        code: 1006,
        message: 'No matching location found.'
      }
    })
  );
  let req = {
    query: {
      query: 'a'
    }
  } as unknown as NextApiRequest;
  const json = jest.fn();
  const status = jest.fn(() => {
    return { json };
  });
  const res = {
    status
  } as unknown as NextApiResponse;
  await weather(req, res);
  expect((status.mock.calls[0] as number[])[0]).toBe(400);
  req = {} as unknown as NextApiRequest;
  await weather(req, res);
  expect((status.mock.calls[0] as number[])[0]).toBe(400);
});
