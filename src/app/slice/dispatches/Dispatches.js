import { useDispatch } from 'react-redux';
import {
  fetchAllMovies,
  fetchMovieVideos,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from '../AsyncThunks/MoviesThunk';
import { useMemo } from 'react';
export const useMovieActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      fetchAllMovies: (page) => dispatch(fetchAllMovies(page)),
      fetchPopularMovies: (page) => dispatch(fetchPopularMovies(page)),
      fetchTopRatedMovies: (page) => dispatch(fetchTopRatedMovies(page)),
      fetchTrendingMovies: ({ time = 'day', page = 1 }) =>
        dispatch(fetchTrendingMovies({ time, page })),
      fetchUpcomingMovies: (page) => dispatch(fetchUpcomingMovies(page)),
      fetchMovieVideos: (movieId) => dispatch(fetchMovieVideos(movieId)),
    }),
    [dispatch]
  );
};
