import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Play,
  Heart,
  Eye,
} from 'lucide-react';
import FetchCard from './FetchCard';

export default function Popular({ genreId }) {
  const { popular, watchList } = useSelector((state) => state.movies.data);
  const { fetchPopularMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();

  //  Initial Fetch
  useEffect(() => {
    fetchPopularMovies({ page: 1, genreId });
  }, [genreId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= popular.total_pages) {
      fetchPopularMovies({ page: newPage, genreId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFavorite = async (e, movie) => {
    e.stopPropagation();
    // Get current list from localStorage
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

  const formatDate = (date) => {
    if (!date) return 'Coming Soon';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!popular?.data || popular.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <TrendingUp className="w-12 h-12 text-purple-500 animate-pulse" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest">
            Fetching Popularity...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 transition-colors duration-500">
      <section className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* MOVIES GRID */}
        <main>
          <FetchCard movies={popular.data} />
        </main>
        {/* PAGINATION */}
        <footer className="mt-20 mb-10 flex justify-center items-center gap-6">
          <button
            onClick={() => handlePageChange(popular.page - 1)}
            disabled={popular.page <= 1}
            className="p-4 rounded-2xl border dark:border-zinc-800 dark:text-white disabled:opacity-20 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center px-8 py-3 bg-zinc-900 dark:bg-white rounded-2xl shadow-xl">
            <p className="text-[10px] font-black uppercase text-zinc-500">
              Page
            </p>
            <p className="text-lg font-black italic text-white dark:text-black">
              {popular.page} <span className="opacity-30">/</span>{' '}
              {popular.total_pages}
            </p>
          </div>

          <button
            onClick={() => handlePageChange(popular.page + 1)}
            disabled={popular.page >= popular.total_pages}
            className="p-4 rounded-2xl bg-purple-600 text-white hover:scale-110 active:scale-95 transition-all shadow-lg shadow-purple-600/30"
          >
            <ChevronRight size={20} />
          </button>
        </footer>
      </section>
    </div>
  );
}
