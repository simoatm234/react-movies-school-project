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

export default function Popular({ genreId }) {
  // 1. Destructure necessary data from Redux
  const { popular, watchList } = useSelector((state) => state.movies.data);
  const { fetchPopularMovies, AddWatchList, deleteWatchListItem } =
    useMovieActions();
  const navigate = useNavigate();

  // 2. Initial Fetch (Sync with genre changes)
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
      await AddWatchList(updated); // Passes array directly
    } else {
      const updated = list.filter((w) => w.id !== movie.id);
      localStorage.setItem('watchList', JSON.stringify(updated));
      await deleteWatchListItem(movie.id); // Passes ID directly
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

  // Guard clause for empty data
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
        {/* HEADER */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter dark:text-white">
                  Popular <span className="text-purple-600">Movies</span>
                </h1>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  Global Trends & Blockbusters
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <Eye className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-black dark:text-white">
                  {popular.total_results?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MOVIES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <AnimatePresence mode="popLayout">
            {popular.data.map((movie, index) => {
              // Safety check for watchlist logic
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
                  transition={{ delay: (index % 12) * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-xl bg-zinc-200 dark:bg-zinc-900">
                    <img
                      src={poster}
                      alt={movie.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => toggleFavorite(e, movie)}
                          className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all ${
                            inWatchList
                              ? 'bg-red-600 border-red-500 text-white'
                              : 'bg-black/40 border-white/10 text-white hover:bg-purple-600'
                          }`}
                        >
                          <Heart
                            size={16}
                            fill={inWatchList ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>

                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform">
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md w-fit px-2 py-1 rounded-lg mb-2">
                          <Star
                            size={10}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="text-[10px] text-white font-bold">
                            {movie.vote_average?.toFixed(1)}
                          </span>
                        </div>
                        <h3 className="text-white font-black text-xs uppercase leading-tight line-clamp-2">
                          {movie.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 px-1">
                    <h4 className="text-[11px] font-black uppercase truncate dark:text-white group-hover:text-purple-600 transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-500">
                      {movie.release_date?.split('-')[0]}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

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
