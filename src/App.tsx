/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { COMPANHIA, INFRA_GERAL, TEAM } from './data';
import { TeamMember } from './types';
import BudgetCalculator from './components/BudgetCalculator';
import ServicesPanel from './components/ServicesPanel';
import AcademicSection from './components/AcademicSection';
import ContactForm from './components/ContactForm';
import TemplateCarousel, { TEMPLATES_DATA, TemplateProject } from './components/TemplateCarousel';
import AiCopilot from './components/AiCopilot';
import LoginModal from './components/LoginModal';
import { 
  Cable, Server, HardDrive, Users, CheckCircle, Menu, X, 
  GraduationCap, ArrowRight, ShieldCheck, Activity, Brain, CheckCircle2,
  FileText, Award, Layers, ShieldAlert, BadgeCheck, Zap, Anchor, Sparkles,
  ChevronDown, Lock, Unlock, User, Gauge, Terminal, ArrowRightLeft, Wifi, Download,
  ChevronLeft, ChevronRight, Leaf, Coins, Recycle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);

  // Shared state of students/authors initialized directly to default TEAM
  const [students, setStudents] = useState<TeamMember[]>(() => {
    localStorage.removeItem('amapa_smart_students');
    return TEAM;
  });

  const [activeTemplate, setActiveTemplate] = useState<TemplateProject | null>(null);

  useEffect(() => {
    localStorage.setItem('amapa_smart_students', JSON.stringify(students));
  }, [students]);

  // Squarespace Login Portal & Live Telemetry states
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>("Alessandro Passos");
  const [emailInput, setEmailInput] = useState<string>("alepassos.san@gmail.com");
  const [passInput, setPassInput] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [linkThroughput, setLinkThroughput] = useState<number>(9.948);
  const [activePortalTab, setActivePortalTab] = useState<string>("overview");
  const [ticketSubject, setTicketSubject] = useState<string>("");
  const [ticketSent, setTicketSent] = useState<boolean>(false);

  // Easter Egg States
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [explosionState, setExplosionState] = useState<'idle' | 'detonated' | 'restoring'>('idle');
  const [debrisPositions, setDebrisPositions] = useState<Array<{x: number, y: number, rot: number, scale: number}>>([]);

  useEffect(() => {
    if (logoClicks === 0) return;
    const t = setTimeout(() => {
      setLogoClicks(0);
    }, 4000);
    return () => clearTimeout(t);
  }, [logoClicks]);

  const handleLogoClick = () => {
    // Scroll to section "inicio" as standard logo action
    scrollToSection("inicio");

    if (isExploded) return;

    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 7) {
        setIsExploded(true);
        setExplosionState('detonated');
        
        // Generate radial zero-g space explosion vectors for 12 layout parts
        const items = Array.from({ length: 12 }).map((_, idx) => {
          const angle = (idx * (360 / 12) + (Math.random() * 15)) * (Math.PI / 180);
          const distance = 450 + Math.random() * 700;
          return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            rot: (Math.random() - 0.5) * 850,
            scale: 0.22 + Math.random() * 0.28
          };
        });
        setDebrisPositions(items);
        
        // Step 1: Fly and drift around in space/zero-g for 4.2 seconds
        setTimeout(() => {
          setExplosionState('restoring');
        }, 4200);

        // Step 2: Smoothly snap and lock back in place by 7.5 seconds
        setTimeout(() => {
          setIsExploded(false);
          setExplosionState('idle');
          setLogoClicks(0);
        }, 7500);

        return 0;
      }
      return next;
    });
  };

  const getExplosionStyle = (index: number) => {
    if (!isExploded || !debrisPositions[index]) return {
      transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.8s, filter 1.8s'
    };

    if (explosionState === 'restoring') {
      // Reassemble in mid-air smoothly coming back to home coordinates!
      return {
        transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        transition: 'transform 3.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 3.2s ease, filter 3.2s ease',
        pointerEvents: 'auto' as const,
      };
    }

    const dp = debrisPositions[index];
    
    // Choose gentle drift parameters for alternating elements so they wave out of phase
    const driftX = (index % 2 === 0 ? 35 : -40);
    const driftY = (index % 3 === 0 ? -30 : 25);
    const driftRot = (index % 2 === 0 ? 9 : -12);

    return {
      '--tx': `${dp.x}px`,
      '--ty': `${dp.y}px`,
      '--rot': `${dp.rot}deg`,
      '--sc': dp.scale,
      '--driftX': `${driftX}px`,
      '--driftY': `${driftY}px`,
      '--driftRot': `${driftRot}deg`,
      opacity: 0.1,
      pointerEvents: 'none' as const,
      filter: 'blur(5px)',
    } as React.CSSProperties;
  };

  // Fluctuating network speed simulation when logged in (like real-life telemetry)
  useEffect(() => {
    if (!isLoggedIn) return;
    const triggerFluctuation = setInterval(() => {
      setLinkThroughput(+(9.85 + Math.random() * 0.145).toFixed(3));
    }, 1800);
    return () => clearInterval(triggerFluctuation);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScrollNavbar = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScrollNavbar);
    return () => window.removeEventListener('scroll', handleScrollNavbar);
  }, []);

  // Rotating phrases for the animated header tagline
  const heroPhrases = [
    "PROJETO DE REDE.",
    "SISTEMA INTEGRADO.",
    "CPD DE ALTO PADRÃO.",
    "PONTO DE CONEXÃO.",
    "FUTURO TECNOLÓGICO.",
    "ATERRAMENTO NOMINAL."
  ];
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState<number>(0);

  useEffect(() => {
    const handlePhraseRotate = setInterval(() => {
      setCurrentPhraseIdx((prev) => (prev + 1) % heroPhrases.length);
    }, 4000);
    return () => clearInterval(handlePhraseRotate);
  }, []);

  // Track active section for navigation highlight
  useEffect(() => {
    const sections = ["inicio", "empresa", "sustentabilidade", "servicos", "orcador", "equipe", "contato"];
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200; // offset for sticky header
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    // Trigger once on mount
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const menuItems = [
    { id: "inicio", label: "Início" },
    { id: "empresa", label: "A Empresa" },
    { id: "sustentabilidade", label: "Meio Ambiente" },
    { id: "servicos", label: "Serviços" },
    { id: "orcador", label: "Orçador" },
    { id: "equipe", label: "Equipe" },
    { id: "contato", label: "Orçamento" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset of the header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  const handleSelectTemplate = (template: TemplateProject) => {
    setActiveTemplate(template);
    // Scroll smoothly to budget calculator section
    scrollToSection("orcador");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Autenticando...");
    setTimeout(() => {
      setIsLoggedIn(true);
      setSuccessMsg("");
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassInput("");
    setTicketSent(false);
  };

  const dropdownProducts = [
    { title: "Cabeamento Blindado Cat6A", desc: "Cabos de cobre F/UTP Furukawa para links de até 10 Gbps", icon: <Cable className="w-4 h-4 text-white" />, section: "servicos" },
    { title: "Backbone de Fibra Monomodo", desc: "Enlaces ópticos monomodo OS2 Gigabit de alto rendimento", icon: <Zap className="w-4 h-4 text-white" />, section: "servicos" },
    { title: "Ativos de Rede PoE+ & Wi-Fi 6", desc: "Switches gerenciáveis, APs UniFi e Firewalls Fortinet", icon: <Wifi className="w-4 h-4 text-white" />, section: "orcador" },
    { title: "Armários e Racks Padrão TIA", desc: "Racks de 19 polegadas de alta densidade e organizadores", icon: <Server className="w-4 h-4 text-white" />, section: "orcador" },
    { title: "Certificação Fluke DSX-8000", desc: "Laudos técnicos oficiais emitidos com selo de aprovação", icon: <ShieldCheck className="w-4 h-4 text-white" />, section: "servicos" },
  ];

  const dropdownSolutions = [
    { title: "Governo & Setor Público", desc: "Redes integradas de alta segurança para autarquias e secretarias", icon: <BadgeCheck className="w-4 h-4 text-white" />, section: "empresa" },
    { title: "Ambiente Clínico & Hospitalar", desc: "Cabeamento blindado livre de interferência para diagnóstico", icon: <Activity className="w-4 h-4 text-white" />, section: "servicos" },
    { title: "Bancos & Matrizes Digitais", desc: "Taxas estáveis de transmissão de dados para ERPs e finanças", icon: <Award className="w-4 h-4 text-white" />, section: "orcador" },
    { title: "Site Survey Regional Amapá", desc: "Vistoria e mapeamento de rotas de cabos nas cidades do Estado", icon: <Layers className="w-4 h-4 text-white" />, section: "contato" },
  ];

  const dropdownResources = [
    { title: "Normas Técnicas ABNT", desc: "Conformidade estrita ABNT NBR 14565 e regulamentos locais", icon: <FileText className="w-4 h-4 text-white" />, section: "empresa" },
    { title: "Templates de Referência", desc: "Presets e projetos do carrossel prontos para carga", icon: <CheckCircle2 className="w-4 h-4 text-white" />, section: "galeria-templates" },
    { title: "Simulador de Orçamentos", desc: "Cálculo instantâneo estruturado de insumos reais em R$", icon: <Brain className="w-4 h-4 text-white" />, section: "orcador" },
    { title: "Manuais Técnicos P2P", desc: "Diretrizes contra atenuação de sinal e perda por curvatura", icon: <GraduationCap className="w-4 h-4 text-white" />, section: "servicos" },
  ];

  return (
    <div className={`min-h-screen bg-[#030303] text-zinc-300 flex flex-col font-sans select-none antialiased selection:bg-white selection:text-black ${
      isExploded && explosionState === 'detonated' ? "animate-shake" : ""
    }`}>
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(39,39,42,0.18),transparent_100%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0 opacity-70" />

      {/* STICKY TOP NAVBAR (SQUARESPACE PREMIUM BRAND LAYOUT) */}
      <header style={getExplosionStyle(8)} className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""} ${
        scrolled ? "bg-black/95 border-b border-zinc-900 shadow-xl" : "bg-black border-b border-zinc-950"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between">
          
          {/* Brand Logo & Name (SQUARESPACE BRAND DESIGN WITH DYNAMIC LOGO FILE DETECTOR) */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0 relative py-1.5"
          >
            {!logoError ? (
              <img 
                src="/brand-logo.png" 
                onError={() => setLogoError(true)} 
                className="h-9 sm:h-11 w-auto object-contain shrink-0 max-w-[130px] transition group-hover:opacity-85" 
                alt="Logo P2P" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg className="w-8 h-8 text-white transition-opacity duration-300 group-hover:opacity-85 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 35.5C12.5 35.5 17 31 19.5 28.5C22 26 23.5 25.5 25.5 27C27.5 28.5 28.5 30.5 31 33C33.5 35.5 37 38 41.5 36C46 34 46.5 28.5 44 24.5C41.5 20.5 34.5 13 34.5 13L30 17.5L32.5 20C35 22.5 36.5 23 35.5 24.5C34.5 26 32.5 27.5 30.5 25.5C28.5 23.5 24.5 19 21.5 16.5C18.5 14 13 11 9.5 15C6 19 5.5 24.5 8 28.5C10.5 32.5 12.5 35.5 12.5 35.5Z" fill="currentColor"/>
                <path d="M35.5 12.5C35.5 12.5 31 17 28.5 19.5C26 22 25.5 23.5 27 25.5C28.5 27.5 30.5 28.5 33 31C35.5 33.5 38 37 36 41.5C34 46 28.5 46.5 24.5 44C20.5 41.5 13 34.5 13 34.5L17.5 30L20 32.5C22.5 35 23 36.5 24.5 35.5C26 34.5 27.5 32.5 25.5 30.5C23.5 28.5 19 24.5 16.5 21.5C14 18.5 11 13 15 9.5C19 6 24.5 5.5 28.5 8C32.5 10.5 35.5 12.5 35.5 12.5Z" fill="currentColor"/>
              </svg>
            )}
            <span className="text-base font-sans tracking-[0.2em] font-black text-white uppercase select-none">
              P2P CABEAMENTO ESTRUTURADO
            </span>
          </div>

          {/* Interactive Squarespace Hover Dropdown Menus */}
          <nav className="hidden lg:flex items-center gap-12 select-none">
            
            {/* Products (Produtos) */}
            <div className="relative group py-4">
              <button className="text-[11px] uppercase tracking-[0.14em] text-zinc-200 hover:text-white flex items-center gap-1.5 font-bold font-sans transition-colors duration-200 cursor-pointer">
                <span>Produtos</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 transition-transform duration-250 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-80 bg-[#09090b] border border-zinc-900 rounded-none p-4 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible flex flex-col gap-1.5 z-50">
                <div className="px-2 py-1.5 border-b border-zinc-900 mb-1 leading-none">
                  <span className="text-[9px] font-sans text-zinc-500 font-extrabold uppercase tracking-widest">Catálogo Operacional</span>
                </div>
                {dropdownProducts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(p.section)}
                    className="flex items-start gap-3 p-2 rounded-none hover:bg-zinc-900/60 transition text-left cursor-pointer border-0 bg-transparent w-full"
                  >
                    <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-none shrink-0 text-white">
                      {p.icon}
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-white font-sans uppercase tracking-wider">{p.title}</h5>
                      <p className="text-[10px] text-zinc-450 leading-normal font-sans text-left mt-0.5">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Solutions (Soluções) */}
            <div className="relative group py-4">
              <button className="text-[11px] uppercase tracking-[0.14em] text-zinc-200 hover:text-white flex items-center gap-1.5 font-bold font-sans transition-colors duration-200 cursor-pointer">
                <span>Soluções</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 transition-transform duration-250 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-80 bg-[#09090b] border border-zinc-900 rounded-none p-4 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible flex flex-col gap-1.5 z-50">
                <div className="px-2 py-1.5 border-b border-zinc-900 mb-1 leading-none">
                  <span className="text-[9px] font-sans text-zinc-500 font-extrabold uppercase tracking-widest">Aplicações Reais</span>
                </div>
                {dropdownSolutions.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToSection(p.section)}
                    className="flex items-start gap-3 p-2 rounded-none hover:bg-zinc-900/60 transition text-left cursor-pointer border-0 bg-transparent w-full"
                  >
                    <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-none shrink-0 text-white">
                      {p.icon}
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-white font-sans uppercase tracking-wider">{p.title}</h5>
                      <p className="text-[10px] text-zinc-450 leading-normal font-sans text-left mt-0.5">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Resources (Recursos) */}
            <div className="relative group py-4">
              <button className="text-[11px] uppercase tracking-[0.14em] text-zinc-200 hover:text-white flex items-center gap-1.5 font-bold font-sans transition-colors duration-200 cursor-pointer">
                <span>Recursos</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 transition-transform duration-250 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-80 bg-[#09090b] border border-zinc-900 rounded-none p-4 shadow-2xl transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible flex flex-col gap-1.5 z-50">
                <div className="px-2 py-1.5 border-b border-zinc-900 mb-1 leading-none">
                  <span className="text-[9px] font-sans text-zinc-500 font-extrabold uppercase tracking-widest">Instrumentação & Auxílio</span>
                </div>
                {dropdownResources.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (p.section === "galeria-templates") {
                        const el = document.getElementById("galeria-templates");
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      } else {
                        scrollToSection(p.section);
                      }
                    }}
                    className="flex items-start gap-3 p-2 rounded-none hover:bg-zinc-900/60 transition text-left cursor-pointer border-0 bg-transparent w-full"
                  >
                    <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-none shrink-0 text-white">
                      {p.icon}
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-white font-sans uppercase tracking-wider">{p.title}</h5>
                      <p className="text-[10px] text-zinc-450 leading-normal font-sans text-left mt-0.5">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </nav>

          {/* Action and Login Options (Squarespace layout matching: FAZER LOGIN / COMECE AGORA) */}
          <div className="hidden lg:flex items-center gap-10 select-none shrink-0">
            <button
              onClick={() => {
                setLoginModalOpen(true);
                setSuccessMsg("");
              }}
              className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-white hover:opacity-85 transition duration-200 cursor-pointer"
            >
              {isLoggedIn ? `Membro: ${clientName.split(' ')[0]}` : "Fazer Login"}
            </button>
            
            <button
              onClick={() => {
                const el = document.getElementById("galeria-templates");
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="bg-white text-black hover:bg-zinc-200 transition-all duration-200 text-[11px] font-sans font-bold uppercase tracking-[0.16em] py-3.5 px-8 rounded-none cursor-pointer border border-white"
            >
              Comece Agora
            </button>
          </div>

          {/* Mobile menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition cursor-pointer"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-[#08080a]/95 border-b border-zinc-900 py-6 px-6 fixed top-20 z-40 overflow-hidden backdrop-blur"
          >
            <div className="flex flex-col gap-3 font-mono select-none">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full py-2 px-3 text-left text-[11px] uppercase tracking-widest transition-all ${
                    activeSection === item.id
                      ? "text-white font-bold border-l-2 border-white pl-3 bg-zinc-900/50"
                      : "text-zinc-400 hover:text-white pl-3 border-l-2 border-transparent"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="h-px bg-zinc-900 my-2" />
              
              <div className="flex flex-col gap-2.5 px-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full py-3 bg-zinc-900 text-white text-center font-bold text-[10px] uppercase tracking-widest rounded border border-zinc-805"
                >
                  {isLoggedIn ? "Acessar Portal do Cliente" : "Fazer Login"}
                </button>
                <button
                  onClick={() => scrollToSection("orcador")}
                  className="w-full py-3 bg-white text-black text-center font-black text-[10px] uppercase tracking-widest rounded-none"
                >
                  Comece Agora
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT FLOATING SIDEBAR INDEX */}
      <div 
        className={`fixed top-1/2 -translate-y-1/2 z-35 hidden xl:flex flex-col transition-all duration-300 ease-in-out ${
          sidebarExpanded 
            ? "left-5 bg-[#08080a]/85 backdrop-blur border border-zinc-900 p-4 w-38 shadow-2xl rounded-none animate-fade-in" 
            : "left-2 bg-[#08080a]/90 backdrop-blur border border-zinc-900 p-2 w-9 h-32 shadow-2xl rounded-none items-center justify-center group"
        }`}
      >
        {sidebarExpanded ? (
          <>
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 gap-1.5 w-full">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setSidebarExpanded(false)}
                  className="p-0.5 hover:bg-zinc-900 text-zinc-400 hover:text-white transition cursor-pointer flex items-center justify-center border-0 bg-transparent rounded-none"
                  title="Minimizar Menu"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-white" />
                </button>
                <span className="text-[10px] font-sans text-zinc-400 uppercase tracking-[0.14em] font-extrabold block selection:bg-transparent">
                  MENU
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3.5 pt-2.5 w-full">
              {menuItems.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      scrollToSection(item.id);
                      setSidebarExpanded(false);
                    }}
                    className="group/item flex items-center gap-2.5 text-left focus:outline-none bg-transparent border-0 p-0 cursor-pointer w-full"
                  >
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className={`w-1.5 h-1.5 rounded-full border transition-all duration-300 ${
                        isActive ? "bg-white border-white scale-125" : "bg-transparent border-zinc-700 group-hover/item:border-zinc-500"
                      }`} />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className={`text-[9px] font-mono uppercase tracking-wider leading-none transition-all ${
                        isActive ? "text-white font-bold" : "text-zinc-500 group-hover/item:text-zinc-350"
                      }`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-[9.5px] font-sans font-bold uppercase tracking-wider transition-all truncate ${
                        isActive ? "text-zinc-200" : "text-zinc-500 group-hover/item:text-zinc-350"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <button 
            onClick={() => setSidebarExpanded(true)}
            className="flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-white cursor-pointer w-full h-full border-0 bg-transparent py-2"
            title="Expandir Menu"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition duration-200" />
            <div className="text-[7.5px] font-sans font-black uppercase tracking-[0.18em] select-none text-zinc-500 group-hover:text-zinc-300 transition duration-200 mt-1 flex flex-col items-center leading-[1.3]">
              <span>M</span>
              <span>E</span>
              <span>N</span>
              <span>U</span>
            </div>
          </button>
        )}
      </div>


      {/* CONTINUOUS SCROLL MAIN BODY */}
      <main className="flex-1 relative z-10 w-full overflow-hidden">
        
        {/* SECTION 1: HERO / INTRO */}
        <section id="inicio" style={getExplosionStyle(0)} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 border-b border-zinc-900 relative ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Intro Details with Staggered Load Entrance */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="lg:col-span-12 xl:col-span-8 space-y-8 text-center lg:text-left"
            >
              <div className="space-y-6">
                <span className="text-xs font-sans text-zinc-450 uppercase tracking-[0.22em] font-extrabold block">
                  CABEAMENTO ESTRUTURADO PROFISSIONAL
                </span>
                <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black tracking-[-0.03em] text-white leading-[1.05] uppercase">
                  CRIE SEU<br />
                  <span className="block mt-2 text-center lg:text-left min-h-[1.35em] pb-3 pt-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPhraseIdx}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="block w-full font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 pr-4 pb-1"
                      >
                        {heroPhrases[currentPhraseIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h2>
              </div>

              <div className="space-y-6">
                <p id="introduction-main" className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
                  A <strong className="text-white font-black uppercase">P2P Cabeamento Estruturado</strong> projeta redes críticas sob estrito rigor regulatório nacional. Unificamos a excelência de engenharia física às normas técnicas vigentes no país, garantindo infraestrutura livre de latência e atenuações.
                </p>

                {/* Brazilian Standards Grid Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-2xl pt-2">
                  <div className="bg-[#09090b] border border-zinc-900 p-4 hover:border-zinc-800 transition-all duration-300 text-left group">
                    <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900 pb-2">
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full group-hover:scale-130 transition-transform duration-300" />
                      <span className="font-mono text-xs font-black text-white uppercase tracking-wider">NBR 14565</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-sans group-hover:text-zinc-400 transition-colors">
                      Regulamenta o dimensionamento dos caminhos, espaços de telecom, e canais de par trançado e fibra em edifícios comerciais.
                    </p>
                  </div>

                  <div className="bg-[#09090b] border border-zinc-900 p-4 hover:border-zinc-800 transition-all duration-300 text-left group">
                    <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900 pb-2">
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full group-hover:scale-130 transition-transform duration-300" />
                      <span className="font-mono text-xs font-black text-white uppercase tracking-wider">NBR 5410</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-sans group-hover:text-zinc-400 transition-colors">
                      Garante aterramento de chassi e equipotencialidade para racks CPD, protegendo ativos de TI contra descargas e surtos de tensão.
                    </p>
                  </div>

                  <div className="bg-[#09090b] border border-zinc-900 p-4 hover:border-zinc-800 transition-all duration-300 text-left group">
                    <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900 pb-2">
                      <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full group-hover:scale-130 transition-transform duration-300" />
                      <span className="font-mono text-xs font-black text-white uppercase tracking-wider">NBR 16869</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-sans group-hover:text-zinc-400 transition-colors">
                      Regula ensaios de atenuação, perdas ópticas e parâmetros de transmissão, emitidos sob relatórios nominais de Fluke DSX.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 pt-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const el = document.getElementById("galeria-templates");
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="px-10 py-4.5 bg-white text-black font-black text-xs tracking-[0.18em] transition uppercase shadow-2xl flex items-center justify-center gap-3 cursor-pointer rounded-none border border-white"
                >
                  COMECE AGORA
                  <ArrowRight className="w-4 h-4 text-black" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection("sustentabilidade")}
                  className="px-10 py-4.5 bg-transparent border border-white font-black text-xs tracking-[0.18em] transition uppercase flex items-center justify-center gap-2.5 cursor-pointer text-white shadow-sm hover:bg-white/10 rounded-none"
                >
                  COMPROMISSO VERDE
                </motion.button>
              </div>

              {/* Standards Tags */}
              <div className="pt-6 border-t border-zinc-900/60 max-w-lg mx-auto lg:mx-0 flex justify-between items-center text-[10px] font-sans text-zinc-500 uppercase tracking-widest font-extrabold">
                <span className="flex items-center gap-2 hover:text-white transition cursor-default"><ShieldCheck className="w-4 h-4 text-emerald-400" /> ANSI/TIA-568.2-D</span>
                <span className="flex items-center gap-2 hover:text-white transition cursor-default"><ShieldCheck className="w-4 h-4 text-emerald-400" /> ISO/IEC 11801</span>
                <span className="flex items-center gap-2 hover:text-white transition cursor-default"><ShieldCheck className="w-4 h-4 text-emerald-400" /> EIA/ECA-310-E</span>
              </div>
            </motion.div>

            {/* Engineering Schematic Highlight Card with Mount Animation */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="lg:col-span-12 xl:col-span-4 relative"
            >
              <AiCopilot />
            </motion.div>

          </div>

          {/* Scrolling Micro Indicator (Squarespace elegance style) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono uppercase text-[#88888e] tracking-widest">Scroll to Explore</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-6 bg-zinc-800 rounded-full flex justify-center items-start p-0.5"
            >
              <div className="w-1 h-2 bg-zinc-400 rounded-full" />
            </motion.div>
          </div>
        </section>

        {/* SECTION 1.5: TEMPLATES CAROUSEL (SQUARESPACE VISUAL GALLERY) */}
        <section id="galeria-templates" style={getExplosionStyle(1)} className={`bg-[#030303] border-b border-zinc-900 py-24 relative z-20 ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TemplateCarousel onSelectTemplate={handleSelectTemplate} />
          </div>
        </section>

        {/* SECTION 2: A EMPRESA (COMPANY PROFILE & PHILOSOPHY) */}
        <motion.section 
          id="empresa" 
          style={getExplosionStyle(2)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-[#050507] border-y border-zinc-900 py-24 relative overflow-hidden ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}
        >
          {/* Subtle tech background line decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-35" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
            
            {/* Header Section */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-mono text-zinc-500 font-extrabold uppercase tracking-[0.25em] block">
                CONHEÇA NOSSA ENGENHARIA
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight leading-none">
                P2P Cabeamento Estruturado
              </h3>
              <div className="w-16 h-0.5 bg-white mx-auto my-4" />
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                Nascemos do inconformismo com instalações amadoras de rede. Nossa missão é entregar a integridade física perfeita que as camadas lógicas de software exigem para performar com latência zero.
              </p>
            </div>

            {/* Story & Technical Pitch Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-6 flex flex-col">
                <div className="bg-[#09090b] border border-zinc-900 p-8 rounded-none space-y-6 relative shadow-xl hover:border-zinc-800 transition-colors duration-300">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-zinc-950 text-white rounded-none border border-zinc-900">
                        <FileText className="w-4.5 h-4.5 text-zinc-300" />
                      </div>
                      <h4 className="text-xs font-black font-mono text-white uppercase tracking-widest">Nossa Fundação</h4>
                    </div>
                    <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-2 py-1 uppercase tracking-wider font-bold border border-zinc-800">EST. Amapá</span>
                  </div>
                  
                  <div className="space-y-4 text-zinc-400 text-xs md:text-sm leading-relaxed">
                    <p className="text-justify font-sans">
                      A P2P foi idealizada por especialistas de alta qualificação em <strong className="text-white font-bold font-sans">Infraestrutura Física e Engenharia de Computadores</strong>. Observando as deficiências locais onde instalações sofrem com umidade equatorial, maresia, interferências de rede de alta tensão e aterramento precário, unificamos soluções de engenharia física para oferecer segurança garantida.
                    </p>
                    <p className="text-justify font-sans">
                      Nossa metodologia consiste na elaboração de projetos tridimensionais, mapeamento de percursos de dutos sob as diretrizes do padrão nacional <strong className="text-zinc-300 font-mono font-bold">ABNT NBR 14565 (Mapeamento Física e Espaços)</strong>, montagem profissional de Racks metálicos com aterramento estruturado (<strong className="text-zinc-300 font-mono font-bold">ABNT NBR 5410</strong>) e documentação completa de portas e tomadas segundo referências de identificação técnica.
                    </p>
                  </div>

                  {/* Operational Quality Assurance Badge */}
                  <div className="bg-[#050507] p-3 text-[10px] font-mono text-zinc-500 border border-zinc-950 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ART (Anotação de Responsabilidade Técnica) incluise em todos os projetos.</span>
                  </div>
                </div>

                {/* Values Checklist with custom interactive bounce */}
                <div className="grid grid-cols-2 gap-4 font-sans">
                  <motion.div 
                    whileHover={{ y: -3, borderColor: '#3f3f46' }}
                    className="p-5 bg-zinc-950 border border-zinc-900 rounded-none space-y-2 cursor-default transition-all shadow-md group animate-fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      <p className="text-white font-mono text-xs uppercase font-extrabold tracking-wider">RIGOR TÉCNICO</p>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-normal group-hover:text-zinc-400 transition-colors">
                      Mapeamento precise e conectorização Keystone RJ-45 Cat6A blindada em 100% dos canais.
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -3, borderColor: '#3f3f46' }}
                    className="p-5 bg-zinc-950 border border-zinc-900 rounded-none space-y-2 cursor-default transition-all shadow-md group animate-fade-in"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <p className="text-white font-mono text-xs uppercase font-extrabold tracking-wider">ISOLAMENTO</p>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed font-normal group-hover:text-zinc-400 transition-colors">
                      Fibras monomodo dielétricas evitam queimas de ativos decorrentes de indução estática industrial.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Strict Executive Comparison Table ("Something Serious") */}
              <div className="bg-[#09090b] border border-zinc-900 p-8 rounded-none space-y-6 flex flex-col shadow-xl relative hover:border-zinc-800 transition-colors duration-300">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4.5 h-4.5 text-white" />
                      <span className="text-xs font-mono font-black text-white uppercase tracking-wider">Comparações Técnicas de Engenharia</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 border border-emerald-950/50 bg-emerald-950/20 px-2 py-0.5 uppercase tracking-wide font-bold">100% Homologado</span>
                  </div>

                  <h1 id="comparison-title-animate-fade-in" className="hidden">Comparativo P2P</h1>
                  <h4 className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                    Instalações Comuns de Mercado vs. Cabeamento Corporativo P2P
                  </h4>
                  
                  <div className="space-y-4 pt-2">
                    
                    {/* Parameter 1 */}
                    <div className="border border-zinc-900 bg-zinc-950/40 p-3.5 space-y-3 hover:bg-zinc-950/80 transition-colors">
                      <div className="flex justify-between items-center text-xs font-bold text-white border-b border-zinc-900 pb-1.5">
                        <span className="font-sans font-extrabold uppercase tracking-wide text-zinc-300">Blindagem de Dados</span>
                        <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Cat6A F/UTP</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[10px] leading-relaxed">
                        <div className="space-y-1 pr-2">
                          <span className="text-red-400 font-mono font-bold uppercase tracking-wider block">⚡ Comum (Vulnerável)</span>
                          <p className="text-zinc-500 text-[10.5px]">Cabos Cat5e s/ blindagem, suscetíveis a ruídos eletromagnéticos de reatores e infraestruturas.</p>
                        </div>
                        <div className="space-y-1 pl-0 md:pl-3 border-t md:border-t-0 md:border-l border-zinc-900 pt-2 md:pt-0">
                          <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block">🛡️ Padrão P2P (Blindado)</span>
                          <p className="text-zinc-350 text-[10.5px]">Cabos com blindagem de fita de alumínio-poliéster garantindo imunidade total a Crosstalk.</p>
                        </div>
                      </div>
                    </div>

                    {/* Parameter 2 */}
                    <div className="border border-zinc-900 bg-zinc-950/40 p-3.5 space-y-3 hover:bg-zinc-950/80 transition-colors">
                      <div className="flex justify-between items-center text-xs font-bold text-white border-b border-zinc-900 pb-1.5">
                        <span className="font-sans font-extrabold uppercase tracking-wide text-zinc-300">Conexão Interpredial</span>
                        <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Fibra OS2</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[10px] leading-relaxed">
                        <div className="space-y-1 pr-2">
                          <span className="text-red-400 font-mono font-bold uppercase tracking-wider block">⛈️ Comum (Risco Físico)</span>
                          <p className="text-zinc-500 text-[10.5px]">Cabo de cobre aéreo suscetível a descarga elétrica atmosférica e danos irreparáveis aos racks ativos.</p>
                        </div>
                        <div className="space-y-1 pl-0 md:pl-3 border-t md:border-t-0 md:border-l border-zinc-900 pt-2 md:pt-0">
                          <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block">💎 Padrão P2P (Óptico)</span>
                          <p className="text-zinc-350 text-[10.5px]">Links subterrâneos blindados em fibra dielétrica de alta durabilidade com isolamento condutivo perfeito.</p>
                        </div>
                      </div>
                    </div>

                    {/* Parameter 3 */}
                    <div className="border border-zinc-900 bg-zinc-950/40 p-3.5 space-y-3 hover:bg-zinc-950/80 transition-colors">
                      <div className="flex justify-between items-center text-xs font-bold text-white border-b border-zinc-900 pb-1.5">
                        <span className="font-sans font-extrabold uppercase tracking-wide text-zinc-300">Certificação Oficial</span>
                        <span className="text-[9px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Fluke DSX-8000</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[10px] leading-relaxed">
                        <div className="space-y-1 pr-2">
                          <span className="text-red-400 font-mono font-bold uppercase tracking-wider block">📊 Comum (Inseguro)</span>
                          <p className="text-zinc-500 text-[10.5px]">Teste rudimentar de continuidade elétrica (fios conectados) sem avaliar perdas ópticas ou atenuação real.</p>
                        </div>
                        <div className="space-y-1 pl-0 md:pl-3 border-t md:border-t-0 md:border-l border-zinc-900 pt-2 md:pt-0">
                          <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block">📈 Padrão P2P (Validado)</span>
                          <p className="text-zinc-350 text-[10.5px]">Laudo profissional Fluke completo gerado canal por canal, com certificação nominal de 10Gbps.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="bg-[#050507] p-4 text-[10.5px] font-sans text-zinc-500 leading-normal border border-zinc-950">
                  <strong className="text-white font-mono font-black mr-1 uppercase">SISTEMA ERP & IMAGEM:</strong> Nosso cabeamento previne qualquer afunilamento de banda física, fornecendo taxas brutas estáveis e livres de Crosstalk para faturamento expresso diário e visualização de arquivos PACS pesados.
                </div>
              </div>

            </div>

          </div>
        </motion.section>

        {/* SECTION 2.5: SUSTENTABILIDADE & ECO-RENTABILIDADE */}
        <motion.section 
          id="sustentabilidade" 
          style={getExplosionStyle(3)}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-[#030305] border-b border-zinc-900 py-24 relative overflow-hidden animate-fade-in ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}
        >
          {/* Decorative faint glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
            
            {/* Section Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-mono text-emerald-400 font-extrabold uppercase tracking-[0.25em] flex items-center justify-center gap-2">
                <Leaf className="w-3.5 h-3.5 animate-pulse" /> COMPROMISSO ECO-RENTÁVEL
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight leading-none bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Sustentabilidade de Redes
              </h3>
              <div className="w-16 h-0.5 bg-emerald-500 mx-auto my-4" />
              <div className="border border-emerald-950/40 bg-emerald-950/10 p-5 max-w-2xl mx-auto backdrop-blur-sm">
                <p className="text-emerald-400 italic font-medium text-sm md:text-base leading-relaxed">
                  "Ajudamos a tornar o seu sonho realidade sem prejudicar o meio ambiente."
                </p>
              </div>
              <p className="text-zinc-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                Na <span className="text-white font-bold">P2P Cabeamento Estruturado</span>, acreditamos que engenharia física de elite rima com responsabilidade socioambiental. Nossos projetos aliam alta rentabilidade técnica a práticas ecológicas e de logística reversa que geram economia real e reduzem o lixo tecnológico.
              </p>
            </div>

            {/* Premium Material Recyclability Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Copper */}
              <motion.div 
                whileHover={{ y: -5, borderColor: '#10b981' }}
                className="bg-[#09090b] border border-zinc-900 p-6 flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                    <div className="p-2.5 bg-zinc-950 text-amber-500 border border-zinc-900 group-hover:bg-amber-500/10 transition-colors">
                      <Coins className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Insumo Reciclável</span>
                  </div>
                  <h4 className="text-sm font-black font-mono text-white uppercase tracking-wider">Cobre Comercial Puro</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    Sobras de cabos Cat6A e fiações de metal retiradas de obras antigas não vão para descarte geral. O cobre eletrolítico puro é refinado sem perda de integridade mecânica ou características físicas elétricas, recuperando cerca de 85% da energia de mineração.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-900/40 text-[10px] font-mono text-amber-500 flex justify-between">
                  <span>Valor de Sucata</span>
                  <span className="font-bold">Retorno de R$ / KG</span>
                </div>
              </motion.div>

              {/* Card 2: Aluminum */}
              <motion.div 
                whileHover={{ y: -5, borderColor: '#10b981' }}
                className="bg-[#09090b] border border-zinc-900 p-6 flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                    <div className="p-2.5 bg-zinc-950 text-zinc-350 border border-zinc-900 group-hover:bg-zinc-300/10 transition-colors">
                      <Recycle className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Estrutura 100% Circular</span>
                  </div>
                  <h4 className="text-sm font-black font-mono text-white uppercase tracking-wider">Alumínio de Racks 19"</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    Nossos racks de servidores, guias de cabos e calhas metálicas suspensas usam alumínio estrutural extrudado de excelente qualidade. Por ser infinitamente reciclável, o metal atua como ativo financeiro sólido ao fim do ciclo útil dos data centers corporativos.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-900/40 text-[10px] font-mono text-zinc-400 flex justify-between">
                  <span>Vida Útil Metal</span>
                  <span className="font-bold">Ciclo Infinito</span>
                </div>
              </motion.div>

              {/* Card 3: LSZH */}
              <motion.div 
                whileHover={{ y: -5, borderColor: '#10b981' }}
                className="bg-[#09090b] border border-zinc-900 p-6 flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                    <div className="p-2.5 bg-zinc-950 text-emerald-400 border border-zinc-900 group-hover:bg-emerald-400/10 transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Termoplásticos Verdes</span>
                  </div>
                  <h4 className="text-sm font-black font-mono text-white uppercase tracking-wider">Jaquetas de cabo LSZH</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    Diferente de cabos comuns de PVC (que soltam cloro venenoso em chamas), os cabos LSZH Furukawa utilizam aditivos minerais naturais inertes para retardar centelhas. Seus polímeros limpos reciclados são transformados de forma segura em insumos industriais diversos.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-900/40 text-[10px] font-mono text-emerald-400 flex justify-between">
                  <span>Isento de Halogênios</span>
                  <span className="font-bold">Zero Toxicidade</span>
                </div>
              </motion.div>

              {/* Card 4: Green Cabling reverse logistics */}
              <motion.div 
                whileHover={{ y: -5, borderColor: '#10b981' }}
                className="bg-[#09090b] border border-zinc-900 p-6 flex flex-col justify-between transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                    <div className="p-2.5 bg-zinc-950 text-cyan-400 border border-zinc-900 group-hover:bg-cyan-400/10 transition-colors">
                      <Cable className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Parcerias Inteligentes</span>
                  </div>
                  <h4 className="text-sm font-black font-mono text-white uppercase tracking-wider">Programa Green Cabling</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                    Através da nossa cadeia logística integrada, participamos do programa oficial Furukawa Green Cabling. O cabeamento antigo desativado do cliente é refinado de forma certificada, gerando **descontos diretos e créditos** para aquisição de novos ativos sofisticados na obra.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-zinc-900/40 text-[10px] font-mono text-cyan-400 flex justify-between">
                  <span>Logística Reversa</span>
                  <span className="font-bold">Até 15% Desconto</span>
                </div>
              </motion.div>

            </div>

            {/* Quick Rentability Info Stripe */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-left">
                <div className="hidden sm:flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
                  <Leaf className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-mono text-xs font-black text-white uppercase tracking-wider">Como calculamos seu Retorno de Rentabilidade Ecológica?</h5>
                  <p className="text-[11px] text-zinc-500 max-w-2xl leading-normal">
                    Cada tonelada de cabo reciclada no Furukawa Green Cabling evita a mineração de novos metais pesados e emite créditos de carbono. Revertemos as vistorias técnicas e laudos periciais de descarte de sua fiação offline antiga diretamente em abatimentos nas faturas do CREA e em materiais novos.
                  </p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById("orcador");
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="w-full lg:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-[10px] uppercase font-bold tracking-widest cursor-pointer border border-zinc-800 transition"
              >
                Estimar Retorno no Simulador
              </motion.button>
            </div>

          </div>
        </motion.section>

        {/* SECTION 4: SERVIÇOS (PROFESSIONAL SERVICES) */}
        <motion.section 
          id="servicos" 
          style={getExplosionStyle(4)}
          initial={{ opacity: 0, y: 55 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-[#050507] border-y border-zinc-900 py-24 relative ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center flex flex-col items-center max-w-3xl mx-auto">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block font-bold text-center">
                MÃO DE OBRA, PADRÕES E SERVIÇOS
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-black text-white uppercase mt-2 tracking-tight leading-none text-center">
                Serviços de Engenharia de Rede
              </h3>
              <div className="w-16 h-0.5 bg-zinc-600 my-4" />
              <p className="text-zinc-400 text-sm max-w-2xl text-center mx-auto leading-relaxed">
                Do planejamento civil de dutos subterrâneos à fusão óptica e certificadora final do CPD. Oferecemos soluções físicas e lógicas em conformidade estrita com as normas da ABNT NBR 14565 e referências ANSI/TIA para eliminar atenuações de link.
              </p>
            </div>

            <ServicesPanel />
          </div>
        </motion.section>

        <motion.section 
          id="orcador" 
          style={getExplosionStyle(5)}
          initial={{ opacity: 0, y: 55 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12 ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}
        >
          <div className="border-b border-zinc-900 pb-5 text-center flex flex-col items-center max-w-3xl mx-auto">
            <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest block font-bold text-center">
              SIMULADOR DE INVESTIMENTO EXECUTIVO
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase mt-2 tracking-tight leading-none text-center">
              Orçamento de Rede & Insumos em Tempo Real
            </h3>
            <div className="w-12 h-0.5 bg-zinc-700 my-4" />
            <p className="text-zinc-400 text-sm max-w-2xl font-sans text-center mx-auto">
              Selecione os equipamentos ativos e passivos, ajuste os serviços de fusão e certidões e obtenha estimativas completas de materiais com margens competentes e detalhamento em R$ para o Amapá.
            </p>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl">
            <BudgetCalculator students={students} activeTemplate={activeTemplate} />
          </div>
        </motion.section>

        {/* SECTION 6: EQUIPE (TECHNICAL ENGINEERING STAFF) */}
        <motion.section 
          id="equipe" 
          style={getExplosionStyle(6)}
          initial={{ opacity: 0, y: 55 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`bg-[#050507] border-y border-zinc-900 py-24 relative ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center flex flex-col items-center max-w-3xl mx-auto">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block font-bold text-center">
                ENGENHARIA E OPERAÇÃO
              </span>
              <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase mt-2 tracking-tight leading-none text-center">
                Equipe de Especialistas & Desenvolvimento
              </h3>
              <div className="w-12 h-0.5 bg-zinc-700 my-4" />
              <p className="text-zinc-400 text-sm max-w-2xl text-center mx-auto">
                Especialistas de rede certificados em infraestrutura física e topologias de missão crítica.
              </p>
            </div>

            <AcademicSection students={students} setStudents={setStudents} />
          </div>
        </motion.section>

        {/* SECTION 7: CONTATO (PROPOSALS & MESSAGES) */}
        <motion.section 
          id="contato" 
          style={getExplosionStyle(7)}
          initial={{ opacity: 0, y: 55 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12 animate-fade-in relative font-sans ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}
        >
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-zinc-450 uppercase tracking-widest block font-bold">
              CONTATE NOSSOS ESPECIALISTAS
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight leading-none">
              Proposta Técnica & Vistoria
            </h3>
            <p className="text-zinc-400 text-sm mt-3">
              Envie sua especificação técnica ou dúvida de infraestrutura civil para nossa bancada de ensaios e certificações do Amapá.
            </p>
          </div>

          <ContactForm />
        </motion.section>

      </main>

      {/* FOOTER */}
      <footer style={getExplosionStyle(9)} className={`border-t border-zinc-800 bg-zinc-950 py-16 relative z-10 select-none text-zinc-300 ${isExploded && explosionState === 'detonated' ? "float-space-debris" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Branding col */}
            <div className="space-y-4 md:col-span-2 text-center md:text-left font-sans">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-705 transition flex items-center justify-center text-zinc-100 font-display font-extrabold text-sm shadow-sm select-none">
                  P2P
                </div>
                <h4 className="text-xs font-mono font-extrabold text-white uppercase tracking-widest">
                  P2P CABEAMENTO ESTRUTURADO
                </h4>
              </div>
              
              <p className="text-zinc-400 text-xs max-w-sm leading-relaxed mx-auto md:mx-0">
                Soluções físicas sólidas projetadas no polo do Amapá sob os rigores das diretrizes brasileiras ABNT NBR 14565 e NBR 5410 para infraestruturas de alto padrão.
              </p>
              
              <p className="text-[10px] text-zinc-500 font-mono">
                P2P Engenharia Física de Redes.
              </p>
            </div>

            {/* Quick Scroll Links */}
            <div className="text-center md:text-left space-y-4 font-sans">
              <h5 className="text-[10px] font-mono uppercase text-zinc-300 font-bold tracking-widest">
                Seções Administrativas
              </h5>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-medium">
                <button onClick={() => scrollToSection("inicio")} className="hover:text-white transition bg-transparent text-left cursor-pointer p-0 border-0 outline-none w-auto mx-auto md:mx-0 font-semibold">01. Início / Topo</button>
                <button onClick={() => scrollToSection("empresa")} className="hover:text-white transition bg-transparent text-left cursor-pointer p-0 border-0 outline-none w-auto mx-auto md:mx-0 font-semibold">02. A Empresa & História</button>
                <button onClick={() => scrollToSection("sustentabilidade")} className="hover:text-white transition bg-transparent text-left cursor-pointer p-0 border-0 outline-none w-auto mx-auto md:mx-0 font-semibold">03. Compromisso Verde</button>
                <button onClick={() => scrollToSection("orcador")} className="hover:text-white transition bg-transparent text-left cursor-pointer p-0 border-0 outline-none w-auto mx-auto md:mx-0 font-semibold">04. Orçador Interativo</button>
              </div>
            </div>

            {/* Corporate markers */}
            <div className="text-center md:text-left space-y-4 font-sans">
              <div className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-none">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span className="text-[10px] font-mono text-zinc-200 font-semibold">P2P ENGENHARIA</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Cabeamento Estruturado e Fibra Óptica. Macapá / AP - 2026.
              </p>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-zinc-900 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 font-mono">
            <p>© 2026 P2P Cabeamento Estruturado. Todos os direitos reservados.</p>
            <p>Hospedado via Cloud Run • Projetado com Padrões de Qualidade de Rede</p>
          </div>

        </div>
      </footer>

      {/* SHOCKWAVE & BLINDING CHEMICAL FLASH OVERLAY */}
      <AnimatePresence>
        {isExploded && explosionState === 'detonated' && (
          <motion.div 
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: [1, 1, 0], scale: [1, 1.05, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-50 pointer-events-none flex items-center justify-center animate-fade-out"
          >
            {/* expanding radial energy ring */}
            <motion.div 
              initial={{ width: 40, height: 40, borderWidth: 20 }}
              animate={{ width: 1800, height: 1800, borderWidth: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="rounded-full border-amber-500/90 absolute"
            />
            {/* inner neon core */}
            <motion.div 
              initial={{ width: 10, height: 10, scale: 1 }}
              animate={{ width: 1000, height: 1000, scale: 2 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="rounded-full bg-red-500/45 blur-[30px] absolute"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLYING ZERO-G GLOWING COBRES & SOLID FIBERS */}
      <AnimatePresence>
        {isExploded && explosionState === 'detonated' && (
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {/* Fountain from Logo Area */}
            {Array.from({ length: 25 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 150 + Math.random() * 320;
              const delay = Math.random() * 0.35;
              const size = 3 + Math.random() * 6;
              const duration = 2.2 + Math.random() * 2.0;
              const colors = ["bg-emerald-400", "bg-red-400", "bg-orange-500", "bg-yellow-300", "bg-cyan-400"];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={`logo-spk-${i}`}
                  initial={{ 
                    x: "12vw", 
                    y: "10vh", 
                    opacity: 1, 
                    scale: 1 
                  }}
                  animate={{ 
                    x: `calc(12vw + ${Math.cos(angle) * velocity * 2.5}px)`, 
                    y: `calc(10vh + ${Math.sin(angle) * velocity * 2.5}px)`, 
                    opacity: [1, 1, 0.4, 0], 
                    scale: [1, 2.0, 0.5, 0],
                    rotate: Math.random() * 720
                  }}
                  transition={{ 
                    duration: duration, 
                    ease: "easeOut",
                    delay: delay
                  }}
                  className={`absolute rounded-full shadow-[0_0_12px_rgba(255,255,255,0.7)] ${randomColor}`}
                  style={{ 
                    width: size, 
                    height: size,
                  }}
                />
              );
            })}

            {/* Fountain from Center Screen */}
            {Array.from({ length: 30 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const velocity = 200 + Math.random() * 380;
              const delay = Math.random() * 0.4;
              const size = 4 + Math.random() * 8;
              const duration = 2.4 + Math.random() * 2.2;
              const colors = ["bg-emerald-500", "bg-orange-400", "bg-amber-300", "bg-rose-500", "bg-blue-400"];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={`cent-spk-${i}`}
                  initial={{ 
                    x: "50vw", 
                    y: "50vh", 
                    opacity: 1, 
                    scale: 1 
                  }}
                  animate={{ 
                    x: `calc(50vw + ${Math.cos(angle) * velocity * 2.6}px)`, 
                    y: `calc(50vh + ${Math.sin(angle) * velocity * 2.6}px)`, 
                    opacity: [1, 1, 0.3, 0], 
                    scale: [1, 2.5, 0.6, 0],
                    rotate: Math.random() * 540
                  }}
                  transition={{ 
                    duration: duration, 
                    ease: "easeOut",
                    delay: delay
                  }}
                  className={`absolute rounded-none shadow-[0_0_12px_rgba(255,255,255,0.7)] ${randomColor}`}
                  style={{ 
                    width: size, 
                    height: size,
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        clientName={clientName}
        setClientName={setClientName}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        linkThroughput={linkThroughput}
        activePortalTab={activePortalTab}
        setActivePortalTab={setActivePortalTab}
        ticketSubject={ticketSubject}
        setTicketSubject={setTicketSubject}
        ticketSent={ticketSent}
        setTicketSent={setTicketSent}
        onLogout={handleLogout}
      />

    </div>
  );
}
