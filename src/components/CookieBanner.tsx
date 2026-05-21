import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, X, Check, Settings, ShieldAlert } from 'lucide-react';
import { CookieConsent } from '../types';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
}

export default function CookieBanner({ onOpenPrivacyPolicy }: CookieBannerProps) {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookieConsent>({
    essential: true,
    analytics: true,
    marketing: false,
    decided: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('kayetan_cookie_consent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.decided) {
          setShowBanner(true);
        } else {
          setPreferences(parsed);
          setShowBanner(false);
        }
      } catch (e) {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (updated: CookieConsent) => {
    const data = { ...updated, decided: true };
    localStorage.setItem('kayetan_cookie_consent', JSON.stringify(data));
    setPreferences(data);
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      decided: true,
    });
  };

  const handleRejectAll = () => {
    savePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      decided: true,
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      ...preferences,
      decided: true,
    });
  };

  const togglePreference = (key: keyof Omit<CookieConsent, 'decided'>) => {
    if (key === 'essential') return; // Cannot toggle essential
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          id="cookie-consent-bar"
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 0.8 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-xl z-50 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6"
        >
          {!showSettings ? (
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20 shrink-0">
                  <ShieldCheck className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white font-semibold tracking-tight text-base mb-1">
                    Zgoda na pliki cookies & RODO
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Szanujemy Twoją prywatność. Ta witryna stosuje niezbędne, analityczne oraz marketingowe pliki cookie w celach optymalizacji doświadczenia i analizy ruchu, zgodnie z wymogami UE i polskiego prawa (RODO).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end pt-2">
                <button
                  id="btn-cookies-settings"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  Dostosuj
                </button>
                <button
                  id="btn-cookies-reject"
                  onClick={handleRejectAll}
                  className="px-3.5 py-2 text-slate-300 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 border border-slate-800 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Odrzuć opcjonalne
                </button>
                <button
                  id="btn-cookies-accept"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white rounded-xl text-xs font-medium shadow-lg shadow-sky-500/10 transition cursor-pointer"
                >
                  Akceptuj wszystkie
                </button>
              </div>

              <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-900 text-[11px] text-slate-400">
                <Info className="w-3.5 h-3.5" />
                <span>
                  Możesz zmienić decyzję w dowolnym momencie. Przeczytaj naszą{' '}
                  <button
                    id="link-cookie-privacy-policy"
                    onClick={onOpenPrivacyPolicy}
                    className="underline text-sky-400 hover:text-sky-300 font-medium transition inline cursor-pointer"
                  >
                    Politykę Prywatności
                  </button>
                  .
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-950 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-white font-semibold text-base">Ustawienia Prywatności</h4>
                </div>
                <button
                  id="btn-cookies-settings-close"
                  onClick={() => setShowSettings(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Skonfiguruj, które pliki cookie zgadzasz się przechowywać na swoim urządzeniu. Pliki niezbędne są konieczne do poprawnego działania witryny.
              </p>

              <div className="space-y-3 mb-6">
                {/* Essential */}
                <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                  <div>
                    <span className="text-white text-xs font-semibold block">Niezbędne pliki cookie</span>
                    <span className="text-slate-400 text-[10px]">Wymagane do utrzymania bezpiecznych i stabilnych połączeń.</span>
                  </div>
                  <div className="px-2.5 py-1 text-[10px] bg-slate-800 text-slate-300 rounded font-mono font-medium">
                    Zawsze Aktywne
                  </div>
                </div>

                {/* Analytics */}
                <div
                  id="toggle-cookies-analytics"
                  onClick={() => togglePreference('analytics')}
                  className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900/70 rounded-xl border border-slate-800/60 cursor-pointer transition select-none"
                >
                  <div>
                    <span className="text-white text-xs font-semibold block">Pliki analityczne</span>
                    <span className="text-slate-400 text-[10px]">Statystyki odwiedzin, które pomagają zoptymalizować doświadczenie portfolio.</span>
                  </div>
                  <div className={`w-10 h-6 flex items-center rounded-all p-1 transition-colors duration-200 ${preferences.analytics ? 'bg-sky-500 justify-end' : 'bg-slate-800 justify-start'}`}>
                    <div className="w-4 h-4 rounded-all bg-white shadow-md" />
                  </div>
                </div>

                {/* Marketing */}
                <div
                  id="toggle-cookies-marketing"
                  onClick={() => togglePreference('marketing')}
                  className="flex items-center justify-between p-3 bg-slate-900/40 hover:bg-slate-900/70 rounded-xl border border-slate-800/60 cursor-pointer transition select-none"
                >
                  <div>
                    <span className="text-white text-xs font-semibold block">Spersonalizowana reklama</span>
                    <span className="text-slate-400 text-[10px]">Zapamiętywanie preferencji użytkownika na potrzeby marketingu.</span>
                  </div>
                  <div className={`w-10 h-6 flex items-center rounded-all p-1 transition-colors duration-200 ${preferences.marketing ? 'bg-purple-500 justify-end' : 'bg-slate-800 justify-start'}`}>
                    <div className="w-4 h-4 rounded-all bg-white shadow-md" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-900 pt-4">
                <button
                  id="btn-cookies-back"
                  onClick={() => setShowSettings(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white text-xs font-medium transition"
                >
                  Wstecz
                </button>
                <button
                  id="btn-cookies-save-custom"
                  onClick={handleSaveCustom}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-medium transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Zapisz ustawienia
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
