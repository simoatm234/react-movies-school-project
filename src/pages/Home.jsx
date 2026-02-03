import React from 'react';
import { motion } from 'framer-motion';
import Popular from '../component/Popular';
import Trending from '../component/Trending';
import HeroBanner from '../component/HeroBaner'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pb-20">
      {/* Hero Banner */}
      <HeroBanner />

      <main className="space-y-24">
        {/* Trending Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-500 leading-tight">
              Trending Now
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-red-600 to-transparent mt-2 rounded-full" />
          </motion.div>

          <Trending />
        </section>

        {/* Popular Section */}
        <section className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 leading-tight">
              Popular Movies
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-transparent mt-2 rounded-full" />
          </motion.div>

          <Popular />
        </section>
      </main>
    </div>
  );
}
