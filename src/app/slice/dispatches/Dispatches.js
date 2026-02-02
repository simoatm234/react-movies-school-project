import { useDispatch } from 'react-redux';
import {
  fetchAllMovies,
  fetchMovieVideos,
  fetchPopularMovies,
  fetchSearchMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
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
      fetchPopularMovies: (page) => dispatch(fetchPopularMovies(page)),
      fetchTopRatedMovies: (page) => dispatch(fetchTopRatedMovies(page)),
      fetchTrendingMovies: ({ time = 'day', page = 1 }) =>
        dispatch(fetchTrendingMovies({ time, page })),
      fetchUpcomingMovies: (page) => dispatch(fetchUpcomingMovies(page)),
      fetchMovieVideos: (movieId) => dispatch(fetchMovieVideos(movieId)),
      fetchSearchMovies: ({ page, value }) =>
        dispatch(fetchSearchMovies({ page, value })),
      AddWatchList: ({ payload }) => dispatch(AddWatchList({ payload })),
      deleteWatchListItem: ({ payload }) =>
        dispatch(deleteWatchListItem({ payload })),
      deleteAllWacthList: () => dispatch(deleteAllWacthList()),
      selectMovie: (id) => dispatch(selectMovie(id)),
    }),
    [dispatch]
  );
};
