import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import helpReducer from "../features/Functions/helpSlice"
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    help:helpReducer
  },
});
