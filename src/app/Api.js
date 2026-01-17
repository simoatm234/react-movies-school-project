import { customAxios } from './Axios';

export const api = {
  fetchAllMovies: () => customAxios.get('/discover/movie'),
  fetchPopularMovies: (page = 1) =>
    customAxios.get(`/movie/popular?page=${page}`),

  fetchTrendingMovies: (time = 'day') =>
    customAxios.get(`/trending/movie/${time}`),

  fetchTopRatedMovies: () => customAxios.get('/movie/top_rated'),

  fetchUpcomingMovies: () => customAxios.get('/movie/upcoming'),
  GetVidioMovies: (movieId) => customAxios.get(`/movie/${movieId}/videos`),
};
