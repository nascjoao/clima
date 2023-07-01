import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from 'redux/reducers/favoritesReducer';
import { AppDispatch, useAppSelector } from 'redux/store';
import Weather from 'types/weather';
import dayjs from 'dayjs';

export default function Favorite({ weather }: { weather: Weather }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useAppSelector((state) => state.favoritesReducer.value);
  useEffect(() => {
    setIsFavorite(favorites.some((favorite) => favorite.weather.location.name === weather.location.name));
  }, [weather, favorites]);
  function manageFavorite() {
    dispatch(isFavorite ? removeFavorite(weather.location.name) : addFavorite({ lastUpdated: dayjs(new Date()).format('YYYY/MM/DD HH:mm'), weather }));
    setIsFavorite(!isFavorite);
  }
  return (
    <Button
      variant={ isFavorite ? 'contained' : 'outlined' }
      startIcon={ isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
      onClick={manageFavorite}
      sx={{
        borderColor: '#fafafa',
        color: '#fafafa',
        bgcolor: isFavorite ? '#ec4899' : '',
        '&:hover': {
          borderColor: '#ec4899',
          bgcolor: isFavorite ? '#db2777' : 'rgba(236, 72, 153, 0.05);',
        },
        position: 'absolute',
        right: '2rem',
        bottom: '4.5rem',
      }}
    >
      { isFavorite ? 'Favorita' : 'Favoritar' }
    </Button>
  );
}
