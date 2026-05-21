import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Terminal, Copy, Check } from 'lucide-react';

interface NavbarProps {
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ onOpenPrivacy, onOpenAdmin }: NavbarProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kayetan-kontakt@proton.me');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.header
      id="main-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 shadow-md shadow-sky-500/10 font-bold text-white text-base">
            K
          </div>
          <div>
            <span className="text-white text-sm font-semibold tracking-wider font-sans">
              KAYETAN
            </span>
            <span className="text-slate-400 font-mono text-[9px] block leading-none">
              CREATIVE DEVELOPER
            </span>
          </div>
        </div>

        {/* Navigation - Shortcuts */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#bento-dashboard"
            className="text-slate-300 hover:text-white text-xs font-medium tracking-wide transition"
          >
            O Mnie
          </a>
          <a
            href="#projects-showcase"
            className="text-slate-300 hover:text-white text-xs font-medium tracking-wide transition"
          >
            Projekty
          </a>
          <a
            href="#contact-section"
            className="text-slate-300 hover:text-white text-xs font-medium tracking-wide transition"
          >
            Kontakt
          </a>
          <button
            id="nav-link-privacy"
            onClick={onOpenPrivacy}
            className="text-slate-400 hover:text-sky-400 text-xs font-semibold tracking-wide transition cursor-pointer"
          >
            RODO
          </button>
        </nav>

        {/* Action Controls & Email Status */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-btn-copy-email"
            onClick={handleCopyEmail}
            className="group flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium font-mono text-sky-400 transition cursor-pointer"
            title="Kliknij, aby skopiować e-mail"
          >
            <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition" />
            <span className="hidden select-none sm:inline text-slate-300">kayetan-kontakt@proton.me</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover:text-sky-400 transition" />
            )}
          </button>

          <button
            id="nav-btn-admin"
            onClick={onOpenAdmin}
            className="flex items-center justify-center p-1.5 bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-900/40 rounded-xl text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            title="Panel Admina"
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
