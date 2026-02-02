import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchContainer({
  handleNext,
  handleBack,
  closeSearch,
  searchText,
}) {
  const navigate = useNavigate();
  const { search, loading } = useSelector((state) => state.movies.data);
  const isLoading = useSelector((state) => state.movies.loading);

  const onMovieSelect = (id) => {
    navigate(`/movie/${id}`);
    closeSearch(); // Closes the search UI immediately
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[90]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-white/95 dark:bg-zinc-900/98 backdrop-blur-3xl rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-600 mb-1">
                Results for "{searchText}"
              </h2>
              <p className="text-[10px] font-bold text-zinc-500">
                Page {search?.page || 1} / {search?.total_pages || 1}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleBack}
                disabled={search?.page <= 1 || isLoading}
                className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={search?.page >= search?.total_pages || isLoading}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Results Grid/Scroll */}
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x min-h-[300px]">
            {search?.data?.length > 0 ? (
              search.data.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ y: -10 }}
                  onClick={() => onMovieSelect(movie.id)}
                  className="min-w-[160px] md:min-w-[200px] snap-start group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : 'https://via.placeholder.com/300x450?text=No+Poster'
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={movie.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Star
                          size={10}
                          className="fill-yellow-500 text-yellow-500"
                        />
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm font-black text-zinc-900 dark:text-zinc-100 truncate group-hover:text-red-600 transition-colors uppercase italic tracking-tighter">
                    {movie.title}
                  </h3>
                </motion.div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20 opacity-50">
                {isLoading ? (
                  <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Clapperboard size={48} className="mb-4 text-zinc-400" />
                    <p className="text-sm font-bold uppercase tracking-widest">
                      No matching titles found
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
