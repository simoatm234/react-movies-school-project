import { configureStore } from '@reduxjs/toolkit';
import MovieSlice from './slice/MovisSlice';

export const stor = configureStore({
  reducer: {
    movies: MovieSlice.reducer,
  },
});
