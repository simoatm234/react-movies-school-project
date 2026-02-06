import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  X,
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  Plus,
  Info,
  DollarSign,
  Check,
  Globe,
  Clapperboard,
} from 'lucide-react';

import { useMovieActions } from '../app/slice/dispatches/Dispatches';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/original';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/1920x1080?text=No+Image';

export default function ShowMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectMovie, fetchMovieVideos, AddWatchList } = useMovieActions();

  // ui state
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // redux state
  const movie = useSelector((state) => state.movies.data.movie.data);
  const watchlist = useSelector(
    (state) => state.movies?.data?.watchList?.data || []
  );

  const videos = useSelector((state) => state.movies.data.movie.videos);
  const loading = useSelector((state) => state.movies.loading);
  // check if movie in watch list
  const inWatchList = useMemo(() => {
    return Boolean(watchlist?.find((item) => String(item.id) === String(id)));
  }, [watchlist, id]);

  // data initialization
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      // only fetch if the id has changed to prevent infinite loops or waste
      const currentMovieId = movie?.id?.toString();
      if (currentMovieId !== id) {
        await Promise.all([selectMovie(id), fetchMovieVideos(id)]);
      }
    };

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, selectMovie, fetchMovieVideos]);

  // video selection
  const trailer = useMemo(() => {
    if (!Array.isArray(videos)) return null;
    return (
      videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
      videos[0]
    );
  }, [videos]);

  const handleOpenTrailer = (video = trailer) => {
    if (video) {
      setSelectedVideo(video);
      setShowTrailer(true);
    }
  };
  const hndelAddWatchList = async () => {
    const stored = localStorage.getItem('watchList');
    const currentList = stored ? JSON.parse(stored) : [];

    const updatedList = [...currentList, movie];
    localStorage.setItem('watchList', JSON.stringify(updatedList));
    await AddWatchList(updatedList);
  };

  // formatting
  const formatCurrency = (num) => {
    if (num === undefined || num === null || num === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // render guards
  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 overflow-x-hidden">
      {/*  hero section */}
      <header className="relative h-[75vh] md:h-[85vh] w-full">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={
              movie.backdrop_path
                ? `${IMG_BASE_URL}${movie.backdrop_path}`
                : PLACEHOLDER_IMAGE
            }
            className="w-full h-full object-cover"
            alt={movie.title}
            onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-zinc-950 via-white/30 dark:via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent" />
        </div>

        <nav className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-10 left-6 p-3 rounded-full bg-black/20 hover:bg-red-600 backdrop-blur-md text-white transition-all group"
          >
            <ChevronLeft
              size={24}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </button>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="max-w-3xl"
          >
            {movie.tagline && (
              <span className="inline-block px-3 py-1 mb-4 text-xs font-black tracking-[0.3em] uppercase bg-red-600 text-white rounded">
                {movie.tagline}
              </span>
            )}

            <h1 className="text-6xl md:text-9xl font-black mb-4 tracking-tighter uppercase italic leading-[0.9]">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-xs md:text-sm font-bold uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
                <Star size={16} className="fill-current" />
                {movie.vote_average?.toFixed(1) || '0.0'}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> {movie.runtime || '??'} MIN
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />{' '}
                {movie.release_date?.split('-')[0] || 'TBA'}
              </span>
              <span className="hidden md:block px-2 py-0.5 border border-zinc-500 rounded text-[10px]">
                4K ULTRA HD
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleOpenTrailer()}
                disabled={!trailer}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95 ${
                  trailer
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/40'
                    : 'bg-zinc-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <Play size={20} className="fill-current" />
                {trailer ? 'WATCH TRAILER' : 'NO TRAILER AVAILABLE'}
              </button>

              <button
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-black transition-all ${
                  inWatchList
                    ? 'bg-green-600 text-white cursor-default'
                    : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300'
                }`}
                disabled={inWatchList}
                onClick={hndelAddWatchList}
              >
                {inWatchList ? <Check size={20} /> : <Plus size={20} />}
                {inWatchList ? 'IN WATCHLIST' : 'WATCHLIST'}
              </button>
            </div>
          </motion.div>
        </nav>
      </header>

      {/* 2. content grid */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 -mt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h3 className="flex items-center gap-2 text-red-600 uppercase tracking-widest text-xs font-black mb-4">
                <Info size={16} /> the storyline
              </h3>
              <p className="text-xl md:text-2xl font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                {movie.overview || 'No overview available for this title.'}
              </p>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs font-black mb-6">
                <Clapperboard size={16} /> categories
              </h3>
              <div className="flex flex-wrap gap-3">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-sm hover:border-red-600 transition-colors cursor-default"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </section>

            {Array.isArray(videos) && videos.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-xs font-black mb-6">
                  <Play size={16} /> videos & clips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.slice(0, 4).map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleOpenTrailer(video)}
                      className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group bg-zinc-900"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                        alt={video.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Play
                          size={48}
                          className="text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white text-sm font-bold truncate">
                          {video.name}
                        </p>
                        <p className="text-zinc-400 text-xs">{video.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl space-y-8 sticky top-8">
              <h3 className="text-sm font-black uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-4">
                movie details
              </h3>

              <div className="space-y-6">
                <DetailRow
                  icon={<DollarSign />}
                  label="budget"
                  value={formatCurrency(movie.budget)}
                />
                <DetailRow
                  icon={<Globe />}
                  label="language"
                  value={movie.original_language?.toUpperCase()}
                />
                <DetailRow
                  icon={<Info />}
                  label="status"
                  value={movie.status}
                />

                {movie.homepage && (
                  <div className="pt-4">
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-extrabold text-sm hover:opacity-80 transition active:scale-95"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 3. video modal */}
      <AnimatePresence>
        {showTrailer && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-zinc-950/95 backdrop-blur-md"
          >
            <div
              className="absolute inset-0"
              onClick={() => setShowTrailer(false)}
            />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>

              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ icon, label, value = 'N/A' }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-zinc-500">
        {React.cloneElement(icon, { size: 16 })}
        <span className="text-xs font-bold uppercase tracking-tighter">
          {label}
        </span>
      </div>
      <span className="font-mono text-sm font-bold text-right">{value}</span>
    </div>
  );
}
