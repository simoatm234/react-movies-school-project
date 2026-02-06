import { useDispatch } from 'react-redux';
import {
  fetchAllMovies,
  fetchMovieVideos,
  fetchPopularMovies,
  fetchSearchMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchTvPopulare,
  fetchUpcomingMovies,
  selectMovie,
} from '../AsyncThunks/MoviesThunk';
import { useMemo } from 'react';
import {
  AddWatchList,
  deleteAllWacthList,
  deleteWatchListItem,
} from '../MovisSlice';
export const useMovieActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      fetchAllMovies: (page) => dispatch(fetchAllMovies(page)),
      fetchPopularMovies: ({ page, genreId }) =>
        dispatch(fetchPopularMovies({ page, genreId })),
      fetchTopRatedMovies: ({ page, genreId }) =>
        dispatch(fetchTopRatedMovies({ page, genreId })),
      fetchTrendingMovies: ({ time = 'day', page = 1 }) =>
        dispatch(fetchTrendingMovies({ time, page })),
      fetchUpcomingMovies: ({ page, genreId }) =>
        dispatch(fetchUpcomingMovies({ page, genreId })),
      fetchMovieVideos: (movieId) => dispatch(fetchMovieVideos(movieId)),
      fetchSearchMovies: ({ page, value }) =>
        dispatch(fetchSearchMovies({ page, value })),
      AddWatchList: (list) => dispatch(AddWatchList(list)),
      deleteWatchListItem: (movieId) => dispatch(deleteWatchListItem(movieId)),
      deleteAllWacthList: () => dispatch(deleteAllWacthList()),
      selectMovie: (id) => dispatch(selectMovie(id)),
      // tv
      fetchTvPopulare: (page) => dispatch(fetchTvPopulare(page)),
    }),
    [dispatch]
  );
};
