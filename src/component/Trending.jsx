import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  Calendar,
  Play,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FetchCard from './FetchCard';

export default function Trending() {
  const { trending, watchList } = useSelector((state) => state.movies.data);
  const { fetchTrendingMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();

  // Initial Fetch
  useEffect(() => {
    fetchTrendingMovies({ time: 'day', page: 1 });
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= trending.total_pages) {
      fetchTrendingMovies({ time: 'day', page: newPage });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!trending?.data || trending.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center animate-pulse">
          <Flame className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Loading Trends...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
   
        <main>
          <FetchCard movies={trending.data} />
        </main>

        {/* Pagination Footer */}
        <footer className="mt-20 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePageChange(trending.page - 1)}
              disabled={trending.page <= 1}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:scale-110 transition-transform shadow-lg"
            >
              <ChevronLeft className="dark:text-white" />
            </button>

            <div className="px-8 py-4 bg-zinc-900 dark:bg-white rounded-3xl shadow-2xl text-center min-w-[140px]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Page
              </p>
              <p className="text-xl font-black italic text-white dark:text-black">
                {trending.page} <span className="text-zinc-600">/</span>{' '}
                {trending.total_pages}
              </p>
            </div>

            <button
              onClick={() => handlePageChange(trending.page + 1)}
              disabled={trending.page >= trending.total_pages}
              className="p-4 rounded-2xl bg-red-600 text-white hover:scale-110 transition-transform shadow-lg shadow-red-600/30"
            >
              <ChevronRight />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
