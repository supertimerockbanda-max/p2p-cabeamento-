/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, 
  Workflow, Database, Building2, ShieldCheck, Cpu, ArrowUpRight
} from 'lucide-react';

export interface TemplateProject {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  colorTheme: {
    bg: string;
    text: string;
    accent: string;
    border: string;
    gradient: string;
  };
  clientType: string;
  nodeCount: number;
  fiberLength: number;
  rackSpecs: string;
  tagline: string;
  features: string[];
  imageUrl: string; // generated beautifully in CSS with elegant network mesh gradients
}

export const TEMPLATES_DATA: TemplateProject[] = [
  {
    id: "tpl-logistica",
    title: "Omega Logistics",
    subtitle: "Centro de Distribuição de Logística",
    badge: "Industrial & EMI-Safe",
    clientType: "Armazém & Escritórios Integrados",
    nodeCount: 24,
    fiberLength: 120,
    rackSpecs: "Rack de Piso TIA-19\" 24U",
    tagline: "Total isolamento eletromagnético contra ruídos de motores e grandes conversores elétricos.",
    features: [
      "Cabeamento 100% Cat6A F/UTP Blindado",
      "Isolador de Surto Óptico no Enlace Exterior",
      "VLANs segregadas para Gestão Operacional"
    ],
    colorTheme: {
      bg: "bg-[#06120e]",
      text: "text-emerald-400",
      accent: "#10b981",
      border: "border-emerald-950/50 hover:border-emerald-500/40",
      gradient: "from-emerald-950/20 via-emerald-900/10 to-transparent"
    },
    imageUrl: "radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 60%)"
  },
  {
    id: "tpl-datacenter",
    title: "Venture Core",
    subtitle: "Datacenter de Operações & CPD",
    badge: "Segurança Tier-1 & CFTV",
    clientType: "Sede de Tecnologia & Operações",
    nodeCount: 32,
    fiberLength: 150,
    rackSpecs: "Rack Fechado de Servidor 42U",
    tagline: "CPD de alta segurança física com monitoramento constante e aterramento estrutural.",
    features: [
      "Acesso Biométrico Bi-Focal",
      "Switches Gerenciáveis L3 Ubiquiti Pro",
      "Nobreak Senoidal com Gerador Auxiliar"
    ],
    colorTheme: {
      bg: "bg-[#08101a]",
      text: "text-blue-400",
      accent: "#3b82f6",
      border: "border-blue-950/50 hover:border-blue-500/40",
      gradient: "from-blue-950/20 via-blue-900/10 to-transparent"
    },
    imageUrl: "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)"
  },
  {
    id: "tpl-campus",
    title: "Amapá Smart Academy",
    subtitle: "Campus de Educação Tecnológica",
    badge: "Alta Densidade & Roaming Wi-Fi 6",
    clientType: "Instituição de Ensino Superior",
    nodeCount: 48,
    fiberLength: 200,
    rackSpecs: "Racks Distribuídos por Bloco 12U",
    tagline: "Roaming ultraveloz sem perdas lógicas para até 300 dispositivos móveis simultâneos.",
    features: [
      "8x Access Points UniFi U6 Lite Integrados",
      "Backbone de Fibra Monomodo OS2 Interno",
      "Filtro de QoS Ativo para Videoconferência"
    ],
    colorTheme: {
      bg: "bg-[#140b18]",
      text: "text-fuchsia-400",
      accent: "#d946ef",
      border: "border-fuchsia-950/50 hover:border-fuchsia-500/40",
      gradient: "from-fuchsia-950/20 via-fuchsia-900/10 to-transparent"
    },
    imageUrl: "radial-gradient(circle at 30% 20%, rgba(217, 70, 239, 0.15) 0%, transparent 60%)"
  },
  {
    id: "tpl-laboratorio",
    title: "Amapá Lab Analytics",
    subtitle: "Laboratório de Ensaios Físicos",
    badge: "Certificação Fluke 100% Green",
    clientType: "Setor de Anitoxidantes & Pesquisas",
    nodeCount: 16,
    fiberLength: 80,
    rackSpecs: "Rack de Parede Compacto TIA 9U",
    tagline: "Laudo emitido por Engenheiro Homologado com margens brutas de diafonia certificadas.",
    features: [
      "Certificação ponto a ponto no Fluke DSX-8000",
      "Conectores Keystone RJ-45 Autodescarregáveis",
      "Isolamento de Duto Subterrâneo PE-AD completo"
    ],
    colorTheme: {
      bg: "bg-[#181307]",
      text: "text-amber-400",
      accent: "#f59e0b",
      border: "border-amber-950/50 hover:border-amber-500/40",
      gradient: "from-amber-950/20 via-amber-900/10 to-transparent"
    },
    imageUrl: "radial-gradient(circle at 30% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 60%)"
  }
];

interface TemplateCarouselProps {
  onSelectTemplate?: (template: TemplateProject) => void;
}

export default function TemplateCarousel({ onSelectTemplate }: TemplateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TEMPLATES_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TEMPLATES_DATA.length) % TEMPLATES_DATA.length);
  };

  const handleApply = (template: TemplateProject) => {
    setSelectedTemplateId(template.id);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
    setTimeout(() => {
      setSelectedTemplateId(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 select-none font-sans" id="galeria-templates">
      
      {/* Description & Navigation Section resembling Squarespace layout */}
      <div className="flex flex-col items-center text-center gap-5 w-full">
        <div className="space-y-2 flex flex-col items-center w-full text-center">
          <span className="text-xs font-sans text-zinc-400 uppercase tracking-[0.22em] font-extrabold block">
            PORTFÓLIO E PRESETS INTEGRADOS
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-black text-white uppercase tracking-tight">
            NOSSOS MODELOS CORPORATIVOS
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
            Escolha uma das topologias de referência com estética e especificações estruturadas prontas para carregar no nosso calculador de orçamento de forma imediata.
          </p>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-2 justify-center mt-2">
          <button 
            onClick={handlePrev}
            className="p-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-805 rounded-none transition duration-200 cursor-pointer"
            aria-label="Template anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-xs font-sans text-zinc-550 font-extrabold px-3 uppercase tracking-widest">
            0{currentIndex + 1} / 0{TEMPLATES_DATA.length}
          </span>

          <button 
            onClick={handleNext}
            className="p-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-805 rounded-none transition duration-200 cursor-pointer"
            aria-label="Próximo template"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slideshow View Area */}
      <div className="relative overflow-hidden rounded-none border border-zinc-900 bg-[#070709] p-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8 items-stretch min-h-[460px]">
          
          {/* Slide Image / Gradient Schematics (5 columns) */}
          <div className="lg:col-span-5 rounded-none border border-zinc-900 p-6 flex flex-col justify-between relative overflow-hidden min-h-[380px] lg:h-auto gap-6"
               style={{ backgroundImage: TEMPLATES_DATA[currentIndex].imageUrl }}>
            {/* Background absolute grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-50" />
            
            <div className="relative z-10 flex justify-between items-start">
              <span className={`text-[10px] font-sans uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-none font-extrabold bg-zinc-950 border border-zinc-900 ${TEMPLATES_DATA[currentIndex].colorTheme.text}`}>
                {TEMPLATES_DATA[currentIndex].badge}
              </span>
              <Workflow className="w-6 h-6 text-zinc-650" />
            </div>

            {/* Simulated interactive physical server component visual */}
            <div className="relative z-10 space-y-3.5 bg-zinc-950/90 backdrop-blur-sm border border-zinc-900 p-4 rounded-none">
              <div className="flex items-center justify-between text-[10px] font-sans text-zinc-500 font-extrabold tracking-wider">
                <span>RACK PORT ASSIGNMENTS</span>
                <span className="animate-pulse text-emerald-500">◆ SYSTEM ACTIVE</span>
              </div>
              
              {/* Row of Ethernet Ports Simulated */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-1.5">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const isActive = i < TEMPLATES_DATA[currentIndex].nodeCount / 2;
                    const isHovered = hoveredPort === i;
                    return (
                      <div 
                        key={i} 
                        onMouseEnter={() => setHoveredPort(i)}
                        onMouseLeave={() => setHoveredPort(null)}
                        className={`h-4 relative rounded-none border transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? isHovered 
                              ? "bg-emerald-400 border-emerald-200 shadow-[0_0_10px_#34d399]" 
                              : "bg-emerald-950/80 border-emerald-800 hover:border-emerald-400" 
                            : isHovered
                              ? "bg-zinc-800 border-zinc-650"
                              : "bg-[#0b0b0e] border-zinc-900"
                        }`} 
                        title={`Porta ${i+1}`}
                      />
                    );
                  })}
                </div>
                {/* Micro tooltip status */}
                <div className="min-h-[14px]">
                  {hoveredPort !== null ? (
                    <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
                      Porta #{hoveredPort + 1}: {hoveredPort < TEMPLATES_DATA[currentIndex].nodeCount / 2 ? "Conectada (VLAN Ativa)" : "Vagarosa (Sem Link)"}
                    </p>
                  ) : (
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
                      Passe o mouse nas portas do switch para testar de modo físico
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-1.5 border-t border-zinc-900">
                <span>Enlace: OS2 Double</span>
                <span>Fração Perda: &lt; 0.08 dB/km</span>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest font-extrabold">TEMPLATE PREVIEW CARD</p>
              <h3 className="text-2xl font-sans font-black text-white uppercase tracking-tight mt-1 leading-none">
                {TEMPLATES_DATA[currentIndex].title}
              </h3>
            </div>
          </div>

          {/* Slide Details Content (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between py-4 pr-0 lg:pr-4">
            
            <div className="space-y-6">
              <div className="space-y-2">
                <span className={`text-xs font-sans font-extrabold uppercase tracking-widest ${TEMPLATES_DATA[currentIndex].colorTheme.text}`}>
                  {TEMPLATES_DATA[currentIndex].subtitle}
                </span>
                <h4 className="text-xl md:text-2xl font-sans font-black text-white uppercase tracking-normal">
                  Projeto Corporativo Homologado
                </h4>
                <p className="text-zinc-200 text-sm italic font-medium mt-1 leading-relaxed">
                  &ldquo;{TEMPLATES_DATA[currentIndex].tagline}&rdquo;
                </p>
              </div>

              {/* Specification stats grid */}
              <div className="grid grid-cols-3 gap-4 border-y border-zinc-900 py-5">
                <div className="space-y-1">
                  <span className="text-[9px] font-sans text-zinc-500 uppercase font-extrabold tracking-wider">Pontos RJ-45 Lan:</span>
                  <p className="text-lg font-bold text-white font-mono">{TEMPLATES_DATA[currentIndex].nodeCount} Pontos</p>
                  <p className="text-[9px] text-zinc-500">Cat6A F/UTP Blindado</p>
                </div>
                
                <div className="space-y-1 border-x border-zinc-900 px-4">
                  <span className="text-[9px] font-sans text-zinc-500 uppercase font-extrabold tracking-wider">Eletroduto PE-AD:</span>
                  <p className="text-lg font-bold text-white font-mono">{TEMPLATES_DATA[currentIndex].fiberLength} m</p>
                  <p className="text-[9px] text-zinc-500">Subterrâneo 1.1/4&quot;</p>
                </div>

                <div className="space-y-1 pl-2">
                  <span className="text-[9px] font-sans text-zinc-500 uppercase font-extrabold tracking-wider">Especificação Rack:</span>
                  <p className="text-sm font-bold text-white font-mono mt-1 capitalize leading-snug truncate">{TEMPLATES_DATA[currentIndex].rackSpecs}</p>
                  <p className="text-[9px] text-zinc-500">TIA-19 polegadas</p>
                </div>
              </div>

              {/* Advantages / Features lists */}
              <div className="space-y-3">
                <span className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest font-extrabold block">
                  REQUISITOS OPERACIONAIS ASSINALADOS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TEMPLATES_DATA[currentIndex].features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons to connect with Simulator & Contact sections */}
            <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={() => handleApply(TEMPLATES_DATA[currentIndex])}
                className={`py-4 px-8 rounded-none text-xs font-black leading-none uppercase tracking-[0.16em] flex items-center gap-2 duration-300 transition-all cursor-pointer w-full sm:w-auto justify-center ${
                  selectedTemplateId === TEMPLATES_DATA[currentIndex].id
                    ? "bg-emerald-700 text-white font-black scale-95"
                    : "bg-white text-black hover:bg-zinc-150 border border-white"
                }`}
              >
                <Cpu className="w-4 h-4" />
                {selectedTemplateId === TEMPLATES_DATA[currentIndex].id 
                  ? "Template Carregado com Sucesso!" 
                  : "Carregar Modelo No Simulador"}
              </button>

              <a
                href="#contato"
                className="py-4 px-8 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-350 rounded-none text-xs font-black leading-none uppercase tracking-[0.16em] flex items-center justify-center gap-1.5 transition duration-200 w-full sm:w-auto"
              >
                <span>Solicitar Proposta Desse Perfil</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Grid of smaller reference template thumbnails below, mimicking Squarespace bento card slides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {TEMPLATES_DATA.map((tpl, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={tpl.id}
              onClick={() => setCurrentIndex(idx)}
              className={`text-left p-4 rounded-none border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[110px] cursor-pointer ${
                isSelected 
                  ? "bg-zinc-950 border-white shadow-lg" 
                  : "bg-[#08080a]/50 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-[8px] font-sans uppercase font-bold tracking-widest px-2 py-0.5 rounded-none border border-zinc-900 ${tpl.colorTheme.text}`}>
                  0{idx + 1}
                </span>
                <span className="text-[8px] font-sans text-zinc-650 uppercase font-extrabold tracking-wider">TPL</span>
              </div>

              <div>
                <h5 className="text-xs font-sans font-black text-white truncate uppercase tracking-wider">{tpl.title}</h5>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{tpl.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
