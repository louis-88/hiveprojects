
import React from 'react';
import { List } from 'lucide-react';
import { Category, Project } from '../types';

interface CategorySidebarProps {
  categories: Category[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  projects: Project[];
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  projects
}) => {
  const getCount = (categoryName: string) => {
    return projects.filter(p => p.category === categoryName).length;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Categories List */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <List className="w-5 h-5 text-hive" />
          <h2 className="font-bold text-slate-900 dark:text-white">Categories</h2>
        </div>
        
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-left px-3 py-2.5 rounded-lg transition-all text-sm group ${
              activeCategory === null 
                ? 'bg-hive text-white shadow-md shadow-hive/20' 
                : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>All Projects</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeCategory === null ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {projects.length}
              </span>
            </div>
          </button>
          
          {categories.map((cat) => {
            const count = getCount(cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`text-left px-3 py-2.5 rounded-lg transition-all group ${
                  activeCategory === cat.name 
                    ? 'bg-hive text-white shadow-md shadow-hive/20 font-semibold' 
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate flex justify-between items-center">
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        activeCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </div>
                    <div className={`text-[10px] line-clamp-1 font-normal leading-tight mt-0.5 ${
                      activeCategory === cat.name ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-500'
                    }`}>
                      {cat.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
