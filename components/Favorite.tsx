import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from 'redux/reducers/favoritesReducer';
import { AppDispatch, useAppSelector } from 'redux/store';

export default function Favorite({ name, lat, lon }: { name: string, lat: number, lon: number }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useAppSelector((state) => state.favoritesReducer.value);
  useEffect(() => {
    setIsFavorite(favorites.some((favorite) => favorite.name === name));
  }, [favorites, name]);
  function manageFavorite() {
    dispatch(isFavorite ? removeFavorite(name) : addFavorite({ name, lat, lon }));
    setIsFavorite(!isFavorite);
  }
  return (
    <Button
      variant={ isFavorite ? 'contained' : 'outlined' }
      startIcon={ isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
      onClick={manageFavorite}
      sx={{
        borderColor: '#ec4899',
        color: isFavorite ? '#fafafa' : '#ec4899',
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
