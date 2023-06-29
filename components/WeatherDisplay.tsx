import { Container, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import Weather from 'types/weather';

export default function WeatherDisplay({ data, loading }: { data: Weather|object, loading: boolean }) {
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      { loading ? (
        <Skeleton variant="circular" width={128} height={128} />
      ) : (
        <Image src={(data as Weather).current.condition.icon} alt={(data as Weather).current.condition.text} width={128} height={128} />
      ) }
      <Typography variant="h1">
        { loading ? (
          <Skeleton width={340} />
        ) : (data as Weather).location.name }
      </Typography>
      <Typography variant="h2">
        { loading ? (
          <Skeleton width={80} />
        ) : `${Math.round((data as Weather).current.temp_c)}°C` }
      </Typography>
      <Typography variant="h3">
        { loading ? (
          <Skeleton width={100} />
        ) : (data as Weather).current.condition.text }
      </Typography>
    </Container>
  );
}
