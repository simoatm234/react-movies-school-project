import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../Api';

export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async ({ rejectWithValue }) => {
    try {
      const response = await api.fetchPopularMovies();
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRatedMovies',
  async ({ rejectWithValue }) => {
    try {
      const response = await api.fetchTopRatedMovies();
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrendingMovies',
  async ({ rejectWithValue }) => {
    try {
      const response = await api.fetchTrendingMovies();
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcomingMovies',
  async ({ rejectWithValue }) => {
    try {
      const response = await api.fetchUpcomingMovies();
      return response.data.results;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
export const fetchMovieVideos = createAsyncThunk(
  'movies/fetchMovieVideos',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await api.getMovieVideos(movieId);
      return response.data.results; 
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

