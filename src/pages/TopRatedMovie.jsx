import React, { useEffect, useState } from 'react';
import TopRated from '../component/TopRated';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import FilterCard from '../component/FilterCard';

export default function TopRatedMovie() {
  const { fetchTopRatedMovies } = useMovieActions();
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    fetchTopRatedMovies({ genreId: activeGenre, page: 1 });
  }, [activeGenre, fetchTopRatedMovies]);
  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
        <FilterCard
          setActiveGenre={setActiveGenre}
          activeGenre={activeGenre}
          page={'top rated'}
        />

        {/* 4. main content */}
        <motion.main
          key={activeGenre}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TopRated genreId={activeGenre} />
        </motion.main>
      </div>
    </>
  );
}
