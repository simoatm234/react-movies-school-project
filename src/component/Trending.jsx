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

export default function Trending() {
  const { trending, watchList } = useSelector((state) => state.movies.data);
  const { fetchTrendingMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();

  // Initial Fetch on Mount
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
      await AddWatchList(updated); // Pass array directly
    } else {
      const updated = list.filter((w) => w.id !== movie.id);
      localStorage.setItem('watchList', JSON.stringify(updated));
      await deleteWatchListItem(movie.id); // Pass ID directly
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
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Live Updates
              </span>
            </div>
            <h1 className="text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">
              Trending <span className="text-red-600">Now</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              <p className="text-[10px] text-zinc-500 uppercase font-bold">
                Total Results
              </p>
              <p className="font-black dark:text-white">
                {trending.total_results?.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trending.data.map((movie, index) => {
            const inWatchList = Array.isArray(watchList?.data)
              ? watchList.data.find((w) => w.id === movie.id)
              : null;

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 12) * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl bg-zinc-200 dark:bg-zinc-900">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-white text-xs line-clamp-3 mb-4 opacity-0 group-hover:opacity-100 transition-delay-300">
                      {movie.overview}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-400 font-bold">
                        {formatDate(movie.release_date)}
                      </span>
                      <div className="p-2 bg-white text-black rounded-full">
                        <Play size={12} fill="black" />
                      </div>
                    </div>
                  </div>

                  {/* Actions (Top) */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 border border-white/10">
                      <Star
                        size={10}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-[10px] text-white font-black">
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, movie)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all ${
                        inWatchList
                          ? 'bg-red-600 text-white'
                          : 'bg-black/60 text-white hover:bg-red-600'
                      }`}
                    >
                      <Heart
                        size={14}
                        fill={inWatchList ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-4 px-1">
                  <h3 className="text-sm font-black uppercase italic truncate dark:text-white group-hover:text-red-600 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {movie.media_type || 'Movie'} •{' '}
                    {movie.release_date?.split('-')[0]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

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
