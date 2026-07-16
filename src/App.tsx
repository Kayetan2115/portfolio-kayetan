import React from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Mail,
  Instagram,
  Globe,
  Video,
  TrendingUp,
  Tent,
  Sparkles
} from "lucide-react";
import FadingVideo from "./components/FadingVideo";
import BlurText from "./components/BlurText";

// Services Data with relevant icons, tags, and descriptions
const SERVICES_DATA = [
  {
    id: "web-dev",
    title: "Strony internetowe",
    tags: ["Nowoczesne", "RWD", "UX"],
    description:
      "Projektujemy i tworzymy responsywne, szybkie oraz estetyczne strony www, które konwertują.",
    icon: Globe,
  },
  {
    id: "drone-films",
    title: "Filmy z dronem",
    tags: ["4K", "Lot ptaka", "Dynamika"],
    description:
      "Spektakularne ujęcia z powietrza. Nagrywamy dynamiczne kadry pokazujące inną perspektywę.",
    // Custom SVG Drone Icon
    isCustomIcon: true,
  },
  {
    id: "video-production",
    title: "Filmy (Produkcja wideo)",
    tags: ["Reklama", "Promocja", "Montaż"],
    description:
      "Klasyczna produkcja filmowa, od koncepcji po profesjonalny montaż i korekcję barwną.",
    icon: Video,
  },
  {
    id: "marketing",
    title: "Marketing firm",
    tags: ["Social Media", "Strategia", "Wizerunek"],
    description:
      "Prowadzimy spójne kampanie marketingowe, budując silny i nowoczesny wizerunek Twojej marki w sieci.",
    icon: TrendingUp,
  },
  {
    id: "outdoor-events",
    title: "Imprezy plenerowe",
    tags: ["Relacje", "Dron", "Eventy"],
    description:
      "Kompleksowa realizacja wideo i ujęcia z powietrza podczas plenerowych wydarzeń. Łapiemy klimat i emocje.",
    icon: Tent,
  },
  {
    id: "special-occasions",
    title: "Imprezy okolicznościowe",
    tags: ["Fotografia", "Wideo", "Pamiątka"],
    description:
      "Fotografia i film z imprez okolicznościowych. Uwieczniamy najważniejsze momenty z najwyższą dbałością o detale.",
    icon: Sparkles,
  },
];

export default function App() {
  const scrollToServices = (e: React.MouseEvent) => {
    e.preventDefault();
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-black text-white selection:bg-white/20 selection:text-white min-h-screen relative font-body overflow-x-hidden">
      
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-6 sm:px-12 md:px-16"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Middle: liquid-glass pill with text links */}
          <div className="liquid-glass rounded-full px-5 py-2 flex items-center gap-2 sm:gap-4 border border-white/5 shadow-md">
            <a
              href="#services"
              onClick={scrollToServices}
              className="text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/[0.03]"
            >
              Usługi
            </a>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10 select-none"></span>
            <a
              href="#contact"
              onClick={scrollToContact}
              className="text-xs sm:text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 px-3 py-1 rounded-full hover:bg-white/[0.03]"
            >
              Kontakt
            </a>
          </div>

          {/* Right: Instagram CTA Button */}
          <a
            href="https://www.instagram.com/wtf.kajtofel"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full flex items-center gap-1.5 hover:bg-white/95 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl"
          >
            Nasz Instagram
            <ArrowUpRight className="w-4 h-4" />
          </a>

        </div>
      </motion.nav>

      {/* SECTION 1: HERO (Full Screen, Black Background) */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden z-10 bg-black">
        
        {/* programmatically crossfaded background drone video */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <FadingVideo
            src="https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-mountain-drone-shot-41618-large.mp4"
            className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
            style={{ width: "120%", height: "120%" }}
          />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 flex flex-col items-center text-center">
          
          {/* Badge (delay 0.4s) */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="liquid-glass rounded-full px-5 py-2 flex items-center gap-2 mb-8 max-w-full text-left"
          >
            <span className="text-white/80 text-xs sm:text-sm font-body truncate">
              Kompleksowa obsługa wizualna i marketingowa Twojej marki
            </span>
          </motion.div>

          {/* Header Title with word-by-word BlurText animation */}
          <div className="mb-6 flex justify-center">
            <BlurText
              text="Kreujemy Obraz, Budujemy Marki"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.9] max-w-2xl justify-center tracking-[-2px]"
              delay={0.5}
            />
          </div>

          {/* Subtitle (delay 0.8s) */}
          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-white/60 text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10 font-body"
          >
            Od nowoczesnych stron internetowych, przez ujęcia z drona, po relacje z eventów i marketing. 
            Tworzymy materiały, które wyróżniają się w sieci i zostają w pamięci.
          </motion.p>

          {/* CTA Buttons (delay 1.1s) */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 mt-4 w-full justify-center"
          >
            
            {/* Primary: liquid-glass-strong */}
            <a
              href="mailto:kayetanmalczewski@gmail.com"
              className="liquid-glass-strong px-8 py-3.5 rounded-full font-body font-medium text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 w-full sm:w-auto shadow-xl group border border-white/10"
            >
              <Mail className="w-4.5 h-4.5 text-white/90 group-hover:translate-x-0.5 transition-transform" />
              Napisz do nas
            </a>

            {/* Secondary: simple text link */}
            <a
              href="#services"
              onClick={scrollToServices}
              className="text-white/75 hover:text-white font-body font-medium transition-colors duration-200 flex items-center gap-1.5 py-3.5 px-6 group"
            >
              Sprawdź usługi
              <span className="group-hover:translate-y-0.5 transition-transform duration-300">↓</span>
            </a>

          </motion.div>

        </div>

      </section>

      {/* SECTION 2: SERVICES (Min-height screen, Black Background) */}
      <section
        id="services"
        className="relative w-full min-h-screen bg-black overflow-hidden z-10 flex flex-col"
      >
        
        {/* Background video: texture of black and silver fluid with glitter */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <FadingVideo
            src="https://assets.mixkit.co/videos/preview/mixkit-texture-of-black-and-silver-fluid-with-glitter-43187-large.mp4"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-32 pb-24 flex-grow flex flex-col justify-between">
          
          {/* Section Header */}
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 0.8, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-sm font-mono tracking-widest text-white/80 mb-4"
            >
              // Nasza Oferta
            </motion.p>
            
            <motion.h2
              initial={{ filter: "blur(6px)", opacity: 0, y: 15 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading italic text-white text-5xl sm:text-6xl md:text-[6rem] leading-[0.9] tracking-tight"
            >
              Kompleksowe rozwiązania
            </motion.h2>
          </div>

          {/* Grid of 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 sm:mt-24">
            
            {SERVICES_DATA.map((service, index) => {
              const IconComponent = service.icon;

              return (
                <motion.div
                  key={service.id}
                  initial={{ filter: "blur(8px)", opacity: 0, y: 25 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.8,
                    delay: (index % 3) * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="liquid-glass min-h-[310px] flex flex-col justify-between p-8 rounded-3xl cursor-default group transition-all duration-500 hover:bg-white/[0.03] hover:shadow-2xl hover:shadow-white/[0.02]"
                >
                  
                  {/* Top Header of the Card */}
                  <div className="flex items-start justify-between w-full">
                    
                    {/* Left Side: Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-105 transition-all duration-300">
                      {service.isCustomIcon ? (
                        /* Drone Icon */
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5.5 h-5.5 text-white/95"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 10h16M12 4v16" />
                          <circle cx="12" cy="12" r="2.5" />
                          <path d="M3 6a2 2 0 1 1 2 2M17 6a2 2 0 1 1 2 2M3 18a2 2 0 1 1 2-2M17 18a2 2 0 1 1 2-2" />
                        </svg>
                      ) : (
                        IconComponent && (
                          <IconComponent className="w-5 h-5 text-white/95" />
                        )
                      )}
                    </div>

                    {/* Right Side: Tags */}
                    <div className="flex flex-wrap gap-1 max-w-[70%] justify-end">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="liquid-glass text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 text-white/80 font-mono rounded-full border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Bottom Text of the Card */}
                  <div className="mt-8">
                    <h3 className="font-heading italic text-3xl text-white mb-3 group-hover:translate-x-1.5 transition-transform duration-300">
                      {service.title}
                    </h3>
                    <p className="font-body text-sm text-white/60 leading-relaxed group-hover:text-white/70 transition-colors">
                      {service.description}
                    </p>
                  </div>

                </motion.div>
              );
            })}

          </div>

          {/* SECTION 3: PROSTY KONTAKT (Dół strony) */}
          <div
            id="contact"
            className="mt-28 sm:mt-36 pt-12 pb-6 border-t border-white/5 flex flex-col items-center text-center relative z-20"
          >
            
            <motion.h4
              initial={{ filter: "blur(6px)", opacity: 0, y: 15 }}
              whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-heading italic text-white text-4xl sm:text-5xl md:text-6xl mb-10 tracking-tight"
            >
              Gotowy na współpracę?
            </motion.h4>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center"
            >
              {/* Write E-mail */}
              <a
                href="mailto:kayetanmalczewski@gmail.com"
                className="liquid-glass px-8 py-4 rounded-full font-body font-medium text-white/90 hover:text-white flex items-center justify-center gap-2.5 hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 w-full sm:w-auto border border-white/5 shadow-md"
              >
                <Mail className="w-4.5 h-4.5" />
                Napisz na e-mail
              </a>

              {/* Visit Instagram */}
              <a
                href="https://www.instagram.com/wtf.kajtofel"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass px-8 py-4 rounded-full font-body font-medium text-white/90 hover:text-white flex items-center justify-center gap-2.5 hover:bg-white/5 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 w-full sm:w-auto border border-white/5 shadow-md"
              >
                <Instagram className="w-4.5 h-4.5" />
                Odwiedź Instagram
              </a>

            </motion.div>



          </div>

        </div>

      </section>

    </div>
  );
}
