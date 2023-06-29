import Head from 'next/head';
import styles from '@/pages/index.module.css';
import getUserCoordinates from '../utils/getUserCoordinates';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type Weather from '../types/weather';
import { Alert, AlertTitle, Box, Button, Skeleton, Typography } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { getCookie } from 'cookies-next';

export default function Home({ serverLatitude, serverLongitude, serverWeather, origin, firstAccess, storedWeather }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [coordinates, setCoordinates] = useState({
    latitude: serverLatitude,
    longitude: serverLongitude
  });
  const [weather, setWeather] = useState<Weather|object>(serverWeather);
  const [locationAccessGranted, setLocationAccessGranted] = useState(!firstAccess);
  function allowAccessLocation() {
    getUserCoordinates()
      .then((coords) => {
        if (coords) {
          const currentCoords = {
            latitude: coords.latitude,
            longitude: coords.longitude
          };
          setCoordinates(currentCoords);
          setLocationAccessGranted(true);
        }
      });
  }
  useEffect(() => {
    if (storedWeather) {
      const a = JSON.parse(storedWeather as string) as Weather;
      setCoordinates({
        latitude: a.location.lat,
        longitude: a.location.lon,
      });
      return setWeather(JSON.parse(storedWeather as string));
    }
  }, [storedWeather]);

  useEffect(() => {
    if ([coordinates.latitude, coordinates.longitude].every((coord) => typeof coord === 'number')) {
      fetch(`${origin}/api/weather?query=${coordinates.latitude},${coordinates.longitude}`)
        .then((response) => response.json())
        .then((data) => setWeather(data));
    }
  }, [coordinates, origin]);

  const needingToUpdateLocation = !coordinates.latitude;
  const loading = !(weather as Weather).current && !needingToUpdateLocation;

  if (!locationAccessGranted || needingToUpdateLocation) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      { needingToUpdateLocation ? (
        <Button onClick={allowAccessLocation} variant="text" startIcon={<SyncIcon />}>
          Atualizar minha localização
        </Button>
      ) : (
        <Alert sx={{ maxWidth: '30rem' }} severity="info" icon={<LocationOffIcon />}>
          <AlertTitle>Boas vindas!</AlertTitle>
          Parece ser sua primeira vez acessando.
          Habilite a localização para ter acesso as informações climáticas.
          <Button sx={{ marginTop: '1rem' }} variant="contained" onClick={allowAccessLocation}>Habilitar localização</Button>
        </Alert>
      ) }
    </Box>
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Weather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        { loading ? (
          <Skeleton variant="circular" width={128} height={128} />
        ) : (
          <Image src={(weather as Weather).current.condition.icon} alt={(weather as Weather).current.condition.text} width={128} height={128} />
        ) }
        <Typography variant="h1">
          { loading ? (
            <Skeleton width={340} />
          ) : (weather as Weather).location.name }
        </Typography>
        <Typography variant="h2">
          { loading ? (
            <Skeleton width={80} />
          ) : `${Math.round((weather as Weather).current.temp_c)}°C` }
        </Typography>
        <Typography variant="h3">
          { loading ? (
            <Skeleton width={100} />
          ) : (weather as Weather).current.condition.text }
        </Typography>
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const headers = context.req.headers;
  const protocol = context.req.headers.host?.includes('localhost') ? 'http://' : 'https://';
  const url = protocol + context.req.headers.host;
  let serverWeather = {};
  const storedWeather = getCookie('weather-last-local-request', { req: context.req, res: context.res }) || null;
  const firstAccess = getCookie('geo-permission', { req: context.req, res: context.res }) !== 'previous-granted';
  
  if (headers.latitude !== 'null' && headers.longitude !== 'null') {
    const { latitude, longitude } = headers;
    const response = await fetch(`${url}/api/weather?query=${latitude},${longitude}`);
    const data = await response.json();
    if (!data.error) serverWeather = data;
  }
  return {
    props: {
      serverLatitude: Number(headers.latitude),
      serverLongitude: Number(headers.longitude),
      storedWeather,
      serverWeather,
      origin: url,
      firstAccess,
    }
  };
}
