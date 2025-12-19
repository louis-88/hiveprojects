
import React from 'react';
import { Search, Plus, Heart, Terminal } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  setView: (view: ViewType) => void;
  currentView: ViewType;
  favoritesCount: number;
}

const Header: React.FC<HeaderProps> = ({ onSearch, setView, currentView, favoritesCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="bg-hive p-1.5 rounded-lg transform group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M12 2L2 12l10 10 10-10L12 2zM5.5 12l6.5-6.5 6.5 6.5-6.5 6.5L5.5 12z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
            hive<span className="font-light text-slate-500 dark:text-slate-400">projects</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for projects..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-hive/50 dark:text-white transition-all placeholder-slate-500"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2 sm:gap-6">
          <button 
            onClick={() => setView('home')}
            className={`text-sm font-medium hover:text-hive transition-colors ${currentView === 'home' ? 'text-hive' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('categories')}
            className={`text-sm font-medium hover:text-hive transition-colors ${currentView === 'categories' ? 'text-hive' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Categories
          </button>
          <button 
            onClick={() => setView('developers')}
            className={`text-sm font-medium hover:text-hive transition-colors flex items-center gap-1 ${currentView === 'developers' || currentView === 'developer-detail' ? 'text-hive' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden md:inline">Devs</span>
          </button>
          <button 
            onClick={() => setView('favorites')}
            className={`text-sm font-medium hover:text-hive transition-colors flex items-center gap-1.5 ${currentView === 'favorites' ? 'text-hive' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="bg-hive text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setView('add-project')}
            className="bg-white dark:bg-slate-800 border-2 border-hive text-hive px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-hive hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add project</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
