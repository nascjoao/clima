import styles from '@/pages/index.module.css';
import getUserCoordinates from '../utils/getUserCoordinates';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import type Weather from '../types/weather';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import WeatherDisplay from '@/components/WeatherDisplay';

export default function Home({ serverLatitude, serverLongitude, serverWeather, origin }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [coordinates, setCoordinates] = useState({
    latitude: serverLatitude,
    longitude: serverLongitude
  });
  const [weather, setWeather] = useState<Weather|object>(serverWeather);
  const [firstAccess, setFirstAccess] = useState(false);
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
          localStorage.setItem('geo-permission', 'granted');
          setFirstAccess(false);
        }
      });
  }

  useEffect(() => {
    if (localStorage.getItem('geo-permission') !== 'granted' && !coordinates.latitude) {
      setFirstAccess(true);
    }
    if ([coordinates.latitude, coordinates.longitude].every((coord) => typeof coord === 'number')) {
      fetch(`${origin}/api/weather?query=${coordinates.latitude},${coordinates.longitude}`)
        .then((response) => response.json())
        .then((data) => setWeather(data));
    }
  }, [coordinates, origin]);

  const needingToUpdateLocation = !coordinates.latitude && locationAccessGranted;
  const loading = !(weather as Weather).current && !needingToUpdateLocation;

  if (firstAccess) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <Alert sx={{ maxWidth: '30rem' }} severity="info" icon={<LocationOffIcon />}>
        <AlertTitle>Boas vindas!</AlertTitle>
        Parece ser sua primeira vez acessando.
        Habilite a localização para ter acesso as informações climáticas.
        <Button sx={{ marginTop: '1rem' }} variant="contained" onClick={allowAccessLocation}>Habilitar localização</Button>
      </Alert>
    </Box>
  );

  if (needingToUpdateLocation) return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <Button onClick={allowAccessLocation} variant="text" startIcon={<SyncIcon />}>
        Atualizar minha localização
      </Button>
    </Box>
  );

  return (
    <div className={styles.container}>
      { !needingToUpdateLocation && (
        <Button
          onClick={allowAccessLocation}
          variant="text"
          startIcon={<SyncIcon />}
          sx={{ position: 'fixed', top: '2rem', color: '#fafafa', textShadow: '0 0 20px rgba(0,0,0,0.3)' }}
        >
          Atualizar minha localização
        </Button>
      ) }
      <WeatherDisplay data={weather} loading={loading} />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const headers = context.req.headers;
  const protocol = context.req.headers.host?.includes('localhost') ? 'http://' : 'https://';
  const url = protocol + context.req.headers.host;
  const serverWeather = headers.weather || {};
  return {
    props: {
      serverLatitude: Number(headers.latitude),
      serverLongitude: Number(headers.longitude),
      serverWeather,
      origin: url,
    }
  };
}
