import { createSlice } from '@reduxjs/toolkit';
import favoritesActions from '../actions/favoritesActions';

export type Favorite = {
  name: string,
  lat: number,
  lon: number,
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

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
