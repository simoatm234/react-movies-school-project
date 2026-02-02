import { customAxios } from './Axios';

export const api = {
  fetchAllMovies: async (page) => {
    const response = await customAxios.get(`/discover/movie?page=${page}`);
    return response.data;
  },
  selectMovie: async (id) => {
    const response = await customAxios.get(`/movie/${id}`);
    console.log('movie :', response.data);
    return response.data;
  },
  fetchPopularMovies: async ({ page = 1, genreId = null }) => {
    const endpoint = genreId ? '/discover/movie' : '/movie/popular';
    const response = await customAxios.get(endpoint, {
      params: {
        page: page,
        with_genres: genreId,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  },

  fetchTrendingMovies: async (time = 'day', page) => {
    const response = await customAxios.get(
      `/trending/movie/${time}?page=${page}`
    );
    return response.data;
  },

  fetchTopRatedMovies: async ({ page = 1, genreId = null }) => {
    const endpoint = genreId ? '/discover/movie' : '/movie/top_rated';

    const params = genreId
      ? {
          sort_by: 'vote_average.desc',
          vote_count_gte: 300,
          with_genres: genreId,
          page,
        }
      : { page };

    const response = await customAxios.get(endpoint, { params });
    return response.data;
  },

  fetchUpcomingMovies: async ({ page = 1, genreId = null }) => {
    const params = {
      page,
    };
    if (genreId) {
      params.with_genres = genreId;
      params.sort_by = 'primary_release_date.asc';
    }
    const endpoint = genreId ? '/discover/movie' : '/movie/upcoming';
    const response = await customAxios.get(endpoint, { params });
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
    console.log('API Response:', response.data);
    return response.data.results;
  },
};
