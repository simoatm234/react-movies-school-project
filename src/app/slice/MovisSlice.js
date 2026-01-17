import { createSlice } from '@reduxjs/toolkit';
import {
  fetchMovieVideos,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from './AsyncThunks/MoviesThunk';

const initialState = {
  movies: {
    all: [],
    popular: [],
    topRated: [],
    trending: [],
    upcoming: [],
  },
  videos: {
    byMovieId: {},
  },
  loading: false,
  error: null,
};

const MovieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  POPULAR
      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.popular = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // TOP RATED
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.topRated = action.payload;
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // TRENDING
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.trending = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //UPCOMING
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.upcoming = action.payload;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      //getVidios
      .addCase(fetchMovieVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.byMovieId[action.meta.arg] = action.payload;
      })
      .addCase(fetchMovieVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});
export default MovieSlice;
