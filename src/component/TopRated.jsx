import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopRated({ genreId }) {
  const { fetchTopRatedMovies } = useMovieActions();
  const navigate = useNavigate();

  const { topRated } = useSelector((state) => state.movies.data);

  const handleNext = async () => {
    if (topRated.page < topRated.total_pages) {
      await fetchTopRatedMovies({
        page: topRated.page + 1,
        genreId,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = async () => {
    if (topRated.page > 1) {
      await fetchTopRatedMovies({
        page: topRated.page - 1,
        genreId,
      });
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

  const navigateToMovie = (id) => {
    navigate(`/movie/${id}`);
  };

  if (!topRated?.data) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        ⭐ Top Rated Movies
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {topRated.data.map((movie, index) => {
          const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';

          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigateToMovie(movie.id)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={poster}
                  alt={movie.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

                {/* RATING */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-white">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                </div>

                {/* FAVORITE */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 p-2 bg-black/60 rounded-full
                             opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <Heart className="w-4 h-4 text-white" />
                </button>

                {/* INFO */}
                <div className="absolute bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition">
                  <h3 className="text-white font-bold text-sm line-clamp-2">
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
                        navigateToMovie(movie.id);
                      }}
                      className="p-2 bg-red-600 rounded-full hover:bg-red-700"
                    >
                      <Play className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* TITLE */}
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
      <div className="flex justify-center items-center gap-4 mt-12">
        <button
          onClick={handlePrev}
          disabled={topRated.page <= 1}
          className="p-3 rounded-full border disabled:opacity-40"
        >
          <ChevronLeft />
        </button>

        <span className="px-4 py-2 rounded-full bg-zinc-200 dark:bg-zinc-800 font-bold">
          {topRated.page} / {topRated.total_pages || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={topRated.page >= topRated.total_pages}
          className="p-3 rounded-full bg-red-600 text-white disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
