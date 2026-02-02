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
  const { upcoming } = useSelector((state) => state.movies.data);
  const { fetchupcomingMovies } = useMovieActions();
  const navigate = useNavigate();

  const handleBack = () => {
    if (upcoming.page > 1) {
      fetchupcomingMovies({ page: upcoming.page - 1, genreId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (upcoming.page < upcoming.total_pages) {
      fetchupcomingMovies({ page: upcoming.page + 1, genreId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 pt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold dark:text-white">
                  Upcoming Movies
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Movies that will be released soon
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {upcoming.total_results?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">
                  Page {upcoming.page} / {upcoming.total_pages || 1}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {upcoming?.data?.map((movie, index) => {
            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/500x750?text=No+Poster';

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer group"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-md bg-black">
                  <img
                    src={poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  {/* Rating */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-white">
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>

                  {/* Favorite */}
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60
                               opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  >
                    <Heart className="w-4 h-4 text-white" />
                  </button>

                  {/* Info */}
                  <div className="absolute bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {movie.title}
                    </h3>

                    <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                      {movie.overview || 'No description available'}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-zinc-400">
                        {formatDate(movie.release_date)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/movie/${movie.id}`);
                        }}
                        className="p-2 rounded-full bg-red-600 hover:bg-red-700"
                      >
                        <Play className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="mt-2 px-1">
                  <h3 className="text-sm font-semibold truncate dark:text-white group-hover:text-red-500">
                    {movie.title}
                  </h3>

                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-5 mt-14">
          <button
            onClick={handleBack}
            disabled={upcoming.page <= 1}
            className="p-3 rounded-full border dark:border-zinc-700 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          <span className="px-5 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 font-bold">
            {upcoming.page} / {upcoming.total_pages || 1}
          </span>

          <button
            onClick={handleNext}
            disabled={upcoming.page >= upcoming.total_pages}
            className="p-3 rounded-full bg-red-600 text-white disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
}
