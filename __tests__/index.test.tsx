import { render, screen } from '@testing-library/react';
import Home, { getServerSideProps } from '@/pages/index';
import { GetServerSidePropsContext } from 'next';

const originalFetch = global.fetch;

const fetchMockImplementation = (resolvedJson: object) => {
  return () =>
    Promise.resolve({
      json: () => Promise.resolve(resolvedJson),
    });
};

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
    temp_c: 17.4,
    temp_f: 62.6,
    is_day: 1,
    condition: {
      text: 'Sol',
      icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
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

beforeEach(() => {
  global.fetch = jest.fn() as jest.Mock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('Home', () => {
  it('Should render weather information from current user location', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      fetchMockImplementation(weatherApiResponseMock)
    );
    const context = {
      req: {
        headers: {
          latitude: weatherApiResponseMock.location.lat,
          longitude: weatherApiResponseMock.location.lon
        }
      }
    } as unknown as GetServerSidePropsContext;
    const { props } = await getServerSideProps(context);
    render(<Home {...props} />);

    const weatherIcon = screen.getByAltText('Sol');
    const cityName = screen.getByRole('heading', {
      name: /^Vassouras$/,
    });
    const temperature = screen.getByRole('heading', {
      name: /^17°C$/,
    });
    const condition = screen.getByRole('heading', {
      name: /^Sol$/,
    });

    expect(weatherIcon).toBeInTheDocument();
    expect(cityName).toBeInTheDocument();
    expect(temperature).toBeInTheDocument();
    expect(condition).toBeInTheDocument();
  });
});
