import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Play,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Eye,
} from 'lucide-react';

export default function Upcoming({ genreId }) {
  // Fix: Ensure watchList matches the case in your Redux slice (usually camelCase)
  const { upcoming, watchList } = useSelector((state) => state.movies.data);
  const { fetchUpcomingMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();

  // 1. Initial Fetch logic
  useEffect(() => {
    fetchUpcomingMovies({ page: 1, genreId });
  }, [genreId]);

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= upcoming.total_pages) {
      await fetchUpcomingMovies({ page: newPage, genreId });
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

  const formatDate = (date) => {
    if (!date) return 'Coming Soon';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!upcoming?.data || upcoming.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-red-500 animate-pulse mx-auto mb-4" />
          <h2 className="text-white font-bold uppercase tracking-tighter">
            Preparing Upcoming Releases...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 pt-20 pb-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter dark:text-white">
                  Upcoming <span className="text-red-600">Movies</span>
                </h1>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  The future of cinema, arriving soon
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-black dark:text-white">
                  {upcoming.total_results?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {upcoming.data.map((movie, index) => {
            // Watchlist check
            const inWatchList = Array.isArray(watchList?.data)
              ? watchList.data.find((w) => w.id === movie.id)
              : null;

            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Poster';

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 12) * 0.05 }}
                whileHover={{ y: -8 }}
                className="cursor-pointer group"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-3xl shadow-xl bg-zinc-200 dark:bg-zinc-900">
                  <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                    <Star size={10} className="text-yellow-400 fill-current" />
                    <span className="text-[10px] text-white font-black">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, movie)}
                    className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md border transition-all 
                      opacity-0 group-hover:opacity-100 ${
                        inWatchList
                          ? 'bg-red-600 border-red-500 text-white opacity-100'
                          : 'bg-black/60 border-white/10 text-white hover:bg-red-600'
                      }`}
                  >
                    <Heart
                      size={14}
                      fill={inWatchList ? 'currentColor' : 'none'}
                    />
                  </button>

                  {/* Hover Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-[10px] line-clamp-3 mb-3 opacity-80 font-medium">
                      {movie.overview}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-tighter">
                        {formatDate(movie.release_date)}
                      </span>
                      <div className="p-2 bg-white rounded-full">
                        <Play size={10} className="text-black fill-current" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text below card */}
                <div className="mt-3 px-1">
                  <h3 className="text-sm font-black uppercase italic truncate dark:text-white group-hover:text-red-600 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {movie.release_date?.split('-')[0] || 'TBA'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            onClick={() => handlePageChange(upcoming.page - 1)}
            disabled={upcoming.page <= 1}
            className="p-4 rounded-2xl border dark:border-zinc-800 dark:text-white shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="px-8 py-3 bg-zinc-900 dark:bg-white rounded-3xl shadow-xl text-center">
            <p className="text-[9px] font-black uppercase text-zinc-500">
              Timeline
            </p>
            <p className="text-lg font-black italic text-white dark:text-black">
              {upcoming.page} <span className="text-zinc-500">/</span>{' '}
              {upcoming.total_pages}
            </p>
          </div>

          <button
            onClick={() => handlePageChange(upcoming.page + 1)}
            disabled={upcoming.page >= upcoming.total_pages}
            className="p-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
