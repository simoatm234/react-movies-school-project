import React, { useEffect, useState } from 'react';
import Popular from '../component/Popular';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import FilterCard from '../component/FilterCard';

export default function PopularMovie() {
  const { fetchPopularMovies } = useMovieActions();
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    fetchPopularMovies({ genreId: activeGenre, page: 1 });
  }, [activeGenre, fetchPopularMovies]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      <FilterCard
        setActiveGenre={setActiveGenre}
        activeGenre={activeGenre}
        page={'popular'}
      />

      <motion.main
        key={activeGenre}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Popular genreId={activeGenre} />
      </motion.main>
    </div>
  );
}
