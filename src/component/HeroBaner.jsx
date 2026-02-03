import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroBanner() {
  const { upcoming } = useSelector((state) => state.movies.data);

  // take only first 5 movies
  const movies =
    upcoming?.data?.filter((m) => m.backdrop_path).slice(0, 5) || [];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  /* AUTO SLIDE */
  useEffect(() => {
    if (!movies.length || paused) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [movies.length, paused]);

  /* PAUSE WHEN TAB HIDDEN */
  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const movie = movies[index];
  if (!movie) return null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div
      className="relative w-full h-[600px] lg:h-[85vh] bg-zinc-950 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* IMAGE */}
          <img
            src={backdrop}
            alt={movie.title}
            className="w-full h-full object-cover opacity-50"
          />

          {/* GRADIENTS */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

          {/* CONTENT */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white mb-6 max-w-4xl">
                {movie.title}
              </h1>

              <p className="text-zinc-300 text-lg md:text-xl max-w-2xl line-clamp-3 mb-10">
                {movie.overview}
              </p>

              <button className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition shadow-xl shadow-red-600/30">
                Watch Now
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* DOTS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30 bg-black/30 backdrop-blur-md px-4 py-3 rounded-full">
        {movies.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === i
                ? 'w-10 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.7)]'
                : 'w-2 bg-zinc-500 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
