import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../Api';

//helper
const handleThunkRequest = async (apiCall, rejectWithValue) => {
  try {
    const response = await apiCall();

    console.log(response);
    return {
      data: response.results,
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results,
    };
  } catch (error) {
    return rejectWithValue(error.response || 'Something went wrong');
  }
};
//all
export const fetchAllMovies = createAsyncThunk(
  'movies/fetchAllMovies',
  async (page, { rejectWithValue }) =>
    handleThunkRequest(() => api.fetchAllMovies(page), rejectWithValue)
);
//popular
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async (page, { rejectWithValue }) =>
    handleThunkRequest(() => api.fetchPopularMovies(page), rejectWithValue)
);
//top rated
export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRatedMovies',
  async (page, { rejectWithValue }) =>
    handleThunkRequest(() => api.fetchTopRatedMovies(page), rejectWithValue)
);

// trending by time
export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrendingMovies',
  async ({ time, page }, { rejectWithValue }) => {
    try {
      const response = await api.fetchTrendingMovies(time, page);
      return {
        data: response.results,
        page: response.page,
        total_pages: response.total_pages,
        total_results: response.total_results,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
// upcoming
export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcomingMovies',
  async (page, { rejectWithValue }) =>
    handleThunkRequest(() => api.fetchUpcomingMovies(page), rejectWithValue)
);
// videos
export const fetchMovieVideos = createAsyncThunk(
  'movies/fetchMovieVideos',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await api.getMovieVideos(movieId);
      return { movieId, videos: response.results };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
