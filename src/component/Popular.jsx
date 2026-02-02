import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Star,
  Calendar,
  Play,
  Heart,
  Eye,
  Clock,
} from 'lucide-react';

export default function Popular() {
  const { popular } = useSelector((state) => state.movies.data);
  const { fetchPopularMovies } = useMovieActions();
  const navigate = useNavigate();

  const handleBack = () => {
    if (popular.page > 1) {
      fetchPopularMovies(popular.page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (popular.page < popular.total_pages) {
      fetchPopularMovies(popular.page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 pt-20">
      <section className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
                  Popular Movies
                </h1>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">
                  Discover the most watched and talked-about movies worldwide.
                  These films are capturing audience attention right now.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {popular.total_results?.toLocaleString() || 0} movies
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  Page {popular.page} of {popular.total_pages || 1}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Movies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {popular.data.map((movie, index) => {
            const imgBase = 'https://image.tmdb.org/t/p/w500';
            const posterUrl = movie.poster_path
              ? `${imgBase}${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Poster&bg=1f2937&text=white';

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => navigateToMovie(movie.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-black/30">
                  {/* Poster Image */}
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-bold text-white">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600">
                    <Heart className="w-4 h-4 text-white" />
                  </button>

                  {/* Hover Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">
                      {movie.title}
                    </h3>
                    <p className="text-zinc-300 text-xs line-clamp-2 mb-3">
                      {movie.overview || 'No description available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        {movie.release_date
                          ? formatDate(movie.release_date)
                          : 'Coming Soon'}
                      </span>
                      <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                        <Play className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title (Outside Card) */}
                <div className="mt-3 px-1">
                  <h3 className="font-semibold text-zinc-900 dark:text-white text-sm truncate group-hover:text-red-500 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {movie.release_date?.split('-')[0] || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleBack}
            disabled={popular.page <= 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2 mx-4">
            <span className="px-4 py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 shadow-sm min-w-[120px] text-center select-none">
              Page {popular.page}
              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                / {popular.total_pages || 1}
              </span>
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={popular.page >= popular.total_pages}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Empty State */}
        {popular.data.length === 0 && !popular.loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <TrendingUp className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
              No popular movies found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-500 max-w-md mx-auto">
              It seems no movies are trending at the moment. Check back later
              for updates!
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
