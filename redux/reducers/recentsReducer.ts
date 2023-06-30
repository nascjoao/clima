import { createSlice } from '@reduxjs/toolkit';
import recentsActions from '../actions/recentsActions';

export type InitialState = {
  value: string[];
}

const initialState = {
  value: []
} as InitialState;

export const recentsSlice = createSlice({
  name: 'recents',
  initialState,
  reducers: recentsActions,
});

export const { addRecent, removeRecent } = recentsSlice.actions;
export default recentsSlice.reducer;
