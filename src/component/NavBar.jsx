import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Film,
  Heart,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Menu,
  X,
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
  const [isDark, setIsDark] = useState(true);

  const { fetchSearchMovies } = useMovieActions();
  const { search } = useSelector((state) => state.movies.data);

  // Theme persistence and initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDarkMode = savedTheme === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) {
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

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    { id: 4, name: 'Watchlist', icon: Heart, path: '/watchlist' },
  ];

  const go = useCallback(
    (path) => {
      navigate(path);
      setOpenMenu(null);
      setIsMobileMenuOpen(false);
    },
    [navigate]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.trim()) {
      fetchSearchMovies({ page: 1, value });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl py-3 shadow-xl border-b border-zinc-200 dark:border-white/5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => go('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
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
                  className="relative px-1"
                >
                  <button
                    onClick={() => !item.children && go(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 text-[11px] uppercase font-black tracking-[0.15em] rounded-xl transition-all ${
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
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {item.children && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-2"
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

          {/* Actions */}
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
                placeholder="Search movies..."
                className="pl-10 pr-4 py-2.5 w-40 focus:w-72 transition-all duration-500 rounded-2xl text-xs font-bold bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-200 dark:ring-white/10 focus:ring-2 focus:ring-red-600 outline-none"
              />
            </form>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-red-600 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-3 rounded-2xl bg-red-600 text-white shadow-lg"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/95 z-[200] flex flex-col p-8 md:hidden"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-white/10 rounded-full text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => (item.children ? null : go(item.path))}
                    className="text-white text-3xl font-black uppercase tracking-tighter flex items-center gap-4"
                  >
                    <item.icon size={28} className="text-red-600" />
                    {item.name}
                  </button>
                  {item.children && (
                    <div className="ml-11 mt-4 flex flex-col gap-3 border-l border-white/10">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => go(child.path)}
                          className="text-zinc-400 text-lg pl-6 text-left"
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
        )}
      </AnimatePresence>

      {/* Search Results */}
      {searchText.trim() !== '' && (
        <SearchContainer
          searchText={searchText}
          handleNext={() =>
            fetchSearchMovies({
              page: (search?.page || 1) + 1,
              value: searchText,
            })
          }
          handleBack={() =>
            fetchSearchMovies({
              page: (search?.page || 1) - 1,
              value: searchText,
            })
          }
          closeSearch={() => setSearchText('')}
        />
      )}
    </>
  );
}
