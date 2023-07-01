import { PayloadAction } from '@reduxjs/toolkit';
import { Favorite, InitialState } from 'redux/reducers/favoritesReducer';

const actions = {
  addFavorite(_: InitialState, action: PayloadAction<Favorite>) {
    const storedFavorites = localStorage.getItem('favorites');
    let favorites: Favorite[] = [];
    if (storedFavorites && typeof storedFavorites === 'string') {
      favorites = JSON.parse(storedFavorites);
    }
    favorites.push(action.payload);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return { value: favorites };
  },
  loadFavorites(_: InitialState, action: PayloadAction<Favorite[]>) {
    return { value: action.payload };
  },
  updateFavorite(state: InitialState, action: PayloadAction<Favorite>) {
    const favorites = [...state.value];
    const indexToReplace = favorites.findIndex((favorite) => favorite.weather.location.name === action.payload.weather.location.name);
    favorites.splice(indexToReplace, 1, action.payload);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return { value: favorites };
  },
  removeFavorite(_: InitialState, action: PayloadAction<string>) {
    const storedFavorites = localStorage.getItem('favorites');
    const updatedFavorites = JSON.parse(storedFavorites as string)
      .filter((favorite: Favorite) => favorite.weather.location.name !== action.payload);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    return { value: updatedFavorites };
  },
};

export default actions;
