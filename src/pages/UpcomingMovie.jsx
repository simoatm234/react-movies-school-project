import React, { useEffect, useState } from 'react';
import Upcoming from '../component/Upcoming';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal } from 'lucide-react';
import FilterCard from '../component/FilterCard';

export default function UpcomingMovie() {
  const { fetchUpcomingMovies } = useMovieActions();
  const [activeGenre, setActiveGenre] = useState(null);

  const genres = [
    { id: null, name: 'All' },
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 27, name: 'Horror' },
    { id: 878, name: 'Sci-Fi' },
    { id: 18, name: 'Drama' },
  ];

  useEffect(() => {
    fetchUpcomingMovies({ genreId: activeGenre, page: 1 });
  }, [activeGenre, fetchUpcomingMovies]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
        <FilterCard
                setActiveGenre={setActiveGenre}
                activeGenre={activeGenre}
                page={'up comming'}
              />
      {/* Main Content */}
      <motion.main
        key={activeGenre}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Upcoming genreId={activeGenre} />
      </motion.main>
    </div>
  );
}
