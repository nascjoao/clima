import { PayloadAction } from '@reduxjs/toolkit';
import { Favorite, InitialState } from 'redux/reducers/favoritesReducer';

const actions = {
  addFavorite(state: InitialState, action: PayloadAction<Favorite>) {
    state.value.unshift(action.payload);
    return state;
  },
  removeFavorite(state: InitialState, action: PayloadAction<string>) {
    return {
      value: state.value.filter((favorite) => favorite.name !== action.payload)
    };
  },
};

export default actions;
