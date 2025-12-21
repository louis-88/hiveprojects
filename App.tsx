
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CategorySidebar from './components/CategorySidebar';
import ProjectCard from './components/ProjectCard';
import { projects, categories } from './data';
import { ViewType, Project, TeamMember, TimelineEvent } from './types';
import { Bell, ChevronRight, ChevronLeft, X, HelpCircle, Send, Search, Sparkles, LayoutGrid, Heart, Trash2, ArrowLeft, ExternalLink, Info, MessageCircle, Code, Users, Calendar, Link as LinkIcon, Sun, Moon, Terminal, User, Plus, Copy, Check, Globe, Github, RefreshCw, Loader2, Edit3, Image as ImageIcon, Camera, HeartHandshake, Maximize2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedDeveloperUsername, setSelectedDeveloperUsername] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Submission Form State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCat, setFormCat] = useState(categories[0].name);
  const [formThumb, setFormThumb] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formWeb, setFormWeb] = useState('');
  const [formGit, setFormGit] = useState('');
  const [formAnn, setFormAnn] = useState('');
  const [formCont, setFormCont] = useState('');
  const [formStatus, setFormStatus] = useState<Project['status']>('Development');
  const [formIsOpen, setFormIsOpen] = useState(true);
  const [formTeam, setFormTeam] = useState<TeamMember[]>([]);
  const [formSupporters, setFormSupporters] = useState<TeamMember[]>([]);
  const [formTimeline, setFormTimeline] = useState<TimelineEvent[]>([]);
  const [formLastEdited, setFormLastEdited] = useState(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [copySuccess, setCopySuccess] = useState(false);
  const [syncingIndex, setSyncingIndex] = useState<{ type: 'team' | 'supporter', index: number } | null>(null);

  const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [selectedProjectId]);
  const galleryItems = useMemo(() => {
    if (!selectedProject) return [];
    return [selectedProject.thumbnail, ...(selectedProject.gallery || [])];
  }, [selectedProject]);

  const generatedJson = useMemo(() => {
    const id = formName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const projectObj: Project = {
      id: id || 'new-project',
      name: formName || 'New Project',
      description: formDesc || 'Short description goes here...',
      category: formCat,
      thumbnail: formThumb || 'https://images.hive.blog/DQm...',
      gallery: formGallery.length > 0 ? formGallery.filter(url => !!url) : undefined,
      websiteUrl: formWeb || 'https://...',
      githubUrl: formGit || undefined,
      announcementUrl: formAnn || undefined,
      contactUrl: formCont || undefined,
      status: formStatus,
      isOpenSource: formIsOpen,
      team: formTeam.length > 0 ? formTeam : undefined,
      supporters: formSupporters.length > 0 ? formSupporters : undefined,
      timeline: formTimeline.length > 0 ? formTimeline : undefined,
      lastEdited: formLastEdited
    };
    return JSON.stringify(projectObj, null, 2);
  }, [formName, formDesc, formCat, formThumb, formGallery, formWeb, formGit, formAnn, formCont, formStatus, formIsOpen, formTeam, formSupporters, formTimeline, formLastEdited]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem('hive-project-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hive-project-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) return prev.filter(fid => fid !== id);
      if (prev.length >= 10) {
        alert("You can only have up to 10 favorite projects.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const nextLightbox = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
    }
  }, [lightboxIndex, galleryItems.length]);

  const prevLightbox = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
    }
  }, [lightboxIndex, galleryItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = activeCategory ? project.category === activeCategory : true;
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const uniqueDevelopers = useMemo(() => {
    const devMap = new Map<string, { username: string; roles: Set<string>; projects: Set<string>; avatar: string }>();
    projects.forEach(project => {
      [...(project.team || []), ...(project.supporters || [])].forEach(member => {
        const username = member.name.toLowerCase();
        if (!devMap.has(username)) {
          devMap.set(username, {
            username: member.name,
            roles: new Set([member.role]),
            projects: new Set([project.name]),
            avatar: member.avatar
          });
        } else {
          const entry = devMap.get(username)!;
          entry.roles.add(member.role);
          entry.projects.add(project.name);
        }
      });
    });
    return Array.from(devMap.values()).sort((a, b) => b.projects.size - a.projects.size);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveGalleryIndex(0);
    setCurrentView('project-detail');
    window.scrollTo(0, 0);
  };

  const handleDeveloperClick = (username: string) => {
    setSelectedDeveloperUsername(username);
    setCurrentView('developer-detail');
    window.scrollTo(0, 0);
  };

  const handleRequestChanges = (project: Project) => {
    setFormName(project.name);
    setFormDesc(project.description);
    setFormCat(project.category);
    setFormThumb(project.thumbnail);
    setFormGallery(project.gallery || []);
    setFormWeb(project.websiteUrl);
    setFormGit(project.githubUrl || '');
    setFormAnn(project.announcementUrl || '');
    setFormCont(project.contactUrl || '');
    setFormStatus(project.status || 'Development');
    setFormIsOpen(project.isOpenSource ?? true);
    setFormTeam(project.team ? [...project.team] : []);
    setFormSupporters(project.supporters ? [...project.supporters] : []);
    setFormTimeline(project.timeline ? [...project.timeline] : []);
    setFormLastEdited(project.lastEdited || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    setCurrentView('add-project');
    window.scrollTo(0, 0);
  };

  const addGalleryImage = () => {
    if (formGallery.length >= 5) {
      alert("You can add up to 5 gallery images.");
      return;
    }
    setFormGallery([...formGallery, '']);
  };

  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...formGallery];
    updated[index] = value;
    setFormGallery(updated);
  };

  const removeGalleryImage = (index: number) => {
    setFormGallery(formGallery.filter((_, i) => i !== index));
  };

  const addTeamMember = (type: 'team' | 'supporter') => {
    if (type === 'team') {
      setFormTeam([...formTeam, { name: '', role: '', avatar: '' }]);
    } else {
      setFormSupporters([...formSupporters, { name: '', role: '', avatar: '' }]);
    }
  };

  const syncHiveUser = async (type: 'team' | 'supporter', index: number) => {
    const list = type === 'team' ? formTeam : formSupporters;
    const username = list[index].name.toLowerCase().trim().replace('@', '');
    if (!username) return;

    setSyncingIndex({ type, index });
    try {
      const response = await fetch('https://api.hive.blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'condenser_api.get_accounts',
          params: [[username]],
          id: 1,
        }),
      });

      const data = await response.json();
      if (data.result && data.result.length > 0) {
        const account = data.result[0];
        let avatarUrl = `https://images.hive.blog/u/${username}/avatar`;
        
        try {
          const metadata = JSON.parse(account.posting_json_metadata || account.json_metadata || '{}');
          if (metadata.profile && metadata.profile.profile_image) {
            avatarUrl = metadata.profile.profile_image;
          }
        } catch (e) {
          console.error("Metadata parse error", e);
        }

        if (type === 'team') {
          const updated = [...formTeam];
          updated[index] = { ...updated[index], name: account.name, avatar: avatarUrl };
          setFormTeam(updated);
        } else {
          const updated = [...formSupporters];
          updated[index] = { ...updated[index], name: account.name, avatar: avatarUrl };
          setFormSupporters(updated);
        }
      } else {
        alert(`Hive user @${username} not found on blockchain.`);
      }
    } catch (error) {
      console.error("Blockchain sync failed", error);
      alert("Failed to sync with Hive blockchain. Please try again.");
    } finally {
      setSyncingIndex(null);
    }
  };

  const updateMember = (type: 'team' | 'supporter', index: number, field: keyof TeamMember, value: string) => {
    if (type === 'team') {
      const updated = [...formTeam];
      updated[index] = { ...updated[index], [field]: value };
      setFormTeam(updated);
    } else {
      const updated = [...formSupporters];
      updated[index] = { ...updated[index], [field]: value };
      setFormSupporters(updated);
    }
  };

  const removeMember = (type: 'team' | 'supporter', index: number) => {
    if (type === 'team') {
      setFormTeam(formTeam.filter((_, i) => i !== index));
    } else {
      setFormSupporters(formSupporters.filter((_, i) => i !== index));
    }
  };

  const addTimelineEvent = () => {
    setFormTimeline([...formTimeline, { date: '', title: '', description: '', linkUrl: '' }]);
  };

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: string) => {
    const updated = [...formTimeline];
    updated[index] = { ...updated[index], [field]: value };
    setFormTimeline(updated);
  };

  const removeTimelineEvent = (index: number) => {
    setFormTimeline(formTimeline.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const renderHome = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
      <aside className="lg:col-span-3 order-2 lg:order-1">
        <CategorySidebar 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          projects={projects}
        />
      </aside>
      <main className="lg:col-span-9 order-1 lg:order-2">
        {!activeCategory && !searchQuery && (
          <div className="mb-8 p-6 bg-gradient-to-br from-hive to-red-600 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-hive/10">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-red-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-100">Featured Ecosystem</span>
              </div>
              <h2 className="text-2xl font-black mb-2">Welcome to Hive Projects</h2>
              <p className="text-red-50 text-sm leading-relaxed opacity-90 max-w-lg">
                Explore the most advanced decentralized ecosystem. From social media to gaming, find everything built on the Hive blockchain.
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-hive/10 rounded-lg">
              <Bell className="w-5 h-5 text-hive" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeCategory ? activeCategory : 'Recent Discoveries'}
            </h2>
          </div>
          <button 
            onClick={() => setCurrentView('categories')}
            className="text-sm text-hive font-bold hover:underline flex items-center gap-1 group"
          >
            All Categories <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isFavorite={favorites.includes(project.id)}
                onToggleFavorite={toggleFavorite}
                onProjectClick={handleProjectClick}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center">
              <div className="inline-flex p-5 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
                <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                Clear all filters and try again.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );

  const renderAddProject = () => (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-hive/10 rounded-2xl">
          <Send className="w-8 h-8 text-hive" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Submit Project</h1>
          <p className="text-slate-500 dark:text-slate-400">Complete the engineering profile and generate your custom_json payload</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-10">
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> Identity & Branding
            </h3>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Name</label>
                <input value={formName} onChange={e => setFormName(e.target.value)} type="text" placeholder="e.g. Hive Social" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                <select value={formCat} onChange={e => setFormCat(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none appearance-none">
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Thumbnail (16:9 recommended)</label>
                <input value={formThumb} onChange={e => setFormThumb(e.target.value)} type="url" placeholder="https://..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Pitch</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={3} placeholder="A brief description of what makes this project awesome..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none resize-none"></textarea>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive flex items-center gap-2">
                <Camera className="w-4 h-4" /> Visual Assets (Max 5)
              </h3>
              <button onClick={addGalleryImage} className="p-2 bg-hive/10 text-hive rounded-lg hover:bg-hive hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {formGallery.map((img, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 relative group">
                  <button onClick={() => removeGalleryImage(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"><Trash2 className="w-3 h-3" /></button>
                  <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Image URL #{idx + 1}</label>
                    <input 
                      value={img} 
                      onChange={e => updateGalleryImage(idx, e.target.value)} 
                      type="url" 
                      placeholder="https://..." 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs outline-none" 
                    />
                  </div>
                  {img && (
                    <div className="w-20 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
              {formGallery.length === 0 && <p className="text-xs text-slate-400 text-center py-4 italic">No gallery images added.</p>}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive mb-6 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Connection Mesh
            </h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><Globe className="w-5 h-5" /></div>
                <input value={formWeb} onChange={e => setFormWeb(e.target.value)} type="url" placeholder="Main Website URL" className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><Github className="w-5 h-5" /></div>
                <input value={formGit} onChange={e => setFormGit(e.target.value)} type="url" placeholder="GitHub Repository (Optional)" className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><MessageCircle className="w-5 h-5" /></div>
                <input value={formCont} onChange={e => setFormCont(e.target.value)} type="url" placeholder="Contact/Discord URL" className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><Bell className="w-5 h-5" /></div>
                <input value={formAnn} onChange={e => setFormAnn(e.target.value)} type="url" placeholder="Announcement Post URL" className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Context & Status
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</label>
                <div className="flex flex-col gap-2">
                  {['Live/Released', 'Alpha', 'Beta', 'Development'].map(s => (
                    <button key={s} onClick={() => setFormStatus(s as any)} className={`text-xs font-bold py-2 px-4 rounded-lg border text-left transition-all ${formStatus === s ? 'bg-hive text-white border-hive' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-hive/50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Open Source?</label>
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                   <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${formIsOpen ? 'bg-hive' : 'bg-slate-300'}`} onClick={() => setFormIsOpen(!formIsOpen)}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formIsOpen ? 'right-1' : 'left-1'}`} />
                   </div>
                   <span className="text-sm font-bold dark:text-white">{formIsOpen ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="col-span-2 space-y-2 mt-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Edited Date</label>
                <input value={formLastEdited} onChange={e => setFormLastEdited(e.target.value)} type="text" placeholder="e.g. Oct 23, 2023" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-hive/50 dark:text-white outline-none" />
              </div>
            </div>
          </section>

          {/* Team Members */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive flex items-center gap-2">
                <Users className="w-4 h-4" /> Team Members (Blockchain Sync)
              </h3>
              <button onClick={() => addTeamMember('team')} className="p-2 bg-hive/10 text-hive rounded-lg hover:bg-hive hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {formTeam.map((member, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 relative group">
                  <button onClick={() => removeMember('team', idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"><Trash2 className="w-3 h-3" /></button>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input 
                            value={member.name} 
                            onChange={e => updateMember('team', idx, 'name', e.target.value)} 
                            type="text" 
                            placeholder="Hive Username" 
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs font-bold outline-none" 
                          />
                          <button 
                            onClick={() => syncHiveUser('team', idx)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hive transition-colors ${syncingIndex?.type === 'team' && syncingIndex?.index === idx ? 'animate-spin' : ''}`}
                            title="Sync Profile from Hive Blockchain"
                            disabled={syncingIndex !== null}
                          >
                            {syncingIndex?.type === 'team' && syncingIndex?.index === idx ? <Loader2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <input value={member.role} onChange={e => updateMember('team', idx, 'role', e.target.value)} type="text" placeholder="Role (e.g. Lead Dev)" className="px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs outline-none" />
                      </div>
                    </div>
                    {member.avatar && (
                      <div className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 bg-white shadow-sm">
                        <img src={member.avatar} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://images.hive.blog/u/${member.name.toLowerCase()}/avatar`; }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Supporters Section Form */}
          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" /> Supporters & Contributors
              </h3>
              <button onClick={() => addTeamMember('supporter')} className="p-2 bg-hive/10 text-hive rounded-lg hover:bg-hive hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {formSupporters.map((member, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 relative group">
                  <button onClick={() => removeMember('supporter', idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"><Trash2 className="w-3 h-3" /></button>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input 
                            value={member.name} 
                            onChange={e => updateMember('supporter', idx, 'name', e.target.value)} 
                            type="text" 
                            placeholder="Hive Username" 
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs font-bold outline-none" 
                          />
                          <button 
                            onClick={() => syncHiveUser('supporter', idx)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-hive transition-colors ${syncingIndex?.type === 'supporter' && syncingIndex?.index === idx ? 'animate-spin' : ''}`}
                            title="Sync Profile from Hive Blockchain"
                            disabled={syncingIndex !== null}
                          >
                            {syncingIndex?.type === 'supporter' && syncingIndex?.index === idx ? <Loader2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <input value={member.role} onChange={e => updateMember('supporter', idx, 'role', e.target.value)} type="text" placeholder="Contribution (e.g. Translation)" className="px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs outline-none" />
                      </div>
                    </div>
                    {member.avatar && (
                      <div className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 bg-white shadow-sm">
                        <img src={member.avatar} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://images.hive.blog/u/${member.name.toLowerCase()}/avatar`; }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hive flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" /> Project Timeline
              </h3>
              <button onClick={addTimelineEvent} className="p-2 bg-hive/10 text-hive rounded-lg hover:bg-hive hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              {formTimeline.map((event, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 relative group">
                   <button onClick={() => removeTimelineEvent(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                   <div className="grid grid-cols-2 gap-3 mb-3">
                    <input value={event.date} onChange={e => updateTimelineEvent(idx, 'date', e.target.value)} type="text" placeholder="Date (e.g. Oct 2023)" className="px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs font-bold outline-none" />
                    <input value={event.title} onChange={e => updateTimelineEvent(idx, 'title', e.target.value)} type="text" placeholder="Event Title" className="px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs outline-none" />
                  </div>
                  <textarea value={event.description} onChange={e => updateTimelineEvent(idx, 'description', e.target.value)} rows={2} placeholder="Event detail..." className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-xs outline-none mb-3 resize-none" />
                  <input value={event.linkUrl} onChange={e => updateTimelineEvent(idx, 'linkUrl', e.target.value)} type="url" placeholder="Update Link URL" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border-none rounded-lg text-[10px] outline-none" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 h-fit space-y-8">
           <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-hive" />
                  <h2 className="text-lg font-black text-white uppercase tracking-widest">Engineering Preview</h2>
                </div>
                <button onClick={copyToClipboard} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copySuccess ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copySuccess ? 'Copied' : 'Copy JSON'}
                </button>
              </div>
              <div className="bg-black/40 rounded-2xl p-6 font-mono text-[11px] leading-relaxed text-blue-300 overflow-auto max-h-[700px] border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
                <pre className="whitespace-pre-wrap break-all">{generatedJson}</pre>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;
    const isFav = favorites.includes(selectedProject.id);

    return (
      <div className="py-10 max-w-6xl mx-auto">
        <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-hive font-bold mb-8 group"><ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Directory</button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-100 dark:border-slate-800">
              <img src={selectedProject.thumbnail} alt={selectedProject.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{selectedProject.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <p className="text-hive font-bold flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> {selectedProject.category}</p>
                {selectedProject.lastEdited && (
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    <Calendar className="w-3 h-3" /> Last Entry Update: {selectedProject.lastEdited}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => toggleFavorite(selectedProject.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold border transition-all ${isFav ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-600 hover:text-red-500'}`}><Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} /> {isFav ? 'Favorite' : 'Add favorite'}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-3 space-y-8">
            <section><h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Project Website</h4><a href={selectedProject.websiteUrl} target="_blank" className="text-hive hover:underline flex items-center gap-2 break-all text-sm font-medium">{selectedProject.websiteUrl} <ExternalLink className="w-3.5 h-3.5" /></a></section>
            {selectedProject.githubUrl && <section><h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">GitHub</h4><a href={selectedProject.githubUrl} target="_blank" className="text-hive hover:underline flex items-center gap-2 break-all text-sm font-medium">Source Code <Code className="w-3.5 h-3.5" /></a></section>}
            {selectedProject.contactUrl && <section><h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Contact</h4><a href={selectedProject.contactUrl} target="_blank" className="text-hive hover:underline flex items-center gap-2 break-all text-sm font-medium">Get in touch <MessageCircle className="w-3.5 h-3.5" /></a></section>}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
               <button onClick={() => handleRequestChanges(selectedProject)} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-hive transition-all group/req">
                 <Edit3 className="w-3 h-3 group-hover/req:rotate-12 transition-transform" />
                 Request Info Update
               </button>
            </div>
          </div>
          
          <div className="lg:col-span-5 space-y-12">
            <section><h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Description</h4><p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedProject.description}</p></section>
            
            <div className="space-y-12">
              {selectedProject.team && (
                <section>
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" /> Core Team
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProject.team.map((m, i) => (
                      <div key={i} className="flex items-center gap-4 cursor-pointer group/member bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-hive/20 transition-all" onClick={() => handleDeveloperClick(m.name)}>
                        <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full bg-slate-100 group-hover/member:ring-2 group-hover/member:ring-hive transition-all" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white group-hover/member:text-hive transition-colors uppercase tracking-tight text-sm">@{m.name}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{m.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-4">
              <div 
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl aspect-video overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative group cursor-pointer"
                onClick={() => setLightboxIndex(activeGalleryIndex)}
              >
                <img 
                  key={activeGalleryIndex} 
                  src={galleryItems[activeGalleryIndex]} 
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=Asset&background=E31337&color=fff&size=800`; }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              {galleryItems.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {galleryItems.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeGalleryIndex === idx ? 'border-hive scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedProject.supporters && selectedProject.supporters.length > 0 && (
          <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <HeartHandshake className="w-6 h-6 text-hive" />
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Supporters & Contributors</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedProject.supporters.slice(0, 9).map((m, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 cursor-pointer group/member bg-slate-50/50 dark:bg-slate-900/30 px-4 py-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md" 
                  onClick={() => handleDeveloperClick(m.name)}
                >
                  <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full bg-slate-100 grayscale group-hover/member:grayscale-0 transition-all border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 dark:text-slate-200 group-hover/member:text-hive transition-colors tracking-tight text-sm">@{m.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1 whitespace-pre-wrap break-words">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedProject.timeline && selectedProject.timeline.length > 0 && (
          <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-16">
            <div className="flex items-center gap-3 mb-10">
              <Calendar className="w-6 h-6 text-hive" />
              <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Project Timeline</h4>
            </div>
            <div className="relative space-y-12 pl-8 border-l-2 border-slate-100 dark:border-slate-800">
              {[...selectedProject.timeline].reverse().map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute left-0 top-1.5 w-4 h-4 bg-white dark:bg-slate-900 border-4 border-hive rounded-full z-10 -translate-x-[calc(2rem+1px+50%)]" />
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black text-hive uppercase tracking-widest bg-hive/5 px-2 py-1 rounded inline-block w-fit">{event.date}</span>
                      {event.linkUrl && (
                        <a href={event.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-400 hover:text-hive flex items-center gap-1 transition-colors">
                          <LinkIcon className="w-3 h-3" /> View Update
                        </a>
                      )}
                    </div>
                    <h5 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{event.title}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div 
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 p-4 md:p-12"
            onClick={() => setLightboxIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-full flex items-center justify-center group/lb">
              <img 
                src={galleryItems[lightboxIndex]} 
                alt="Lightbox View" 
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              {galleryItems.length > 1 && (
                <>
                  <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all opacity-0 group-hover/lb:opacity-100 -translate-x-4 group-hover/lb:translate-x-0"
                    onClick={prevLightbox}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all opacity-0 group-hover/lb:opacity-100 translate-x-4 group-hover/lb:translate-x-0"
                    onClick={nextLightbox}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-2 text-white">
              <p className="text-sm font-black uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">
                {lightboxIndex + 1} / {galleryItems.length}
              </p>
              <p className="text-xs text-white/40 font-bold uppercase tracking-tighter">Click anywhere to close · Use Arrows to navigate</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDevelopers = () => (
    <div className="py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl"><Terminal className="w-10 h-10 text-hive" /></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">The Builders</h1>
          <p className="text-slate-500 dark:text-slate-400">Meet the architects of the Hive ecosystem</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {uniqueDevelopers.map((dev) => (
          <div 
            key={dev.username}
            onClick={() => handleDeveloperClick(dev.username)}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group text-center"
          >
            <div className="relative mb-4 inline-block">
              <img src={dev.avatar} alt={dev.username} className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 mx-auto" />
              <div className="absolute -bottom-1 -right-1 bg-hive p-1.5 rounded-full border-2 border-white dark:border-slate-900"><Code className="w-3 h-3 text-white" /></div>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-hive transition-colors mb-1 uppercase tracking-tight">@{dev.username}</h3>
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800"><div className="text-lg font-black text-slate-900 dark:text-white">{dev.projects.size}</div><div className="text-[10px] font-black text-slate-400 uppercase">Projects</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeveloperDetail = () => {
    if (!selectedDeveloperUsername) return null;
    const dev = uniqueDevelopers.find(d => d.username.toLowerCase() === selectedDeveloperUsername.toLowerCase());
    if (!dev) return null;
    const devProjects = projects.filter(p => [...(p.team || []), ...(p.supporters || [])].some(m => m.name.toLowerCase() === selectedDeveloperUsername.toLowerCase()));
    return (
      <div className="py-12">
        <button onClick={() => setCurrentView('developers')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-hive font-bold mb-10 group"><ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> All Developers</button>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <img src={dev.avatar} alt={dev.username} className="w-40 h-40 rounded-[2.5rem] border-8 border-white dark:border-slate-900 shadow-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="text-center md:text-left pt-4">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic uppercase">@{dev.username}</h1>
            <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 text-sm"><div className="flex items-center gap-2"><Code className="w-4 h-4" /><span>{dev.projects.size} Contributions</span></div></div>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Contribution History</h2>
          <div className="flex flex-col gap-6">{devProjects.map(p => <ProjectCard key={p.id} project={p} isFavorite={favorites.includes(p.id)} onToggleFavorite={toggleFavorite} onProjectClick={handleProjectClick} />)}</div>
        </div>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="py-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-hive/10 rounded-2xl"><LayoutGrid className="w-10 h-10 text-hive" /></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Category Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Browse the Hive ecosystem by specialized sectors</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} onClick={() => handleCategoryClick(cat.name)} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl hover:shadow-xl hover:border-hive/20 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-4"><h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-hive transition-colors">{cat.name}</h3></div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[4.5rem]">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10"><div className="flex items-center gap-4"><div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl"><Heart className="w-10 h-10 text-red-500 fill-red-500" /></div><div><h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Favorites</h1></div></div></div>
      <div className="flex flex-col gap-6">{projects.filter(p => favorites.includes(p.id)).map(p => <ProjectCard key={p.id} project={p} isFavorite={true} onToggleFavorite={toggleFavorite} onProjectClick={handleProjectClick} />)}</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header onSearch={setSearchQuery} setView={setCurrentView} currentView={currentView} favoritesCount={favorites.length} />
      <div className="flex-1 max-w-7xl mx-auto px-4 w-full">
        {currentView === 'home' && renderHome()}
        {currentView === 'categories' && renderCategories()}
        {currentView === 'developers' && renderDevelopers()}
        {currentView === 'developer-detail' && renderDeveloperDetail()}
        {currentView === 'favorites' && renderFavorites()}
        {currentView === 'add-project' && renderAddProject()}
        {currentView === 'project-detail' && renderProjectDetail()}
      </div>
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg cursor-pointer" onClick={() => setCurrentView('home')}>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-hive"><path d="M12 2L2 12l10 10 10-10L12 2zM5.5 12l6.5-6.5 6.5 6.5-6.5 6.5L5.5 12z" /></svg>
              </div>
              <span className="font-black text-xl text-slate-900 dark:text-white tracking-tighter">hive<span className="text-hive font-light">projects</span></span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">Curating the future of decentralized web.</p>
            <div className="pt-2 flex items-center gap-3">
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700">
                {theme === 'light' ? <><Moon className="w-3.5 h-3.5" /><span className="text-xs font-bold">Dark</span></> : <><Sun className="w-3.5 h-3.5" /><span className="text-xs font-bold">Light</span></>}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Directory</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><button onClick={() => setCurrentView('categories')} className="hover:text-hive transition-colors">Categories</button></li>
                <li><button onClick={() => setCurrentView('developers')} className="hover:text-hive transition-colors">Developers</button></li>
                <li><button onClick={() => setCurrentView('add-project')} className="hover:text-hive transition-colors">Submit App</button></li>
              </ul>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">&copy; {new Date().getFullYear()} Hive Projects.</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-2 leading-relaxed">
              Proudly presented by <a href="https://peakd.com/@louis88" target="_blank" rel="noopener noreferrer" className="text-hive hover:underline font-bold">@louis88</a> / 
              Hive Witness <a href="https://hivesigner.com/sign/account-witness-vote?witness=louis.witness&approve=1" target="_blank" rel="noopener noreferrer" className="text-hive hover:underline font-bold">@louis.witness</a>
            </p>
            <a 
              href="https://hivesigner.com/sign/account-witness-vote?witness=louis.witness&approve=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-1 text-[10px] bg-hive/10 text-hive px-2 py-1 rounded-md font-black uppercase tracking-tighter hover:bg-hive hover:text-white transition-all inline-flex items-center gap-1"
            >
              Vote for Witness <Heart className="w-2.5 h-2.5 fill-current" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
