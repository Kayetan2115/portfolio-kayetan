import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, CheckCircle2, ShieldEllipsis, AlertCircle, Copy, Check } from 'lucide-react';
import { createMessage } from '../lib/db';

interface ContactFormProps {
  onOpenPrivacy: () => void;
}

export default function ContactForm({ onOpenPrivacy }: ContactFormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  // Consent Checkboxes
  const [consentData, setConsentData] = useState<boolean>(false);
  const [consentPrivacy, setConsentPrivacy] = useState<boolean>(false);
  
  // States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kayetan-kontakt@proton.me');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Initial check
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Wszystkie pola tekstowe muszą zostać uzupełnione.');
      return;
    }
    if (!consentData || !consentPrivacy) {
      setErrorMessage('Aby wysłać wiadomość, musisz zaakceptować wymagane zgody RODO.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        consent_rodo: true,
      });

      // Clear form
      setName('');
      setEmail('');
      setMessage('');
      setConsentData(false);
      setConsentPrivacy(false);
      setSubmitSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Przepraszamy, nie udało się przesłać wiadomości. Spróbuj ponownie lub napisz na e-mail.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900/60 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Left Column Text info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="md:col-span-5 space-y-5"
        >
          <div className="flex items-center gap-1.5 text-sky-400 font-mono text-xs tracking-widest uppercase">
            <Mail className="w-4 h-4" />
            <span>Nawiążmy współpracę</span>
          </div>
          
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Przejdźmy <br />
            do konkretów.
          </h2>
          
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Napisz szczegóły swojego pomysłu biznesowego lub zapotrzebowania technologicznego za pomocą wygodnego, ustrukturyzowanego formularza. Moje skrzynki mailowe są w pełni chronione kluczami PGP oraz politykami RODO.
          </p>

          <motion.div
            id="contact-email-card"
            whileHover={{ scale: 1.02, borderColor: 'rgba(56, 189, 248, 0.45)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyEmail}
            className="p-4 bg-slate-950/80 border border-slate-900 rounded-2xl cursor-pointer group transition duration-300"
          >
            <span className="text-slate-500 font-mono text-[9px] block">KLIKNIJ ABY SKOPIOWAĆ BEZPOŚREDNI E-MAIL:</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-white font-mono text-sm font-bold group-hover:text-sky-400 transition">
                kayetan-kontakt@proton.me
              </span>
              {emailCopied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition" />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column Core Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="md:col-span-7 bg-slate-950 border border-slate-900/80 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                key="contact-success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="text-center py-8 space-y-4"
              >
                <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-all">
                  <CheckCircle2 className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Wiadomość wysłana!</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Dziękuję za zaufanie. Twoje zgłoszenie wpłynęło bezpiecznie do bazy danych. Odpowiem na podany adres e-mail w przeciągu 24 godzin roboczych.
                  </p>
                </div>
                <motion.button
                  id="btn-send-another"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSubmitSuccess(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold rounded-xl transition cursor-pointer inline-block"
                >
                  Wyślij kolejną wiadomość
                </motion.button>
              </motion.div>
            ) : (
              <form key="contact-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="input-name" className="text-slate-400 font-mono text-[10px] tracking-wider uppercase block">
                    Twoje imię / Nazwa firmy *
                  </label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Np. Jan Kowalski"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="input-email" className="text-slate-400 font-mono text-[10px] tracking-wider uppercase block">
                    Adres e-mail kontaktu *
                  </label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="np. jan@twojadomena.pl"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label htmlFor="input-message" className="text-slate-400 font-mono text-[10px] tracking-wider uppercase block">
                    Treść zapytania / Opis projektu *
                  </label>
                  <textarea
                    id="input-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Scharakteryzuj wymagania, oczekiwany termin realizacji, budżet lub ogólny zarys..."
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
                  />
                </div>

                {/* GDPR Chekboxes */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <input
                      id="checkbox-consent-data"
                      type="checkbox"
                      required
                      checked={consentData}
                      onChange={(e) => setConsentData(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="checkbox-consent-data" className="text-[10.5px] text-slate-400 leading-normal select-none">
                      Wyrażam dobrowolną zgodę na przetwarzanie podanych danych osobowych (imię, e-mail) przez administratora w celu obsługi zapytania i prowadzenia korespondencji zgodnie z polityką RODO. *
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="checkbox-consent-privacy"
                      type="checkbox"
                      required
                      checked={consentPrivacy}
                      onChange={(e) => setConsentPrivacy(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-800 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="checkbox-consent-privacy" className="text-[10.5px] text-slate-400 leading-normal select-none">
                      Potwierdzam, że zapoznałem się z{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="text-sky-400 underline hover:text-sky-300 font-medium inline transition cursor-pointer"
                      >
                        Polityką Prywatności
                      </button>{' '}
                      tej witryny i akceptuję jej warunki prawne. *
                    </label>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.button
                  id="btn-contact-submit"
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -5px rgba(14, 165, 233, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-all animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Wyślij zgłoszenie
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
