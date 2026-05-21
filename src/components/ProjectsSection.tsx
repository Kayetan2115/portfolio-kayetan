import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { Search, Globe, Github, Sparkles, Filter, X, ArrowUpRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

export default function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [projects]);

  // Filter projects by search and selected tag
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || (Array.isArray(p.tags) && p.tags.includes(selectedTag));
      
      return matchesSearch && matchesTag;
    });
  }, [projects, searchQuery, selectedTag]);

  return (
    <section id="projects-showcase" className="py-20 bg-slate-950 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900/60">
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-widest uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Katalog Wdrożeń</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Projekty realizowane z pasją.
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl">
            Dynamicznie synchronizowane z chmurą Supabase lub lokalną pamięcią operacyjną. Kliknij na projekt, by zgłębić detale technologii.
          </p>
        </motion.div>

        {/* Inputs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="search-projects-input"
              type="text"
              placeholder="Wyszukaj projekt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                id="btn-clear-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Grid of items */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-950/40 border border-slate-900 rounded-3xl h-64 animate-pulse p-6 flex flex-col justify-between">
              <div className="w-1/3 h-4 bg-slate-900 rounded mb-4" />
              <div className="space-y-2">
                <div className="w-full h-8 bg-slate-900 rounded" />
                <div className="w-5/6 h-4 bg-slate-900 rounded" />
              </div>
              <div className="w-24 h-6 bg-slate-900 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-900 bg-slate-950/20 rounded-3xl">
          <p className="text-slate-500 text-sm">Nie znaleziono żadnych projektów pasujących do kryteriów wyszukiwania.</p>
          <button
            id="btn-reset-filters"
            onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
            className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs rounded-xl transition cursor-pointer"
          >
            Resetuj filtry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={`${project.id}-${idx}`}
              id={`project-card-${project.id}`}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (idx % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, borderColor: 'rgba(99, 102, 241, 0.4)', boxShadow: '0 25px 40px -15px rgba(99, 102, 241, 0.15)' }}
              onClick={() => setActiveProject(project)}
              className="group bg-slate-950 border border-slate-900/80 hover:border-slate-800 rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Media banner */}
              <div className="h-48 relative overflow-hidden bg-slate-900">
                <img
                  src={project.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {project.featured && (
                  <span className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold font-mono tracking-wider text-amber-400 bg-amber-950/85 border border-amber-500/30 rounded-lg shadow-md">
                    ★ WYRÓŻNIONY
                  </span>
                )}
              </div>

              {/* Data payload */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition duration-200 flex items-center justify-between gap-1">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 shrink-0 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-200" />
                </h3>
                
                <p className="text-slate-400 text-xs lines-clamp-2 mt-2 leading-relaxed h-12 overflow-hidden">
                  {project.description}
                </p>

                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-900/40 text-xs select-none">
                  {project.link && (
                    <span className="flex items-center gap-1.5 font-semibold text-sky-400">
                      <Globe className="w-3.5 h-3.5" />
                      Live Demo
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Details Modal Dialog */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" key={`project-details-wrap-${activeProject.id}`}>
            <motion.div
              id="project-detail-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              id="project-detail-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              layoutId={`project-card-${activeProject.id}`}
              className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 overflow-hidden z-10"
            >
              {/* Media */}
              <div className="h-56 relative -mx-6 -mt-6 mb-5 overflow-hidden bg-slate-900">
                <img
                  src={activeProject.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'}
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <button
                  id="btn-project-detail-close"
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 p-1.5 bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {activeProject.title}
              </h3>

              <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6">
                {activeProject.description}
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap gap-2.5 pt-4 border-t border-slate-900">
                {activeProject.link && (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-xs transition"
                  >
                    <Globe className="w-4 h-4" />
                    Zobacz Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
