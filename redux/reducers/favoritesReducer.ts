import { createSlice } from '@reduxjs/toolkit';
import favoritesActions from '../actions/favoritesActions';
import Weather from 'types/weather';

export type Favorite = {
  lastUpdated: string;
  weather: Weather;
}

export type InitialState = {
  value: Favorite[];
}

const initialState = {
  value: []
} as InitialState;

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: favoritesActions,
});

export const { addFavorite, loadFavorites, updateFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
