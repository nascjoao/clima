import { PayloadAction } from '@reduxjs/toolkit';
import { InitialState } from 'redux/reducers/recentsReducer';

const actions = {
  addRecent(state: InitialState, action: PayloadAction<string>) {
    const recentIndex = state.value.indexOf(action.payload);
    if (recentIndex > -1) {
      state.value.splice(recentIndex, 1);
    }
    state.value.unshift(action.payload);
    return state;
  },
  removeRecent(state: InitialState, action: PayloadAction<string>) {
    return {
      value: state.value.filter((recent) => recent !== action.payload)
    };
  },
};

export default actions;
