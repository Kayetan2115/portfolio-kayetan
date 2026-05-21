import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Terminal, 
  Zap,
  Quote
} from 'lucide-react';

interface BentoGridProps {
  onScrollToProjects: () => void;
  onScrollToContact: () => void;
}

export default function BentoGrid({ onScrollToProjects, onScrollToContact }: BentoGridProps) {
  return (
    <section id="bento-dashboard" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Intro display section */}
      <div className="mb-12 text-center md:text-left overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 text-xs text-sky-400 font-mono bg-sky-500/10 border border-sky-500/20 rounded-all mb-4"
        >
          <Zap className="w-3.5 h-3.5 animate-bounce" />
          <span>DOSTĘPNY DO NOWYCH WSPÓŁPRAC W 2026</span>
        </motion.div>
        
        {/* Headings with beautiful reveal-trigger */}
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight leading-none">
          <div className="overflow-hidden inline-block mr-2 pb-1">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              Buduję
            </motion.span>
          </div>
          <div className="overflow-hidden inline-block mr-2 pb-1">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              Cyfrową
            </motion.span>
          </div>
          <br className="hidden md:inline" />
          <div className="overflow-hidden inline-block mr-2 pb-1">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500"
            >
              Przestrzeń Przyszłości.
            </motion.span>
          </div>
        </h1>
        
        <div className="overflow-hidden mt-4">
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed"
          >
            Jestem kreatywnym programistą i architektem interfejsów internetowych. Scalam zaawansowaną inżynierię oprogramowania z bezkompromisowym designem w nowoczesne, funkcjonalne i wysoce estetyczne aplikacje internetowe.
          </motion.p>
        </div>
      </div>

      {/* Bento Grid container */}
      <div className="max-w-2xl md:mx-auto">
        {/* Core Profile block */}
        <motion.div
          id="bento-card-about"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.05 }}
          whileHover={{ y: -6, borderColor: 'rgba(56, 189, 248, 0.45)', boxShadow: '0 20px 40px -15px rgba(56, 189, 248, 0.15)' }}
          className="bg-slate-950 border border-slate-900/80 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[320px]"
        >
          {/* Subtle glow decoration */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-sky-500/10 blur-3xl rounded-full group-hover:bg-sky-500/15 transition-all duration-500" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-[10px] tracking-widest uppercase mb-4">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>O mnie / Filozofia</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">
              Kojarzenie formy, kodu <br />i najwyższej precyzji.
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
              Moje podejście to minimalizm połączony z maksymalną płynnością doświadczenia. Tworzę dynamiczne komponenty interfejsu, które opowiadają spójną historię bez zbędnego szumu. Implementuję bezbłędny kod zoptymalizowany pod kątem szybkości renderowania oraz pełnej responsywności SEO.
            </p>
          </div>

          <div className="flex gap-2 relative z-10 pt-6">
            <motion.button
              id="bento-btn-projects"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onScrollToProjects}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-950 font-semibold rounded-xl text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              Zobacz projekty
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              id="bento-btn-contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onScrollToContact}
              className="px-4 py-2 bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 font-medium rounded-xl text-xs hover:text-white transition cursor-pointer"
            >
              Skontaktuj się
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Quote decoration */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-12 flex items-start gap-3 p-4 bg-slate-900/30 border border-slate-900 rounded-2xl max-w-2xl md:mx-auto"
      >
        <Quote className="w-6 h-6 text-indigo-500 shrink-0 opacity-50" />
        <p className="text-slate-400 text-xs italic leading-relaxed">
          „Design nie jest tylko tym, jak coś wygląda i co się odczuwa. Design to przede wszystkim sposób, w jaki dane rozwiązanie działa.” – To podejście definiuje każdy mój wdrożony moduł kodu.
        </p>
      </motion.div>
    </section>
  );
}
