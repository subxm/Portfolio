import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';
import { ArrowUpRight, ArrowRight, Instagram, Linkedin, Dribbble, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- 1. Loading Screen Component ---
interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];

  useEffect(() => {
    // Word cycle logic
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    // Count animation logic
    let startTimestamp: number | null = null;
    const duration = 2700; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * 100);
      
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    window.requestAnimationFrame(step);

    return () => {
      clearInterval(wordInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none"
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xs text-muted uppercase tracking-[0.3em] font-body"
        >
          Portfolio
        </motion.div>
        <div className="text-xs text-muted uppercase tracking-[0.3em]">
          Michael Smith // '26
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex justify-center items-center h-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="text-xs text-muted max-w-[200px] leading-relaxed">
            Architecting modern interactions & digital aesthetics
          </div>
          <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums tracking-tighter leading-none">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-[3px] bg-stroke/50 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full accent-gradient transition-transform duration-75 ease-out origin-left rounded-full shadow-[0_0_8px_rgba(137,170,204,0.35)]"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const footerVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  
  // Explorations Parallax Section Refs
  const pinnedSectionRef = useRef<HTMLDivElement | null>(null);
  const pinContentRef = useRef<HTMLDivElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  const roles = ["Creative", "Fullstack", "Founder", "Scholar"];

  // Handle Scroll event for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Roles cycler
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // HLS Video Integration
  const setupHls = (videoElement: HTMLVideoElement | null, streamUrl: string) => {
    if (!videoElement) return;
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = streamUrl;
    }
  };

  useEffect(() => {
    if (isLoading) return;
    const videoUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
    setupHls(heroVideoRef.current, videoUrl);
    setupHls(footerVideoRef.current, videoUrl);
  }, [isLoading]);

  // GSAP Entrance and Parallax Scroll animations
  useEffect(() => {
    if (isLoading) return;

    // 1. Hero GSAP Entrance Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".name-reveal", 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      );

      tl.fromTo(".blur-in", 
        { opacity: 0, filter: "blur(10px)", y: 20 }, 
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
        "-=0.9"
      );

      // 2. Explorations (Parallax Visual Playground) Scroll Trigger
      // Pinned title column
      if (pinnedSectionRef.current && pinContentRef.current) {
        ScrollTrigger.create({
          trigger: pinnedSectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinContentRef.current,
          pinSpacing: false,
          anticipatePin: 1
        });
      }

      // Parallax Left Column
      if (leftColRef.current) {
        gsap.fromTo(leftColRef.current,
          { y: 80 },
          {
            y: -80,
            ease: "none",
            scrollTrigger: {
              trigger: pinnedSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      }

      // Parallax Right Column
      if (rightColRef.current) {
        gsap.fromTo(rightColRef.current,
          { y: -60 },
          {
            y: 60,
            ease: "none",
            scrollTrigger: {
              trigger: pinnedSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          }
        );
      }

      // 3. Infinite Marquee Animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          duration: 24,
          ease: "none",
          repeat: -1,
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading]);

  // Smooth Scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const projectCards = [
    {
      title: "Automotive Motion",
      category: "CGI & Interaction",
      colSpan: "md:col-span-7",
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Urban Architecture",
      category: "Brutalist Spaces",
      colSpan: "md:col-span-5",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Human Perspective",
      category: "Portraits & Motion",
      colSpan: "md:col-span-5",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Brand Identity",
      category: "Aesthetics & Systems",
      colSpan: "md:col-span-7",
      image: "https://images.unsplash.com/photo-1541462608141-2ffb68df685e?auto=format&fit=crop&w=1200&q=80",
    }
  ];

  const journalEntries = [
    {
      title: "The Architecture of Simple Code",
      category: "Engineering",
      date: "May 24, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Minimal Design & Cognitive Overload",
      category: "UX Design",
      date: "Apr 12, 2026",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "A Study on Kinetic Web Layouts",
      category: "Development",
      date: "Mar 08, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Designing Seamless Digital Spaces",
      category: "Branding",
      date: "Feb 18, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const visualPlayground = [
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="bg-bg text-text-primary min-h-screen relative font-body selection:bg-text-primary selection:text-bg">
          
          {/* Floating Navigation Bar */}
          <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
            <nav className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface/80 px-2.5 py-2 pointer-events-auto transition-all duration-300 ${scrollY > 100 ? 'shadow-lg shadow-black/30 bg-surface/95 scale-95 border-white/15' : ''}`}>
              <div 
                className="group flex items-center justify-center w-9 h-9 rounded-full relative cursor-pointer mr-2 overflow-hidden"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="absolute inset-0 accent-gradient rounded-full transition-transform duration-500 group-hover:rotate-180" />
                <div className="absolute inset-[1.5px] bg-bg rounded-full flex items-center justify-center">
                  <span className="font-display italic text-[13px] text-text-primary">MS</span>
                </div>
              </div>

              <div className="w-px h-5 bg-stroke/60 mx-1 hidden sm:block" />

              <div className="flex gap-1.5 sm:gap-2">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs sm:text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 text-text-primary bg-stroke/40"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('work')}
                  className="text-xs sm:text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 text-muted hover:text-text-primary hover:bg-stroke/30"
                >
                  Work
                </button>
                <button 
                  onClick={() => scrollToSection('journal')}
                  className="text-xs sm:text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 text-muted hover:text-text-primary hover:bg-stroke/30"
                >
                  Journal
                </button>
              </div>

              <div className="w-px h-5 bg-stroke/60 mx-2" />

              {/* Say Hi Button with Gradient Border Ring */}
              <a 
                href="mailto:hello@michaelsmith.com" 
                className="group relative inline-flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold text-text-primary overflow-hidden"
              >
                <span className="absolute inset-0 accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }} />
                <span className="relative z-10 bg-surface rounded-full px-4 py-2 flex items-center gap-1.5 border border-white/5 group-hover:border-transparent transition-colors duration-200">
                  Say hi 
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </a>
            </nav>
          </div>

          {/* SECTION 2: HERO */}
          <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background HLS Video */}
            <div className="absolute inset-0 z-0">
              <video
                ref={heroVideoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-80"
              />
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
            </div>

            {/* Centered Hero Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl mt-12">
              <div className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-6 font-semibold">
                COLLECTION '26
              </div>
              <h1 ref={nameRef} className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.95] tracking-tight text-text-primary mb-6">
                Michael Smith
              </h1>
              
              <div className="blur-in text-lg md:text-xl lg:text-2xl font-light text-text-primary/90 mb-6 h-8 flex items-center justify-center">
                A&nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="font-display italic text-text-primary font-semibold"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
                &nbsp;lives in Chicago.
              </div>

              <p className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-10 leading-relaxed font-light">
                Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
              </p>

              <div className="blur-in flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => scrollToSection('work')}
                  className="group relative rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto px-8 py-4 bg-text-primary text-bg hover:bg-bg hover:text-text-primary hover:scale-105"
                >
                  <span className="absolute inset-0 accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <span className="relative">See Works</span>
                </button>
                <a 
                  href="mailto:hello@michaelsmith.com"
                  className="group relative rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto px-8 py-4 border-2 border-stroke bg-bg text-text-primary hover:border-transparent hover:scale-105 flex items-center justify-center gap-1.5"
                >
                  <span className="absolute inset-0 accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <span className="relative flex items-center gap-1.5">
                    Reach out <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
                  </span>
                </a>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer select-none"
              onClick={() => scrollToSection('work')}
            >
              <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">SCROLL</span>
              <div className="w-[1px] h-10 bg-stroke/60 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/80 animate-scroll-down rounded-full" />
              </div>
            </div>
          </section>

          {/* SECTION 3: SELECTED WORKS */}
          <section id="work" className="bg-bg py-24 md:py-32 relative z-10 border-t border-stroke/40">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-stroke" />
                    <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Selected Work</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light">
                    Featured <span className="font-display italic font-semibold">projects</span>
                  </h2>
                  <p className="text-muted text-sm md:text-base mt-3 max-w-md font-light leading-relaxed">
                    A selection of projects I've worked on, from concept to launch.
                  </p>
                </div>
                <button 
                  onClick={() => scrollToSection('work')}
                  className="group relative hidden md:inline-flex items-center justify-center rounded-full text-sm font-semibold overflow-hidden"
                >
                  <span className="absolute inset-0 accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1.5px' }} />
                  <span className="relative z-10 bg-surface rounded-full px-6 py-3 flex items-center gap-2 border border-white/5 group-hover:border-transparent transition-all duration-200">
                    View all work
                    <ArrowRight className="w-4 h-4 text-text-primary group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                {projectCards.map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`${project.colSpan} group relative bg-surface border border-stroke rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[480px] cursor-pointer`}
                  >
                    {/* Background Image */}
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Halftone Overlay Effect */}
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                        backgroundSize: '4px 4px'
                      }}
                    />

                    {/* Gradient Fade Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-300" />

                    {/* Static Title Overlay (Visible on load) */}
                    <div className="absolute bottom-6 left-6 right-6 z-10 group-hover:opacity-0 transition-opacity duration-300">
                      <span className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">{project.category}</span>
                      <h3 className="text-xl md:text-2xl font-semibold text-text-primary mt-1">{project.title}</h3>
                    </div>

                    {/* Hover Overlay with Blur and Label */}
                    <div className="absolute inset-0 bg-bg/75 opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all duration-300 flex flex-col justify-between p-8">
                      <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold">
                        {project.category}
                      </div>

                      <div className="flex flex-col items-center text-center justify-center flex-grow">
                        <div className="relative inline-flex items-center justify-center rounded-full overflow-hidden p-[1px] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <span className="absolute inset-0 accent-gradient rounded-full animate-gradient-shift" />
                          <span className="relative z-10 bg-white text-bg font-semibold rounded-full px-6 py-2.5 text-xs tracking-wider flex items-center gap-1.5 shadow-lg shadow-black/25">
                            View — <span className="font-display italic font-bold">{project.title}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-stroke/40 pt-4">
                        <span className="text-xs text-muted font-light">Explore Case Study</span>
                        <ArrowUpRight className="w-4 h-4 text-text-primary" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 4: JOURNAL */}
          <section id="journal" className="bg-bg py-24 md:py-32 relative z-10 border-t border-stroke/40">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-stroke" />
                    <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Recent Thoughts</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light">
                    The <span className="font-display italic font-semibold">Journal</span>
                  </h2>
                </div>
                <button 
                  className="group relative hidden md:inline-flex items-center justify-center rounded-full text-sm font-semibold overflow-hidden"
                >
                  <span className="absolute inset-0 accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1.5px' }} />
                  <span className="relative z-10 bg-surface rounded-full px-6 py-3 flex items-center gap-2 border border-white/5 group-hover:border-transparent transition-all duration-200">
                    View all entries
                    <ArrowRight className="w-4 h-4 text-text-primary group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>
              </div>

              {/* Journal Pills */}
              <div className="flex flex-col gap-4">
                {journalEntries.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 md:p-6 rounded-[24px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke/60 hover:border-stroke cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                      {/* Image Preview */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 border border-stroke">
                        <img 
                          src={entry.image} 
                          alt={entry.title} 
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" 
                        />
                      </div>
                      
                      {/* Title & Metadata */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted uppercase tracking-[0.15em] font-semibold">{entry.category}</span>
                        <h3 className="text-base sm:text-lg md:text-xl font-medium text-text-primary line-clamp-1 leading-snug">
                          {entry.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-stroke/20 pt-3 sm:pt-0">
                      <div className="flex items-center gap-4 text-xs text-muted">
                        <span>{entry.date}</span>
                        <span className="w-1 h-1 rounded-full bg-stroke" />
                        <span>{entry.readTime}</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-stroke/20 group-hover:bg-text-primary flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-text-primary" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: EXPLORATIONS (PARALLAX GALLERY) */}
          <section ref={pinnedSectionRef} className="bg-bg relative min-h-[300vh] border-t border-stroke/40 z-10">
            
            {/* Layer 1: Pinned Center Panel */}
            <div ref={pinContentRef} className="absolute inset-0 h-screen w-full flex items-center z-10 pointer-events-none">
              <div className="max-w-[1200px] mx-auto px-6 md:px-12 w-full flex justify-start items-center">
                <div className="max-w-md pointer-events-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-stroke" />
                    <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Explorations</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6">
                    Visual <span className="font-display italic font-semibold">playground</span>
                  </h2>
                  <p className="text-muted text-sm md:text-base mb-8 leading-relaxed font-light">
                    A continuous stream of layouts, animations, visual experiments, and personal project snippets.
                  </p>
                  
                  <a
                    href="https://dribbble.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center rounded-full text-sm font-semibold overflow-hidden"
                  >
                    <span className="absolute inset-0 accent-gradient rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1.5px' }} />
                    <span className="relative z-10 bg-surface rounded-full px-6 py-3 flex items-center gap-2 border border-white/5 group-hover:border-transparent transition-all duration-200">
                      Follow on Dribbble
                      <ArrowUpRight className="w-4 h-4 text-text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Layer 2: Parallax Columns (Right aligned) */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 flex justify-end min-h-[300vh] py-32">
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-6 md:gap-16 pt-32">
                
                {/* Column 1 (Slightly Offset) */}
                <div ref={leftColRef} className="flex flex-col gap-6 md:gap-16">
                  {visualPlayground.slice(0, 3).map((imgUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => setLightboxImage(imgUrl)}
                      className="aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden border border-stroke cursor-pointer relative group transition-transform duration-300 hover:rotate-1 shadow-2xl"
                    >
                      <img src={imgUrl} alt="Visual playground" className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 2 (Parallax Counter) */}
                <div ref={rightColRef} className="flex flex-col gap-6 md:gap-16 pt-24">
                  {visualPlayground.slice(3, 6).map((imgUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => setLightboxImage(imgUrl)}
                      className="aspect-square w-full rounded-2xl md:rounded-3xl overflow-hidden border border-stroke cursor-pointer relative group transition-transform duration-300 hover:-rotate-1 shadow-2xl"
                    >
                      <img src={imgUrl} alt="Visual playground" className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 6: STATS */}
          <section className="bg-bg py-24 md:py-32 relative z-10 border-t border-stroke/40">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-stroke/40">
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left md:pl-0 py-6 md:py-0">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-display font-light accent-gradient bg-clip-text text-transparent mb-3 font-semibold">20+</span>
                  <span className="text-sm font-semibold uppercase tracking-[0.1em] text-text-primary">Years Experience</span>
                  <span className="text-xs text-muted mt-2 font-light">Industry leadership & execution</span>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left md:pl-12 py-6 md:py-0">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-display font-light accent-gradient bg-clip-text text-transparent mb-3 font-semibold">95+</span>
                  <span className="text-sm font-semibold uppercase tracking-[0.1em] text-text-primary">Projects Done</span>
                  <span className="text-xs text-muted mt-2 font-light">From MVP designs to scaling platforms</span>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left md:pl-12 py-6 md:py-0">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-display font-light accent-gradient bg-clip-text text-transparent mb-3 font-semibold">200%</span>
                  <span className="text-sm font-semibold uppercase tracking-[0.1em] text-text-primary">Client Satisfaction</span>
                  <span className="text-xs text-muted mt-2 font-light">Deep partnerships & repeat clients</span>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 7: CONTACT / FOOTER */}
          <footer className="relative bg-black pt-24 md:pt-32 pb-8 overflow-hidden z-10 border-t border-stroke/40">
            
            {/* Background HLS Video (Vertically flipped) */}
            <div className="absolute inset-0 z-0">
              <video
                ref={footerVideoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none scale-y-[-1] opacity-70"
              />
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col justify-between h-full min-h-[400px]">
              
              {/* Top Row CTA */}
              <div className="text-center max-w-2xl mx-auto space-y-8 my-auto">
                <span className="text-xs text-muted uppercase tracking-[0.3em] font-semibold">Get in Touch</span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-light text-text-primary leading-tight">
                  Let's make something <span className="font-display italic font-semibold">incredible</span> together.
                </h2>
                
                <a
                  href="mailto:hello@michaelsmith.com"
                  className="group relative inline-flex items-center justify-center rounded-full text-base font-semibold overflow-hidden scale-100 hover:scale-105 transition-transform duration-300"
                >
                  <span className="absolute inset-0 accent-gradient rounded-full animate-gradient-shift" />
                  <span className="relative z-10 bg-bg text-text-primary rounded-full px-8 py-4 flex items-center gap-2 border border-white/10 group-hover:border-transparent transition-all duration-200">
                    hello@michaelsmith.com
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>

              {/* GSAP Marquee */}
              <div className="w-full overflow-hidden border-y border-stroke/40 py-6 mb-16 select-none">
                <div ref={marqueeRef} className="flex whitespace-nowrap text-3xl md:text-5xl lg:text-6xl font-display tracking-tight text-stroke font-semibold">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="mr-8">
                      BUILDING THE FUTURE •
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Bottom Row */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-stroke/20">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted font-semibold tracking-wider uppercase">Available for select projects</span>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-6">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                    <Dribbble className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text-primary transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>

                <div className="text-[10px] text-muted tracking-widest uppercase">
                  © 2026 Michael Smith • All rights reserved
                </div>
              </div>

            </div>
          </footer>

          {/* Lightbox Component for Visual Playground */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
              >
                <motion.img
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  src={lightboxImage}
                  alt="Lightbox preview"
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-stroke"
                />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </>
  );
}