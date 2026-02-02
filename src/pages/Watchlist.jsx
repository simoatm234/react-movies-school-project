import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { Trash2, Play, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Watchlist() {
  const { watchList } = useSelector((state) => state.movies.data);
  const { deleteWatchListItem } = useMovieActions();
  const navigate = useNavigate();

  // 1. Extract the array safely
  const movies = Array.isArray(watchList?.data) ? watchList.data : [];

  const handleRemove = (e, id) => {
    e.stopPropagation(); // Prevents navigating to details when clicking delete
    const currentStorage = JSON.parse(
      localStorage.getItem('watchList') || '[]'
    );
    const updated = currentStorage.filter((m) => m.id !== id);
    localStorage.setItem('watchList', JSON.stringify(updated));

    // Ensure this passes just the ID as we fixed in the hook
    deleteWatchListItem(id);
  };

  if (movies.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-400">
          Your watchlist is empty
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-red-600 text-white rounded-full font-bold"
        >
          Explore Movies
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black uppercase italic mb-10 dark:text-white">
        My <span className="text-red-600">Watchlist</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence>
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />

                {/* Delete Button */}
                <button
                  onClick={(e) => handleRemove(e, movie.id)}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-600 rounded-xl backdrop-blur-md transition-colors z-30"
                >
                  <Trash2 size={16} className="text-white" />
                </button>

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded-lg flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-current" />
                  <span className="text-[10px] text-white font-bold">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="mt-3">
                <h3 className="text-sm font-bold truncate dark:text-white group-hover:text-red-600 transition-colors">
                  {movie.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
