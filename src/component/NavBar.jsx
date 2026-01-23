import React, { useEffect, useState, useRef } from 'react';
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
import { useMovieActions } from '../app/slice/dispatches/Dispatches';
import SearchContainer from './SearchContainer';
import { useSelector } from 'react-redux';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const { search } = useSelector((state) => state.movies.data);
  const [searchText, setSearchText] = useState('');
  const mobileMenuRef = useRef(null);
  const { fetchSearchMovies } = useMovieActions();

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

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
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const go = (path) => {
    navigate(path);
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };
  const handelSearsh = (e) => {
    setSearchText(e.target.value);
    console.log(searchText);
    fetchSearchMovies({ page: 1, value: searchText });
  };
  const handleNext = () => {
    fetchSearchMovies({ page: search.page + 1, value: searchText });
  };
  const handleBack = () => {
    fetchSearchMovies({ page: search.page - 1, value: searchText });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] transition-colors duration-300 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Logo */}
          <div
            onClick={() => go('/')}
            className="font-bold text-xl cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span className="text-red-600">🎬</span> MovieApp
          </div>

          {/*  Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isOpen = openMenu === item.id;
              const isParentActive =
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
                    onClick={() => go(item.path)}
                    className={`flex items-center gap-2 transition-colors py-1 text-sm font-medium ${isParentActive || isOpen ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-300 hover:text-red-500'}`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                    {item.children && (
                      <ChevronDown
                        size={14}
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
                        className="absolute top-full left-0 pt-4 w-48"
                      >
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => go(child.path)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg w-full text-left transition-colors ${location.pathname === child.path ? 'bg-red-500/10 text-red-500' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Search (Desktop) */}
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 text-zinc-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handelSearsh(e)}
                className="bg-zinc-100 dark:bg-zinc-900 pl-10 pr-4 py-2 rounded-full text-sm outline-none border border-transparent focus:border-red-600 w-40 xl:w-60 transition-all"
              />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-zinc-600" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[-1] md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <motion.div
                ref={mobileMenuRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-[280px] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-6 md:hidden shadow-2xl"
              >
                <div className="flex flex-col gap-6 mt-12">
                  {navItems.map((item) => (
                    <div key={item.id} className="space-y-3">
                      <button
                        onClick={() => !item.children && go(item.path)}
                        className="flex items-center gap-3 text-lg font-semibold"
                      >
                        <item.icon size={22} className="text-red-500" />{' '}
                        {item.name}
                      </button>
                      {item.children && (
                        <div className="ml-9 flex flex-col gap-3 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => go(child.path)}
                              className={`text-sm text-left ${location.pathname === child.path ? 'text-red-500' : 'text-zinc-500'}`}
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
      </nav>
      {searchText && (
        <SearchContainer handleNext={handleNext} handleBack={handleBack} />
      )}
    </>
  );
}
