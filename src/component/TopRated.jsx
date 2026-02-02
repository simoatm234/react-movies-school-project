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

export default function TopRated({ genreId }) {
  const { fetchTopRatedMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();
  const { topRated, watchList } = useSelector((state) => state.movies.data);

  // 1. Fetch data on mount and when genreId changes
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
    <div className="space-y-12 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <AnimatePresence mode="popLayout">
          {topRated.data.map((movie, index) => {
            const inWatchList = Array.isArray(watchList?.data)
              ? watchList.data.find((w) => w.id === movie.id)
              : null;

            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Poster';

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (index % 12) * 0.05 }}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-xl bg-zinc-200 dark:bg-zinc-900">
                  <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay with Buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-between items-end">
                    <button
                      onClick={(e) => toggleFavorite(e, movie)}
                      className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all ${
                        inWatchList
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-black/40 border-white/10 text-white hover:bg-red-600'
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={inWatchList ? 'currentColor' : 'none'}
                      />
                    </button>

                    <div className="w-full flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-white/10">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="text-[10px] text-white font-bold">
                          {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                      <div className="p-2 bg-white text-black rounded-full shadow-lg">
                        <Play size={12} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 px-1">
                  <h3 className="text-[11px] font-black uppercase italic tracking-tight truncate dark:text-white group-hover:text-red-600 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-500 mt-0.5">
                    {movie.release_date?.split('-')[0] || 'N/A'}
                  </p>
                </div>
              </motion.div>
            );
          })}
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
    </div>
  );
}
