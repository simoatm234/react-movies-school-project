import React, { useEffect } from 'react';
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
  } = useMovieActions();

  const state = useSelector((state) => state.movies);

  useEffect(() => {
    fetchAllMovies(1);
    fetchPopularMovies(1);
    fetchTopRatedMovies(1);
    fetchTrendingMovies({ time: 'day', page: 1 });
    fetchUpcomingMovies(1);
  }, [
    fetchAllMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchTrendingMovies,
    fetchUpcomingMovies,
  ]);

  console.log(state);
  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300 
                    bg-white text-zinc-900 
                    dark:bg-zinc-950 dark:text-zinc-50"
    >
      <NavBar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
