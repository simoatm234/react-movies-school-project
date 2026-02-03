import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion } from 'framer-motion';
import { Heart, Star, Play } from 'lucide-react';
export default function FetchCard({ movies }) {
  const { watchList } = useSelector((state) => state.movies.data);
  const { AddWatchList, deleteWatchListItem } = useMovieActions();
  const navigate = useNavigate();

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Coming Soon';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie, index) => {
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
                    <Star size={10} className="text-yellow-400 fill-current" />
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
    </div>
  );
}
