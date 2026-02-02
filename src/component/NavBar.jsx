import React, { useEffect, useState, useRef, useCallback } from 'react';
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
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import SearchContainer from './SearchContainer';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  // Actions & State
  const { fetchSearchMovies } = useMovieActions();
  const { search } = useSelector((state) => state.movies.data);

  // UI Local State
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const navItems = [
    { id: 1, name: 'Home', icon: Home, path: '/' },
    {
      id: 2,
      name: 'Movies',
      icon: Film,

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
      path: '/tv',
      children: [
        { id: 't1', name: 'Popular', path: '/tv/popular' },
        { id: 't2', name: 'Top Rated', path: '/tv/top-rated' },
      ],
    },
    { id: 4, name: 'Trending', icon: TrendingUp, path: '/trending' },
    { id: 5, name: 'Watchlist', icon: Heart, path: '/watchlist' },
  ];

  useEffect(() => {
    if (!searchText.trim()) return;

    const timer = setTimeout(() => {
      fetchSearchMovies({ page: 1, value: searchText });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, fetchSearchMovies]);

  // --- LOGIC: THEME & CLICKS ---
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
    setSearchText('');
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavigation('/')}
            className="font-bold text-xl cursor-pointer flex items-center gap-2"
          >
            🎬 <span className="hidden sm:inline">MovieApp</span>
          </div>

          {/* Desktop Links */}
          <ul className="hidden md:flex gap-8">
            {navItems.map((item) => {
              const active =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              return (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenMenu(item.id)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    onClick={() =>
                      !item.children && handleNavigation(item.path)
                    }
                    className={`flex items-center gap-2 text-sm font-bold uppercase tracking-tighter transition-colors ${active ? 'text-red-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                  >
                    <item.icon size={16} /> {item.name}
                    {item.children && (
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${openMenu === item.id ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {item.children && openMenu === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl p-2"
                      >
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleNavigation(child.path)}
                            className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
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

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-600 transition-colors"
                size={16}
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Quick search..."
                className="pl-10 pr-4 py-2 w-64 rounded-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-red-600/20 transition-all text-sm font-medium"
              />
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay Container */}
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-zinc-950 z-[120] p-8 shadow-2xl"
            >
              <div className="space-y-8 mt-10">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() =>
                        !item.children && handleNavigation(item.path)
                      }
                      className="flex items-center gap-4 text-xl font-black italic uppercase text-zinc-900 dark:text-white"
                    >
                      <item.icon className="text-red-600" /> {item.name}
                    </button>
                    {item.children && (
                      <div className="ml-10 mt-4 space-y-4 border-l-2 border-zinc-100 dark:border-zinc-800 pl-4">
                        {item.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => handleNavigation(child.path)}
                            className="block text-sm font-bold text-zinc-500 hover:text-red-600"
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
