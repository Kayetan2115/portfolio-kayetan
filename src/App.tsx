import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import GenerativeCanvas from './components/GenerativeCanvas';
import BentoGrid from './components/BentoGrid';
import ProjectsSection from './components/ProjectsSection';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicyDialog from './components/PrivacyPolicyDialog';
import { Project } from './types';
import { getProjects } from './lib/db';
import { Heart, Terminal, Shield } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  
  // Modals view toggles
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const fetchUiProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to loading projects in App:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchUiProjects();
  }, []);

  const handleScrollToSegment = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-250">
      {/* 3D-effect canvas node-web background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <GenerativeCanvas />
      </div>

      {/* Main Container Layer (needs relative to overlay canvas background appropriately) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation header bar */}
        <Navbar 
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Core Layout modules */}
        <main className="flex-grow">
          {/* Bento Dashboard Section */}
          <BentoGrid 
            onScrollToProjects={() => handleScrollToSegment('projects-showcase')}
            onScrollToContact={() => handleScrollToSegment('contact-section')}
          />

          {/* Interactive Cloud projects catalog */}
          <ProjectsSection 
            projects={projects}
            isLoading={isLoadingProjects}
          />

          {/* Contact and RODO fields */}
          <ContactForm 
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
          />
        </main>

        {/* Footer */}
        <footer className="bg-slate-950/80 border-t border-slate-900 py-10 px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left label */}
            <div className="text-center md:text-left">
              <span className="text-white font-bold text-sm tracking-wider font-display block">KAYETAN</span>
              <p className="text-slate-500 text-[11px] font-mono mt-1">
                © {new Date().getFullYear()} KAYETAN. WSZELKIE PRAWA ZASTRZEŻONE.
              </p>
            </div>

            {/* Legal Links and quick administrative access */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <button
                id="footer-privacy-link"
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-sky-400 flex items-center gap-1 transition select-none cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Polityka Prywatności & RODO
              </button>
              
              <button
                id="footer-admin-link"
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-indigo-400 flex items-center gap-1 transition select-none cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Konsola Administratora
              </button>
            </div>

            {/* Micro details */}
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <span>Zbudowano z</span>
              <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
              <span>w Europie</span>
            </div>

          </div>
        </footer>

        {/* Cookie Consent Manager - GDPR-RODO compliant */}
        <CookieBanner onOpenPrivacyPolicy={() => setIsPrivacyOpen(true)} />

        {/* Legal policy modal */}
        <PrivacyPolicyDialog 
          isOpen={isPrivacyOpen}
          onClose={() => setIsPrivacyOpen(false)}
        />

        {/* Admin Backstage Console Control */}
        <AdminPanel 
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onRefreshMainPage={fetchUiProjects}
        />

      </div>
    </div>
  );
}
