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
//movie
export const selectMovie = createAsyncThunk(
  'movies/selectMovie',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.selectMovie(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching movie');
    }
  }
);
//popular
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async ({ page = 1, genreId = null }, { rejectWithValue }) =>
    handleThunkRequest(
      () => api.fetchPopularMovies({ page, genreId }),
      rejectWithValue
    )
);
//top rated
export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRatedMovies',
  async ({ page = 1, genreId = null } = {}, { rejectWithValue }) =>
    handleThunkRequest(
      () => api.fetchTopRatedMovies({ page, genreId }),
      rejectWithValue
    )
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
  async ({ page, genreId }, { rejectWithValue }) =>
    handleThunkRequest(
      () => api.fetchUpcomingMovies({ page, genreId }),
      rejectWithValue
    )
);
// search
export const fetchSearchMovies = createAsyncThunk(
  'movies/fetchSearchMovies',
  async ({ page, value }, { rejectWithValue }) =>
    handleThunkRequest(
      () => api.fetchSearchMovies({ page, value }),
      rejectWithValue
    )
);
// videos
export const fetchMovieVideos = createAsyncThunk(
  'movies/fetchMovieVideos',
  async (movieId, { rejectWithValue }) => {
    try {
      const videos = await api.GetVidioMovies(movieId);
      console.log('Processed videos:', videos);
      return videos;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
