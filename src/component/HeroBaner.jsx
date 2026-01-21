import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroBanner() {
  const { upcoming } = useSelector((state) => state.movies.data);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!upcoming.data || upcoming.data.length === 0) return;

    const timer = setInterval(() => {
      setIndex(
        (prevIndex) => (prevIndex + 1) % upcoming.data.slice(0, 5).length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [upcoming.data]);

  const movie = upcoming.data?.[index];

  if (!movie) return null;

  return (
    <div className="relative w-full h-[600px] lg:h-[85vh] bg-zinc-950 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight max-w-4xl">
                {movie.title}
              </h1>
              <p className="text-zinc-300 text-lg md:text-xl max-w-2xl line-clamp-3 mb-10">
                {movie.overview}
              </p>
              <button className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                Watch Now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 bg-black/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/5">
        {upcoming.data.slice(0, 5).map((movie, i) => (
          <button
            key={movie.id} // Use movie.id for a better key
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ease-out cursor-pointer ${
              index === i
                ? 'w-10 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                : 'w-2 bg-zinc-500 hover:bg-zinc-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
