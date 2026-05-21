import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, BadgeCheck, FileText, Lock, UserCheck } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyDialog({ isOpen, onClose }: PrivacyPolicyProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" key="privacy-policy-dialog-wrap">
          {/* Overlay */}
          <motion.div
            id="privacy-policy-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="privacy-policy-modal"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 z-10 text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5.5 h-5.5 text-sky-400" />
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">Polityka Prywatności</h3>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wider">ZGODNIE Z UE RODO / GDPR 2026</p>
                </div>
              </div>
              <button
                id="btn-privacy-close"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 text-sm leading-relaxed text-slate-300 pr-2">
              <div>
                <h4 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
                  <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  1. Informacje ogólne
                </h4>
                <p>
                  Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem z portfolio internetowego Kayetana (dostępnego pod adresem domeny i poddomen). Dokładamy najwyższych starań, aby Twoje dane były chronione zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2116/679 z dnia 27 kwietnia 2116 r. (RODO).
                </p>
              </div>

              <div>
                <h4 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  2. Administrator Danych Osobowych
                </h4>
                <p>
                  Administratorem danych osobowych przetwarzanych w ramach witryny jest deweloper i właściciel portfolio <strong>Kayetan</strong>. Wszelkie zapytania oraz zgłoszenia zmian/usunięcia danych należy kierować bezpośrednio na zweryfikowany adres e-mail:{' '}
                  <a href="mailto:kayetan-kontakt@proton.me" className="text-sky-400 hover:underline font-mono">
                    kayetan-kontakt@proton.me
                  </a>
                  .
                </p>
              </div>

              <div>
                <h4 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  3. Zakres zbieranych danych i cel przetwarzania
                </h4>
                <p className="mb-2">
                  Twoje dane osobowe przetwarzane są wyłącznie w celach, na które wyraziłeś wyraźną zgodę podczas interakcji z aplikacją:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
                  <li>
                    <strong>Formularz kontaktowy:</strong> Przetwarzamy Twoje imię, adres e-mail oraz treść przesłanej wiadomości, aby obsłużyć Twoje zapytanie biznesowe lub techniczne (Podstawa prawna: Art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes).
                  </li>
                  <li>
                    <strong>Technologie cookies:</strong> Wykorzystujemy ciasteczka analityczne oraz techniczne (sesyjne) w celu gromadzenia anonimowych statystyk o ruchu i usprawnienia nawigacji (Podstawa prawna: Art. 6 ust. 1 lit. a RODO – zgoda użytkownika).
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="flex items-center gap-1.5 text-white font-semibold text-sm mb-2">
                  <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                  4. Masz pełną kontrolę nad swoimi danymi (Prawa Użytkownika)
                </h4>
                <p className="mb-2">
                  Każdemu Użytkownikowi przysługuje szereg praw gwarantowanych przepisami unijnymi o ochronie danych osobowych, w tym:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="p-2 border-l-2 border-sky-500">
                    <span className="font-semibold block text-white">Prawo dostępu</span>
                    Możliwość uzyskania informacji o zakresie przetwarzanych danych.
                  </div>
                  <div className="p-2 border-l-2 border-emerald-500">
                    <span className="font-semibold block text-white">Prawo do sprostowania</span>
                    Korekta błędnych lub nieaktualnych wpisów w bazie.
                  </div>
                  <div className="p-2 border-l-2 border-purple-500">
                    <span className="font-semibold block text-white">Prawo do usunięcia („bycia zapomnianym”)</span>
                    Całkowite usunięcie Twoich zgłoszeń ze zbiorów Supabase/LocalStorage.
                  </div>
                  <div className="p-2 border-l-2 border-rose-500">
                    <span className="font-semibold block text-white">Prawo do wycofania zgody</span>
                    Natychmiastowe wstrzymanie przetwarzania bez wpływu na wcześniejszą legalność.
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold text-sm mb-2">5. Bezpieczeństwo i Udostępnianie</h4>
                <p>
                  Wszystkie połączenia z bazami danych realizowane są przez bezpieczny, szyfrowany protokół SSL/TLS. Dane wprowadzane do formularza nie są i nigdy nie będą sprzedawane podmiotom trzecim ani przekazywane brokerom reklamowym. Narzędzia hostingowe są umiejscowione na terytorium UE lub podlegają restrykcyjnym mechanizmom uwierzytelniania.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-900 pt-4 mt-6">
              <button
                id="btn-privacy-ok"
                onClick={onClose}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-medium rounded-xl text-xs transition cursor-pointer"
              >
                Rozumiem i akceptuję
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
