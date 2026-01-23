import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';


export default function SearchContainer({ handleNext, handleBack }) {
  const { search } = useSelector((state) => state.movies.data);
  const { loading } = useSelector((state) => state.movies);

  return (
    <AnimatePresence>
      <div className="fixed top-18 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-[60]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/90 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex flex-col">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Search Results
                </h2>
                <p className="text-[10px] text-zinc-500 font-medium">
                  Showing Page {search.page} of {search.total_pages}
                </p>
              </div>

              {/* Compact Pagination Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  disabled={search.page <= 1}
                  className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft
                    size={16}
                    className="text-zinc-900 dark:text-white"
                  />
                </button>
                <button
                  onClick={handleNext}
                  disabled={search.page >= search.total_pages}
                  className="p-2 rounded-full bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Area */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x min-h-[220px]">
              {search.data && search.data.length > 0 ? (
                search.data.map((movie) => (
                  <motion.div
                    key={movie.id}
                    whileHover={{ y: -5 }}
                    className="min-w-[140px] md:min-w-[180px] snap-start group"
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : 'https://via.placeholder.com/300x450?text=No+Poster'
                        }
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={movie.title}
                      />
                      {/* Floating Rating */}
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 border border-white/10">
                        <Star
                          size={10}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-white text-[10px] font-bold">
                          {movie.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-3 text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate px-1 group-hover:text-red-600 transition-colors">
                      {movie.title}
                    </h3>
                  </motion.div>
                ))
              ) : (
                <div className="min-w-full flex flex-col items-center justify-center py-12">
                  {loading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                        Searching...
                      </p>
                    </div>
                  ) : (
                    <p className="text-zinc-500 font-medium italic text-sm bg-zinc-100 dark:bg-zinc-800/50 px-6 py-2 rounded-full border border-zinc-200 dark:border-zinc-800">
                      No data found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
