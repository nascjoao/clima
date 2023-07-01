import { PayloadAction } from '@reduxjs/toolkit';
import { InitialState } from 'redux/reducers/recentsReducer';

const actions = {
  addRecent(state: InitialState, action: PayloadAction<string>) {
    const recentIndex = state.value.indexOf(action.payload);
    if (recentIndex > -1) {
      state.value.splice(recentIndex, 1);
    }
    state.value.unshift(action.payload);
    localStorage.setItem('recents', JSON.stringify(state.value));
    return state;
  },
  loadRecents(_: InitialState, action: PayloadAction<string[]>) {
    return { value: action.payload };
  },
  removeRecent(state: InitialState, action: PayloadAction<string>) {
    const updatedRecents = state.value.filter((recent) => recent !== action.payload);
    localStorage.setItem('recents', JSON.stringify(updatedRecents));
    return {
      value: updatedRecents
    };
  },
};

export default actions;
