import { customAxios } from './Axios';

export const api = {
  fetchAllMovies: async (page) => {
    const response = await customAxios.get(`/discover/movie?page=${page}`);
    return response.data;
  },
  fetchPopularMovies: async (page) => {
    const response = await customAxios.get(`/movie/popular?page=${page}`);
    return response.data;
  },

  fetchTrendingMovies: async (time = 'day', page) => {
    const response = await customAxios.get(
      `/trending/movie/${time}?page=${page}`
    );
    return response.data;
  },

  fetchTopRatedMovies: async (page) => {
    const response = await customAxios.get(`/movie/top_rated?page=${page}`);
    return response.data;
  },

  fetchUpcomingMovies: async (page) => {
    const response = await customAxios.get(`/movie/upcoming?page=${page}`);
    return response.data;
  },
  fetchSearchMovies: async ({ page, value }) => {
    if (!value) return;
    const response = await customAxios.get(`/search/movie`, {
      params: {
        page: page,
        query: value,
        include_adult: false,
      },
    });
    return response.data;
  },

  GetVidioMovies: async (movieId) => {
    const response = await customAxios.get(`/movie/${movieId}/videos`);
    return response.data;
  },
};
