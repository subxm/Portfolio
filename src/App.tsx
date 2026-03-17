import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, ArrowRight, Code2, Layers, Cpu, Database, Terminal, FileText } from 'lucide-react';

// --- Components ---

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[100] mix-blend-difference flex items-center justify-center"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.5 : 1,
        backgroundColor: isHovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <motion.div 
        className="w-1 h-1 bg-white rounded-full"
        animate={{ opacity: isHovering ? 0 : 1 }}
      />
    </motion.div>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="mb-20 md:mb-32">
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 45 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformPerspective: 1000 }}
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
          {title}
        </h2>
        {subtitle && (
          <p className="text-zinc-400 mt-4 text-lg md:text-xl max-w-2xl font-light tracking-wide">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
};

const ProjectCard = ({ project, i, progress, range, targetScale }: any) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.5, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);
  
  const techStack = project.tech_stack ? (Array.isArray(project.tech_stack) ? project.tech_stack : JSON.parse(project.tech_stack)) : [];

  return (
    <div ref={containerRef} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, top: `calc(-10vh + ${i * 25}px)` }} 
        className="relative flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transform-gpu origin-top"
      >
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{project.title}</h3>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-10">
            {techStack.map((tech: string) => (
              <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-zinc-300">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-6 mt-auto">
            {project.url && project.url !== '#' && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-white font-medium">
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">Live Site</span>
                  <span className="inline-block absolute left-0 top-full transition-transform duration-300 group-hover:-translate-y-full">Live Site</span>
                </span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-1/2 relative overflow-hidden h-64 md:h-auto border-l border-white/10">
          <motion.div style={{ scale: imageScale }} className="w-full h-full">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

// Hardcoded data
const SKILLS = [
  { id: 1, name: "JavaScript", category: "Frontend" },
  { id: 2, name: "TypeScript", category: "Frontend" },
  { id: 3, name: "React", category: "Frontend" },
  { id: 4, name: "Next.js", category: "Frontend" },
  { id: 5, name: "Tailwind CSS", category: "Frontend" },
  { id: 6, name: "Node.js", category: "Backend" },
  { id: 7, name: "Express", category: "Backend" },
  { id: 14, name: "Spring Boot", category: "Backend" },
  { id: 8, name: "MongoDB", category: "Database" },
  { id: 9, name: "PostgreSQL", category: "Database" },
  { id: 10, name: "Prisma", category: "Database" },
  { id: 15, name: "Redis", category: "Database" },
  { id: 16, name: "MySQL", category: "Database" },
  { id: 11, name: "Git", category: "Tools" },
  { id: 12, name: "GitHub", category: "Tools" },
  { id: 13, name: "Docker", category: "Tools" }
];

const PROJECTS = [
  {
    id: 1,
    title: "Spark",
    description: "An AI-powered full-stack UI builder that turns natural language prompts into production-ready interfaces with live preview, iterative chat refinement, and secure auth-backed persistence.",
    tech_stack: ["React", "Node.js", "Express", "PostgreSQL", "Gemini AI"],
    url: "https://spark-nine-beta.vercel.app/",
    github_url: "https://github.com/subxm/Spark",
    image_url: "https://image.thum.io/get/width/1200/https://spark-nine-beta.vercel.app/"
  },
  {
    id: 2,
    title: "CodeCollab",
    description: "A real-time collaborative IDE with AI pair programming, live code execution, and instant team sync. Multiple developers can write code simultaneously with live cursor sync powered by Socket.io.",
    tech_stack: ["React", "Node.js", "Socket.io", "AI"],
    url: "https://codecollab-five.vercel.app/",
    github_url: "https://github.com/subxm/code_collab",
    image_url: "https://image.thum.io/get/width/1200/https://codecollab-five.vercel.app/"
  }
];

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" }
] as const;

export default function App() {
  const skills = SKILLS;
  const projects = PROJECTS;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const navBackground = useTransform(scrollYProgress, [0, 0.08], ["rgba(0, 0, 0, 0)", "rgba(9, 9, 11, 0.72)"]);
  const navBorderColor = useTransform(scrollYProgress, [0, 0.08], ["rgba(255,255,255,0)", "rgba(255,255,255,0.12)"]);

  const categories = [...new Set(skills.map(skill => skill.category))];

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);

    if (!section) return;

    const navOffset = 96;
    const top = section.getBoundingClientRect().top + window.scrollY - navOffset;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen selection:bg-white selection:text-black overflow-clip font-sans">
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50 mix-blend-difference"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-40 p-6 flex justify-between items-center pointer-events-none border-b border-transparent backdrop-blur-xl"
        style={{ backgroundColor: navBackground, borderBottomColor: navBorderColor }}
      >
        <div className="text-2xl font-black tracking-tighter pointer-events-auto">SUBHAM.</div>
        <div className="flex gap-7 text-sm font-medium pointer-events-auto">
          {NAV_ITEMS.map((item) => (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => handleNavClick(event, item.id)}
              className="group relative py-1"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              <span>{item.label}</span>
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </motion.a>
          ))}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills skills={skills} categories={categories} />

      {/* Projects Section */}
      <div id="work" className="relative mt-32 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <SectionHeading title="Selected Work" subtitle="A collection of my recent projects, demonstrating my ability to build full-stack applications from the ground up." />
        </div>
        
        <div className="relative w-full">
          {projects.map((project, i) => {
            const targetScale = 1 - ( (projects.length - i) * 0.05);
            return (
              <ProjectCard 
                key={project.id} 
                i={i} 
                project={project} 
                progress={scrollYProgress} 
                range={[i * 0.25, 1]} 
                targetScale={targetScale} 
              />
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}

// --- Sub-Sections ---

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const rotateX = useTransform(scrollY, [0, 500], [0, 20]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden perspective-[1000px] px-6">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      <motion.div
        className="absolute -left-20 top-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-24 bottom-20 w-72 h-72 rounded-full bg-white/8 blur-3xl"
        animate={{ x: [0, -28, 0], y: [0, 24, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        style={{ y, opacity, scale, rotateX }}
        className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(260px,420px)_1fr] gap-10 lg:gap-20 items-center transform-gpu"
      >
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm mx-auto lg:mx-0"
        >
          <div className="absolute -inset-4 bg-gradient-to-br from-white/20 to-transparent blur-2xl opacity-60" />
          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <img
              src="/profile.png"
              alt="Subham Singh Negi profile"
              className="w-full h-[420px] sm:h-[460px] object-cover object-top"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-zinc-300">Available for new opportunities</span>
          </div>
          
          <h1 className="font-black leading-tight tracking-tighter mb-6">
            <span className="block text-3xl md:text-4xl lg:text-5xl mb-2">Hi, I'm</span>
            <span className="block text-[clamp(2.2rem,5.6vw,5.25rem)] whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-white">Subham Singh Negi.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-light">
            I build immersive digital experiences, combining robust backend architecture with cutting-edge frontend design.
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-zinc-500 to-transparent" />
      </motion.div>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const isInView = useInView(ref, { once: true, margin: "-120px" });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="about" className="py-32 md:py-48 relative px-6 scroll-mt-28" ref={ref}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5">
          <SectionHeading title="About" />
        </div>
        
        <motion.div 
          style={{ y }}
          initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 text-2xl md:text-4xl font-light leading-tight tracking-tight text-zinc-300"
        >
          <p className="mb-8">
            I'm a developer who loves learning by building. You'll usually find me working on something new, exploring the bleeding edge of web technologies.
          </p>
          <p className="text-zinc-500">
            Comfortable across the entire stack, I architect robust backend APIs and craft intuitive, responsive frontends. I push myself to build things that actually matter.
          </p>
          
          <div className="mt-12 flex flex-wrap gap-6">
            <motion.a href="https://github.com/subxm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium border-b border-white/30 pb-1 hover:border-white transition-colors" whileHover={{ x: 8 }}>
              <Github className="w-5 h-5" /> GitHub
            </motion.a>
            <motion.a href="https://www.linkedin.com/in/subxm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium border-b border-white/30 pb-1 hover:border-white transition-colors" whileHover={{ x: 8 }}>
              <Linkedin className="w-5 h-5" /> LinkedIn
            </motion.a>
            <motion.a href="/Subham_Resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium border-b border-white/30 pb-1 hover:border-white transition-colors" whileHover={{ x: 8 }}>
              <FileText className="w-5 h-5" /> Resume
            </motion.a>
            <motion.a href="https://leetcode.com/u/subxm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg font-medium border-b border-white/30 pb-1 hover:border-white transition-colors" whileHover={{ x: 8 }}>
              <Code2 className="w-5 h-5" /> LeetCode
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Skills({ skills, categories }: { skills: any[], categories: string[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const iconMap: Record<string, any> = {
    'Frontend': Layers,
    'Backend': Cpu,
    'Database': Database,
    'Tools': Terminal
  };

  return (
    <section className="py-32 px-6 bg-zinc-950 relative border-y border-white/5 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Expertise" subtitle="Technologies I've mastered to build scalable applications." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => {
            const Icon = iconMap[category] || Code2;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10, scale: 1.02, rotateX: 3, rotateY: -3 }}
                className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-all duration-500"
                style={{ transformPerspective: 1000 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                
                <Icon className="w-10 h-10 mb-6 text-zinc-400 group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{category}</h3>
                
                <ul className="space-y-3">
                  {skills.filter(s => s.category === category).map(skill => (
                    <li key={skill.id} className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors" />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-6 relative overflow-hidden scroll-mt-28" ref={ref}>
      <div className="absolute inset-0 bg-zinc-950 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05)_0,transparent_50%)] z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20">
        <motion.div
          initial={{ opacity: 0, x: -60, filter: "blur(12px)" }}
          animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8">
            Let's <br/> <span className="text-zinc-500">Talk.</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-md font-light mb-12">
            Have a project in mind or want to explore opportunities? Drop a message and let's build something incredible together.
          </p>
          
          <div className="space-y-6">
            <a href="mailto:subhamsinghnegi03@gmail.com" className="flex items-center gap-4 text-xl md:text-2xl font-light hover:text-zinc-300 transition-colors break-all">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              subhamsinghnegi03@gmail.com
            </a>
          </div>
        </motion.div>

        <motion.div
          className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl"
          initial={{ opacity: 0, x: 60, filter: "blur(12px)" }}
          animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="access_key" value="f348776c-0cc8-49c3-b726-6949d63f5555" />
            <div className="relative group">
              <input 
                type="text" 
                name="name" 
                id="name"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                placeholder="Name"
              />
              <label htmlFor="name" className="absolute left-0 top-4 text-zinc-500 text-lg transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-zinc-300 peer-valid:-top-4 peer-valid:text-sm peer-valid:text-zinc-300 cursor-text">
                What's your name?
              </label>
            </div>
            
            <div className="relative group">
              <input 
                type="email" 
                name="email" 
                id="email"
                required
                className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent"
                placeholder="Email"
              />
              <label htmlFor="email" className="absolute left-0 top-4 text-zinc-500 text-lg transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-zinc-300 peer-valid:-top-4 peer-valid:text-sm peer-valid:text-zinc-300 cursor-text">
                What's your email?
              </label>
            </div>
            
            <div className="relative group">
              <textarea 
                name="message" 
                id="message"
                required
                rows={4}
                className="w-full bg-transparent border-b border-white/20 py-4 text-lg focus:outline-none focus:border-white transition-colors peer placeholder-transparent resize-none"
                placeholder="Message"
              />
              <label htmlFor="message" className="absolute left-0 top-4 text-zinc-500 text-lg transition-all peer-focus:-top-4 peer-focus:text-sm peer-focus:text-zinc-300 peer-valid:-top-4 peer-valid:text-sm peer-valid:text-zinc-300 cursor-text">
                Tell me about your project...
              </label>
            </div>

            <motion.button 
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-5 rounded-xl bg-white text-black font-bold text-lg flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative"
              whileHover={status === 'idle' ? { y: -2, scale: 1.02 } : {}}
              whileTap={status === 'idle' ? { scale: 0.98 } : {}}
            >
              <span className="relative z-10 flex items-center gap-2">
                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                {status === 'idle' && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
            </motion.button>
            
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        </motion.div>
      </div>
      
      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Subham. All rights reserved.</p>
        <p className="mt-4 md:mt-0">Designed & Built with precision.</p>
      </div>
    </section>
  );
}