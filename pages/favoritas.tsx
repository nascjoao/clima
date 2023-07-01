import { Card, CardContent, IconButton, List, ListItem, ListItemIcon, ListSubheader, Skeleton, Stack, Typography } from '@mui/material';
import { AppDispatch, useAppSelector } from 'redux/store';
import ClearIcon from '@mui/icons-material/Clear';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Favorite, loadFavorites, removeFavorite, updateFavorite } from '../redux/reducers/favoritesReducer';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import Weather from 'types/weather';

export default function Favorites() {
  const favorites = useAppSelector((state) => state.favoritesReducer.value);
  const [hasCheckedForUpdates, setHasCheckedForUpdates] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!hasCheckedForUpdates) {
      const storedFavorites: Favorite[] = JSON.parse(localStorage.getItem('favorites') as string) || [];
      if (!favorites.length && storedFavorites.length) {
        dispatch(loadFavorites(storedFavorites));
      }
      favorites.forEach((favorite) => {
        if (dayjs(new Date()).diff(favorite.lastUpdated, 'hours') >= 1) {
          fetch(`/api/weather?query=${favorite.weather.location.lat},${favorite.weather.location.lon}&mode=search`)
            .then((response) => response.json())
            .then((data: Weather) => dispatch(updateFavorite({ lastUpdated: dayjs(new Date()).format('YYYY/MM/DD HH:mm'), weather: data })));
        }
      });
      setHasCheckedForUpdates(true);
    }
  }, [hasCheckedForUpdates, favorites, dispatch]);
  function removeItem(event: React.MouseEvent, item: string) {
    event.preventDefault();
    dispatch(removeFavorite(item));
  }
  return (
    <List
      sx={{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 'calc(100vh - 3.5rem)'
      }}
      subheader={<h1 />}
    >
      <ListSubheader component="h1">Favoritas</ListSubheader>
      <ul style={{ padding: '0 2rem' }}>
        {favorites.map(({ weather }) => (
          <Link href={`/buscar?query=${weather.location.name}`} key={weather.location.name}>
            <ListItem
              sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }, borderRadius: '5px' }}
              secondaryAction={
                <IconButton onClick={(event) => removeItem(event, weather.location.name)} edge="end" aria-label="excluir">
                  <ClearIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <Image src={weather.current.condition.icon} alt={weather.current.condition.text} width={40} height={40} />
              </ListItemIcon>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="2.25rem">
                      {weather.location.name}
                    </Typography>
                    { hasCheckedForUpdates ? (
                      <Typography fontSize="2.25rem">
                        {Math.round(weather.current.temp_c)}°C
                      </Typography>
                    ) : <Skeleton width={80} /> }
                  </Stack>
                </CardContent>
              </Card>
            </ListItem>
          </Link>
        ))}
      </ul>
    </List>
  );
}