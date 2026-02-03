import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export default function FilterCard({ page, setActiveGenre, activeGenre }) {
  const genres = [
    { id: null, name: 'All' },
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 27, name: 'Horror' },
    { id: 878, name: 'Sci-Fi' },
    { id: 18, name: 'Drama' },
  ];

  return (
    <>
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <header className="mb-16 space-y-6">
          {/* Page Title */}
          {page && (
            <h2 className="text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white uppercase">
              {page}
            </h2>
          )}

          {/* Curated Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles size={16} className="text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Curated Trends
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
              Browse <br />
              <span className="text-transparent stroke-zinc-900 dark:stroke-zinc-100 [-webkit-text-stroke:1px_currentColor] opacity-20">
                Genres
              </span>
            </h1>

            {/* Genre Tabs */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <SlidersHorizontal size={14} /> Filter results
              </div>

              <div className="flex flex-wrap gap-2 p-1.5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-2xl rounded-[2rem] border border-white dark:border-zinc-800 shadow-2xl">
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGenre(g.id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                      activeGenre === g.id
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-105'
                        : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
