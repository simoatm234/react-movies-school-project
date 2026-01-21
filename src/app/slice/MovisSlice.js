import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllMovies,
  fetchMovieVideos,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from './AsyncThunks/MoviesThunk';

const initialState = {
  data: {
    all: { page: null, data: [], total_pages: null, total_results: null },
    popular: { page: null, data: [], total_pages: null, total_results: null },
    topRated: { page: null, data: [], total_pages: null, total_results: null },
    trending: { page: null, data: [], total_pages: null, total_results: null },
    upcoming: { page: null, data: [], total_pages: null, total_results: null },
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
      //ALL
      .addCase(fetchAllMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.data.all.data = action.payload.data;
        state.data.all.page = action.payload.page;
        state.data.all.total_pages = action.payload.total_pages;
        state.data.all.total_results = action.payload.total_results;
      })
      .addCase(fetchAllMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      //  POPULAR

      .addCase(fetchPopularMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.data.popular.data = action.payload.data;
        state.data.popular.page = action.payload.page;
        state.data.popular.total_pages = action.payload.total_pages;
        state.data.popular.total_results = action.payload.total_results;
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
        state.data.topRated.data = action.payload.data;
        state.data.topRated.page = action.payload.page;
        state.data.topRated.total_pages = action.payload.total_pages;
        state.data.topRated.total_results = action.payload.total_results;
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
        state.data.trending.page = action.payload.page;
        state.data.trending.data = action.payload.data;
        state.data.trending.total_pages = action.payload.total_pages;
        state.data.trending.total_results = action.payload.total_results;
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
        state.data.upcoming.data = action.payload.data;
        state.data.upcoming.page = action.payload.page;
        state.data.upcoming.total_pages = action.payload.total_pages;
        state.data.upcoming.total_results = action.payload.total_results;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // vidios
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
