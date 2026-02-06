import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../component/NavBar';
import Footer from '../../component/Footer';
import { useSelector } from 'react-redux';
import Loading from '../../component/Loading';
import { useMovieActions } from '../../app/slice/dispatches/Dispatches';

export default function Layout() {
  const {
    fetchAllMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchTrendingMovies,
    fetchUpcomingMovies,
    AddWatchList,
    fetchTvPopulare,
  } = useMovieActions();

  const state = useSelector((state) => state);
  const isGlobalLoading = useSelector((state) => state.movies.loading);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const WatchList = localStorage.getItem('watchList');

      // Fetch all initial data in parallel
      await Promise.all([
        fetchAllMovies(1),
        fetchPopularMovies({ page: 1 }),
        fetchTopRatedMovies({ page: 1 }),
        fetchTrendingMovies({ time: 'day', page: 1 }),
        fetchUpcomingMovies({ page: 1 }),
        fetchTvPopulare({ page: 1 }),
      ]);

      if (WatchList) {
        const WatchListJson = JSON.parse(WatchList);
        AddWatchList(WatchListJson);
      }

      setHasInitialized(true);
    };

    initApp();
  }, [
    fetchAllMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchTrendingMovies,
    fetchUpcomingMovies,
    AddWatchList,
    fetchTvPopulare,
  ]);
  console.log(state);
  if (!hasInitialized && isGlobalLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <NavBar />

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
