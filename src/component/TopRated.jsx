import React, { useEffect } from 'react';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Play,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';
import FetchCard from './FetchCard';

export default function TopRated({ genreId }) {
  const { fetchTopRatedMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();
  const { topRated, watchList } = useSelector((state) => state.movies.data);

  //  Fetch data
  useEffect(() => {
    fetchTopRatedMovies({ page: 1, genreId });
  }, [genreId]);

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= topRated.total_pages) {
      await fetchTopRatedMovies({ page: newPage, genreId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFavorite = async (e, movie) => {
    e.stopPropagation();
    const list = JSON.parse(localStorage.getItem('watchList') || '[]');
    const isAlreadyIn = list.find((w) => w.id === movie.id);

    if (!isAlreadyIn) {
      const updated = [...list, movie];
      localStorage.setItem('watchList', JSON.stringify(updated));
      await AddWatchList(updated);
    } else {
      const updated = list.filter((w) => w.id !== movie.id);
      localStorage.setItem('watchList', JSON.stringify(updated));
      await deleteWatchListItem(movie.id);
    }
  };

  // Improved Loading State
  if (!topRated?.data || topRated.data.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 opacity-50">
        <Award className="w-12 h-12 text-yellow-500 animate-bounce" />
        <h2 className="font-black uppercase tracking-widest text-zinc-500">
          Loading Masterpieces...
        </h2>
      </div>
    );

  return (
    <>
      <div className="space-y-12 py-6">
        <AnimatePresence mode="popLayout">
          <main>
            <FetchCard movies={topRated.data} />
          </main>
        </AnimatePresence>
      </div>

      {/* Pagination Container */}
      <footer className="flex justify-center items-center gap-8 py-10">
        <button
          onClick={() => handlePageChange(topRated.page - 1)}
          disabled={topRated.page <= 1}
          className="p-4 rounded-2xl border dark:border-white/5 dark:bg-zinc-900 disabled:opacity-20 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <ChevronLeft size={20} className="dark:text-white" />
        </button>

        <div className="text-center min-w-[80px]">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Page
          </p>
          <p className="text-xl font-black italic dark:text-white">
            {topRated.page} <span className="opacity-30">/</span>{' '}
            {topRated.total_pages}
          </p>
        </div>

        <button
          onClick={() => handlePageChange(topRated.page + 1)}
          disabled={topRated.page >= topRated.total_pages}
          className="p-4 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 disabled:opacity-20 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </footer>
    </>
  );
}
