import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import Weather from 'types/weather';
import Favorite from './Favorite';

export const skyPalette = [
  {
    keywords: ['sol', 'limpo', 'encoberto'],
    day: ['#5888ab', '#4d93d8'],
    night: ['#06061c', '#2c4264'],
  },
  {
    keywords: ['neve', 'nevasca'],
    day: ['#b5bfca', '#748fa3'],
    night: ['#828284', '#2e313a'],
  },
  {
    keywords: ['chuva', 'chuvisco', 'aguaceiro', 'trovoada', 'nevoeiro', 'neblina', 'nublado', 'granizo'],
    day: ['#919caf', '#546375'],
    night: ['#404759', '#323f50'],
  },
];

export function findPalette(data: Weather) {
  const foundPalette = skyPalette.find(
    (palette) => palette.keywords.some((keyword) => data.current.condition.text.toLowerCase().includes(keyword))
  );
  if (foundPalette) return foundPalette[data.current.is_day ? 'day' : 'night'];
  else return skyPalette[0][data.current.is_day ? 'day' : 'night'];
}

export default function WeatherDisplay({ data, loading }: { data: Weather|object, loading: boolean }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: (data as Weather).current && `linear-gradient(${findPalette(data as Weather)[0]}, ${findPalette(data as Weather)[1]})`,
      color: '#fafafa'
    }}>
      { !loading && (
        <Favorite
          weather={(data as Weather)}
        />
      ) }
      { loading ? (
        <Skeleton variant="circular" width={128} height={128} />
      ) : (
        <Image src={(data as Weather).current.condition.icon} alt={(data as Weather).current.condition.text} width={128} height={128} />
      ) }
      <Typography variant="h1" sx={{ textShadow: '0 5px 10px rgba(0,0,0,0.2)' }}>
        { loading ? (
          <Skeleton width={340} />
        ) : (data as Weather).location.name }
      </Typography>
      <Typography variant="h2" sx={{ textShadow: '0 5px 10px rgba(0,0,0,0.2)' }}>
        { loading ? (
          <Skeleton width={80} />
        ) : `${Math.round((data as Weather).current.temp_c)}°C` }
      </Typography>
      <Typography variant="h3" sx={{ textShadow: '0 5px 10px rgba(0,0,0,0.2)' }}>
        { loading ? (
          <Skeleton width={100} />
        ) : (data as Weather).current.condition.text }
      </Typography>
    </Box>
  );
}
