import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, Eye } from 'lucide-react';
import FetchCard from './FetchCard';

export default function Upcoming({ genreId }) {
  const { upcoming } = useSelector((state) => state.movies.data);
  const { fetchUpcomingMovies } = useMovieActions();

  //  Initial Fetch logic
  useEffect(() => {
    fetchUpcomingMovies({ page: 1, genreId });
  }, [genreId]);

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= upcoming.total_pages) {
      await fetchUpcomingMovies({ page: newPage, genreId });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!upcoming?.data || upcoming.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-red-500 animate-pulse mx-auto mb-4" />
          <h2 className="text-white font-bold uppercase tracking-tighter">
            Preparing Upcoming Releases...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 pt-20 pb-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter dark:text-white">
                  Upcoming <span className="text-red-600">Movies</span>
                </h1>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                  The future of cinema, arriving soon
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-black dark:text-white">
                  {upcoming.total_results?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}

        <main>
          <FetchCard movies={upcoming.data} />
        </main>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            onClick={() => handlePageChange(upcoming.page - 1)}
            disabled={upcoming.page <= 1}
            className="p-4 rounded-2xl border dark:border-zinc-800 dark:text-white shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="px-8 py-3 bg-zinc-900 dark:bg-white rounded-3xl shadow-xl text-center">
            <p className="text-[9px] font-black uppercase text-zinc-500">
              Timeline
            </p>
            <p className="text-lg font-black italic text-white dark:text-black">
              {upcoming.page} <span className="text-zinc-500">/</span>{' '}
              {upcoming.total_pages}
            </p>
          </div>

          <button
            onClick={() => handlePageChange(upcoming.page + 1)}
            disabled={upcoming.page >= upcoming.total_pages}
            className="p-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}
