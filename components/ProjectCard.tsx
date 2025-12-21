
import React from 'react';
import { Heart, Github, ExternalLink, Users, Code, ChevronRight, Calendar } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  layout?: 'list' | 'grid';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onProjectClick: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, layout = 'list', isFavorite, onToggleFavorite, onProjectClick }) => {
  const getStatusStyles = (status: Project['status']) => {
    switch (status) {
      case 'Live/Released':
        return 'bg-emerald-500 text-white';
      case 'Beta':
        return 'bg-indigo-500 text-white';
      case 'Alpha':
        return 'bg-amber-500 text-white';
      case 'Development':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  // Fallback logic: Use logo if thumbnail is missing
  const cardThumbnail = project.thumbnail || project.logo;

  if (layout === 'grid') {
    return (
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all group cursor-pointer flex flex-col h-full"
        onClick={() => onProjectClick(project.id)}
      >
        {/* Thumbnail Section */}
        <div className="w-full aspect-video flex-shrink-0 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shadow-inner">
          <img 
            src={cardThumbnail} 
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.name)}&background=random&color=fff&size=400`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          
          {/* Top Overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.status && (
              <div className={`px-2 py-0.5 text-[8px] font-black uppercase rounded shadow-sm ${getStatusStyles(project.status)}`}>
                {project.status}
              </div>
            )}
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.id); }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all border ${
              isFavorite 
                ? 'bg-red-500/90 border-red-400 text-white shadow-lg' 
                : 'bg-black/20 border-white/20 text-white hover:bg-black/40'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Bottom Indicators */}
          <div className="absolute bottom-3 left-3">
             <span className="text-[10px] font-black uppercase tracking-wider text-white bg-hive px-2 py-0.5 rounded shadow-sm">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-hive transition-colors mb-2 line-clamp-1">
            {project.name}
          </h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between gap-4 border-t border-slate-50 dark:border-slate-800">
            {/* Minimal Team */}
            {project.team && (
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, idx) => (
                  <img 
                    key={idx}
                    src={member.avatar}
                    alt={member.name}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <button 
                onClick={(e) => { e.stopPropagation(); onProjectClick(project.id); }}
                className="p-2 text-slate-400 hover:text-hive transition-colors"
                title="View Details"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <a 
                href={project.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-hive transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all group cursor-pointer"
      onClick={() => onProjectClick(project.id)}
    >
      <div className="flex flex-col sm:flex-row p-5 gap-6">
        {/* Thumbnail - Enhanced to 16:9 */}
        <div className="w-full sm:w-64 aspect-video flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-slate-50 dark:border-slate-700 shadow-inner">
          <img 
            src={cardThumbnail} 
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.name)}&background=random&color=fff&size=400`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          
          {project.status && (
            <div className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-black uppercase rounded shadow-sm ${getStatusStyles(project.status)}`}>
              {project.status}
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-lg">
              <span className="w-3 h-3 flex items-center justify-center">📸</span>
              {project.gallery.length + 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-hive transition-colors flex items-center gap-2">
                {project.name}
                {project.isOpenSource === false && (
                  <span title="Closed Source">
                    <Code className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {project.lastEdited && (
                  <span className="flex items-center gap-1 text-[8px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                    <Calendar className="w-2.5 h-2.5" />
                    Updated: {project.lastEdited}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-hive bg-hive/5 px-2 py-0.5 rounded border border-hive/10">
                  {project.category}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.id); }}
                className={`p-2 rounded-full transition-all border ${
                  isFavorite 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500' 
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-400'
                }`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites (max 10)"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
            {/* Team Avatars */}
            {project.team && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, idx) => (
                    <img 
                      key={idx}
                      src={member.avatar}
                      alt={member.name}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200"
                      title={`${member.name} - ${member.role}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <Users className="w-3 h-3 inline mr-1" />
                  Team
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 transition-all"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              
              <button 
                onClick={(e) => { e.stopPropagation(); onProjectClick(project.id); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-700 transition-all"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <a 
                href={project.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white bg-hive rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-hive/10"
              >
                <span>Launch</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
