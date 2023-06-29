import Head from 'next/head';
import styles from '@/pages/index.module.css';
import getUserCoordinates from '../utils/getUserCoordinates';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type Weather from '../types/weather';
import { Skeleton, Typography } from '@mui/material';

export default function Home({ serverLatitude, serverLongitude, serverWeather, origin }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [coordinates, setCoordinates] = useState({
    latitude: serverLatitude,
    longitude: serverLongitude
  });
  const [weather, setWeather] = useState<Weather|object>(serverWeather);
  useEffect(() => {
    if ([serverLatitude, serverLongitude].some((coord) => coord === 'null')) {
      getUserCoordinates()
        .then((coords) => {
          if (coords) {
            setCoordinates({
              latitude: String(coords.latitude),
              longitude: String(coords.longitude)
            });
          }
        });
    }
  }, [serverLatitude, serverLongitude]);

  useEffect(() => {
    if ([coordinates.latitude, coordinates.longitude].every((coord) => typeof coord !== 'number')) {
      fetch(`${origin}/api/weather?query=${coordinates.latitude},${coordinates.longitude}`)
        .then((response) => response.json())
        .then((data) => setWeather(data));
    }
  }, [coordinates, origin]);

  const loading = !(weather as Weather).location || (weather as Weather).location.name === 'Null' || coordinates.latitude === 'null';

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
  
  if (headers.latitude !== 'null' && headers.longitude !== 'null') {
    const { latitude, longitude } = headers;
    const response = await fetch(`${url}/api/weather?query=${latitude},${longitude}`);
    const data = await response.json();
    if (!data.error) serverWeather = data;
  }
  
  return {
    props: {
      serverLatitude: headers.latitude,
      serverLongitude: headers.longitude,
      serverWeather,
      origin: url,
    }
  };
}
