import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Film,
  Tv,
  Heart,
  TrendingUp,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import SearchContainer from './SearchContainer';
import logo from '../assets/logo.png';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true); // Default to true for cinematic apps

  const { fetchSearchMovies } = useMovieActions();
  const { search } = useSelector((state) => state.movies.data);

  // --- Logic: Theme Persistence ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDarkTheme = savedTheme === 'dark';
    setIsDark(isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  // --- Logic: Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 1, name: 'Home', icon: Home, path: '/' },
    {
      id: 2,
      name: 'Movies',
      icon: Film,
      path: '/movies',
      children: [
        { id: 'm1', name: 'Popular', path: '/movies/popular' },
        { id: 'm2', name: 'Top Rated', path: '/movies/top-rated' },
        { id: 'm3', name: 'Upcoming', path: '/movies/upcoming' },
      ],
    },
    {
      id: 3,
      name: 'TV Shows',
      icon: Tv,

      children: [
        { id: 't1', name: 'Popular', path: '/tv/popular' },
        { id: 't2', name: 'Top Rated', path: '/tv/top-rated' },
      ],
    },
    { id: 4, name: 'Trending', icon: TrendingUp, path: '/trending' },
    { id: 5, name: 'Watchlist', icon: Heart, path: '/watchlist' },
  ];

  const go = (path) => {
    navigate(path);
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    fetchSearchMovies({ page: 1, value });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl py-3 shadow-2xl border-b border-zinc-200/50 dark:border-white/5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => go('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="atmMovie"
                className="h-9 md:h-11 object-contain relative z-10"
              />
              <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="hidden sm:block font-black text-2xl tracking-tighter italic uppercase dark:text-white">
              ATM<span className="text-red-600">Movie</span>
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isOpen = openMenu === item.id;
              const active =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <li
                  key={item.id}
                  onMouseEnter={() => item.children && setOpenMenu(item.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                  className="relative px-2"
                >
                  <button
                    onClick={() => !item.children && go(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 text-[11px] uppercase font-black tracking-[0.15em] transition-all rounded-xl ${
                      active
                        ? 'text-red-600 bg-red-600/5'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                    }`}
                  >
                    <item.icon size={14} strokeWidth={3} />
                    {item.name}
                    {item.children && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {item.children && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 backdrop-blur-xl"
                      >
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => go(child.path)}
                            className="block w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-xl transition-all"
                          >
                            {child.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden lg:flex relative group"
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors"
                size={16}
              />
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 w-40 focus:w-72 transition-all duration-500 rounded-2xl text-xs font-bold bg-zinc-100 dark:bg-white/5 border-none outline-none ring-1 ring-zinc-200 dark:ring-white/10 focus:ring-2 focus:ring-red-600 shadow-inner"
              />
            </form>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-500 transition-all border border-transparent hover:border-red-600/20"
            >
              {isDark ? (
                <Sun size={18} strokeWidth={2.5} />
              ) : (
                <Moon size={18} strokeWidth={2.5} />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Menu size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </nav>

      {/* Search results overlay logic remains same */}
      {searchText.trim() !== '' && (
        <SearchContainer
          searchText={searchText}
          handleNext={() =>
            fetchSearchMovies({ page: search.page + 1, value: searchText })
          }
          handleBack={() =>
            fetchSearchMovies({ page: search.page - 1, value: searchText })
          }
          closeSearch={() => setSearchText('')}
        />
      )}
    </>
  );
}
