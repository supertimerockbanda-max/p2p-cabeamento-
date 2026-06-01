/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BUILDINGS, INFRA_GERAL } from '../data';
import { Building, Room } from '../types';
import { 
  Network, Server, Cable, Cpu, ShieldAlert, BadgeCheck,
  CheckCircle, Radio, Eye, PhoneCall, HelpCircle, HardDrive,
  Globe, ShieldCheck, ArrowRight, Activity, BookOpen, Layers,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function NetworkTopology() {
  const [activeTab, setActiveTab] = useState<'physical' | 'flow' | 'dictionary'>('physical');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("predio-1");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("p1-r1");
  const [selectedDetailTab, setSelectedDetailTab] = useState<'points' | 'rack'>('points');
  const [showLogicDetails, setShowLogicDetails] = useState<boolean>(true);
  const [pulseSpeed, setPulseSpeed] = useState<number>(3); // seconds for laser pulse animation

  // Flow State
  const [selectedFlowNode, setSelectedFlowNode] = useState<number>(0);

  const selectedBuilding = BUILDINGS.find(b => b.id === selectedBuildingId) || BUILDINGS[0];
  const selectedRoom = selectedBuilding.rooms.find(r => r.id === selectedRoomId) || selectedBuilding.rooms[0];

  const totalPoints = BUILDINGS.reduce((sum, b) => {
    return sum + b.rooms.reduce((rSum, r) => rSum + r.networkPoints + r.voipPoints + r.apPoints + r.cctvPoints, 0);
  }, 0);

  // Flow Steps Data
  const FLOW_STEPS = [
    {
      id: 1,
      title: "Link de Internet (WAN/Provedor)",
      subtitle: "A Entrada do Tráfego",
      descSimple: "É o link veloz contratado que conecta sua rede ao mundo exterior. Funciona como a rede de água encanada entrando na propriedade.",
      descImport: "Sem uma entrada limpa e estabilizada, os servidores locais ficam isolados. Usamos conversores de mídia Gigabit para garantir que a transição de fibra da rua até o seu CPD seja livre de engasgos.",
      techSpec: "Entrada de Fibra Óptica GPON/MetroEthernet redundante conectada à WAN.",
      icon: <Globe className="w-5 h-5 text-zinc-400" />
    },
    {
      id: 2,
      title: "Borda de Segurança (Firewall Ativo)",
      subtitle: "O Guarda de Borda",
      descSimple: "O escudo digital responsável por inspecionar cada pacote de dados que tenta entrar ou sair da empresa.",
      descImport: "Impede ataques cibernéticos, sequestro de dados e acessos maliciosos por funcionários no expediente. Garante que os acessos sejam divididos com segurança.",
      techSpec: "Firewall Gateway de segurança dedicado com filtragem de pacotes IPS/IDS em tempo real.",
      icon: <ShieldAlert className="w-5 h-5 text-zinc-400" />
    },
    {
      id: 3,
      title: "Cérebro Central (Switch Core L3)",
      subtitle: "O Distribuidor Inteligente",
      descSimple: "O núcleo do CPD que gerencia onde colocar cada informação. Direciona os dados para a impressora, servidor de prontuários ou Wi-Fi.",
      descImport: "Evita que redes lentas (como o Wi-Fi de visitantes) interfiram nos sistemas prioritários de faturamento e finanças. Faz o tráfego fluir sem filas de espera.",
      techSpec: "Switch Gerenciável Layer 3 com VLANs separadas e QoS prioritário no tráfego de voz.",
      icon: <Layers className="w-5 h-5 text-zinc-400" />
    },
    {
      id: 4,
      title: "Autoestrada de Luz (Fibra OS2 Subterrânea)",
      subtitle: "A Conexão Interpredial (120m)",
      descSimple: "Um cabo subterrâneo composto de filamentos de vidro que interliga os prédios do complexo na velocidade da luz.",
      descImport: "Por trafegar apenas luz (não eletricidade), é 100% imune a descargas elétricas da chuva ou temporais, isolando o Prédio A do Prédio B de queimas induzidas.",
      techSpec: "Enlace de fibra óptica monomodo OS2 duplex ligada por transceptores SFP+ de 10Gbps estável.",
      icon: <Cable className="w-5 h-5 text-zinc-400" />
    },
    {
      id: 5,
      title: "Switches de Distribuição PoE+",
      subtitle: "Energia e Dados Integrados",
      descSimple: "Equipamentos nos Racks que pegam o sinal que veio da fibra e dividem para os computadores através dos cabos metálicos.",
      descImport: "Eles enviam dados e energia elétrica pelo mesmo cabo de rede. Isso alimenta as câmeras IP de segurança e os Access Points Wi-Fi sem precisar de tomadas elétricas perto deles.",
      techSpec: "Switches PoE+ Norma IEEE 802.3at de baixa temperatura operacional e alta estabilidade de tensão.",
      icon: <Server className="w-5 h-5 text-zinc-400" />
    },
    {
      id: 6,
      title: "Tomadas Finais e APs (Cat6A)",
      subtitle: "A Experiência do Usuário",
      descSimple: "As tomadas de parede (Keystones) elegantes e os emissores Wi-Fi de alta performance que os computadores e aparelhos usam.",
      descImport: "A blindagem do cabo de cobre Cat6A impede falhas provocadas pela indução do cabeamento elétrico vizinho, permitindo internet sem oscilações estressantes.",
      techSpec: "Mapeamento estruturado blindado anti-diafonia, plugues RJ-45 de alta liga de bronze.",
      icon: <Radio className="w-5 h-5 text-zinc-400" />
    }
  ];

  // Glossary Data
  const GLOSSARY = [
    {
      term: "Cabeamento Cat6A (F/UTP)",
      translated: "Como uma rodovia dupla cercada por barreiras de som.",
      benefit: "A blindagem metálica impede que os campos eletromagnéticos gerados por motores elétricos ou fiação de energia próximos derrubem a velocidade e causem 'lags' e lentidões na sua internet.",
      concept: "Cabo de cobre com par trançado blindado capaz de trafegar taxas de até 10.000 Mbps estáveis por canal."
    },
    {
      term: "Fibra Óptica Monomodo OS2",
      translated: "Um feixe laser perfeitamente reto viajando pelo vidro.",
      benefit: "Como é feita de vidro puro recoberto, não conduz eletricidade. Se um raio cair perto ou houver alta umidade no solo amapaense, seus equipamentos estarão 100% salvos contra curto-circuitos.",
      concept: "Condutor óptico de alta precisão imune a ruídos indutivos e com perda de sinal praticamente nula."
    },
    {
      term: "VLANs (Paredes Virtuais)",
      translated: "Muralhas virtuais invisíveis dividindo a rede física.",
      benefit: "Evita que aparelhos de clientes conectados no Wi-Fi consigam enxergar ou tentar acessar computadores confidenciais do financeiro, faturamento ou prontuários, mantendo a empresa sob blindagem interna.",
      concept: "Redes locais virtuais criadas de forma lógica no Switch para separar tráfegos distintos de informação."
    },
    {
      term: "Nobreak Senoidal SMS",
      translated: "Uma bateria industrial com purificador elétrico.",
      benefit: "Além de segurar os aparelhos ligados por horas se a energia cair repentinamente, ele mantém a eletricidade suave e perfeitamente constante para que os servidores não travem ou queimem seus discos internos.",
      concept: "Modulação senoidal pura que atua como filtro de ruídos de tensão no CPD de modo autárquico."
    },
    {
      term: "QoS (Telefonia VoIP Sem Cortes)",
      translated: "Uma faixa de trânsito expressa para chamadas de voz.",
      benefit: "Garante que mesmo se alguém estiver fazendo um download pesado na empresa, sua ligação de telefone VoIP continue com som cristalino e sem 'picotar' ou cair a voz.",
      concept: "Quality of Service (Qualidade de Serviço) prioritário que separa pacotes de voz na camada lógica."
    },
    {
      term: "Certificação Fluke Networks",
      translated: "O exame de ultrassom definitivo de cada cabo.",
      benefit: "Usamos o aparelho mais moderno do mercado mundial para realizar testes rigorosos de integridade física. É o único laudo que valida e entrega a garantia estendida de fabricante de até 25 anos à sua infraestrutura.",
      concept: "Relatórios de passagem de sinal de diafonia e perdas ópticas emitidos por aferidores homologados."
    }
  ];

  return (
    <div className="space-y-8 select-none" id="infraestrutura-tecnica">
      {/* Tab Selectors & Headings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold block">
            PROJETO DE INFRAESTRUTURA FÍSICA E LÓGICA
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-1 tracking-tight">
            Topologia de Rede Interpredial
          </h2>
          <p className="text-zinc-400 text-xs mt-1.5 max-w-2xl font-sans leading-relaxed">
            Navegue pelos módulos interativos abaixo para entender perfeitamente o esqueleto da sua rede, desde a interligação de prédios à função de cada dispositivo.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-none sm:w-auto w-full overflow-x-auto">
          <button 
            onClick={() => setActiveTab('physical')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold transition rounded-none uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'physical'
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white bg-transparent"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            1. Mapa de Prédios
          </button>
          
          <button 
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold transition rounded-none uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'flow'
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white bg-transparent"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            2. Fluxo dos Dados
          </button>

          <button 
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold transition rounded-none uppercase cursor-pointer whitespace-nowrap ${
              activeTab === 'dictionary'
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white bg-transparent"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            3. Sem Segredos (Dicionário)
          </button>
        </div>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
        <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-4 shadow-sm">
          <p className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Pontos Físicos Totais</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{totalPoints} Pontos</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-sans">100% Certificados em cobre & fibra</p>
        </div>
        <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-4 shadow-sm">
          <p className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Largura de Banda Backbone</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">10 Gbps SFP+</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-sans">Sem latência ou engasgos</p>
        </div>
        <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-4 shadow-sm">
          <p className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Vão do Enlace Externo</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">120 Metros</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-sans">Cabo OS2 Monomodo Subterrâneo</p>
        </div>
        <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-4 shadow-sm">
          <p className="text-[9px] text-zinc-550 uppercase font-mono font-bold tracking-wider">Normas Aplicadas</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">ABNT NBR</p>
          <p className="text-[10px] text-zinc-500 mt-1 font-sans">Conformidade NBR 14565 e 5410</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: PHYSICAL TOPOLOGY (INTERACTIVE COMPLEX MAP) */}
        {activeTab === 'physical' && (
          <motion.div 
            key="physical-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Main Interactive Map & Connection Connection Layout */}
            <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-zinc-800/5 to-transparent pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 font-sans">
                
                {/* Prédio 1 - Bloco de Operações */}
                <div 
                  className={`col-span-1 lg:col-span-4 p-5 rounded-none cursor-pointer transition-all duration-300 border ${
                    selectedBuildingId === "predio-1" 
                      ? "bg-zinc-950 border-white shadow-xl scale-[1.01]" 
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/80"
                  }`}
                  onClick={() => {
                    setSelectedBuildingId("predio-1");
                    setSelectedRoomId("p1-r1");
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-zinc-900 text-zinc-300 text-[9px] font-mono px-2 py-0.5 rounded border border-zinc-850 font-bold select-none">
                      BLOCO DE OPERAÇÕES - PRÉDIO A
                    </span>
                    <span className="flex h-2 w-2 relative">
                      {selectedBuildingId === "predio-1" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedBuildingId === 'predio-1' ? 'bg-emerald-500' : 'bg-zinc-650'}`}></span>
                    </span>
                  </div>
                  
                  <h3 className="text-base font-sans font-black uppercase text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-zinc-300" />
                    {BUILDINGS[0].name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-sans">
                    {BUILDINGS[0].purpose}
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <p className="text-zinc-500 uppercase font-bold text-[9px]">Salas Ativas</p>
                      <p className="font-bold text-white mt-0.5">4 Setores Planejados</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 uppercase font-bold text-[9px]">Infra Rack</p>
                      <p className="font-bold text-white mt-0.5">19&quot; Piso 24U</p>
                    </div>
                  </div>

                  <button className="mt-5 w-full py-2 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-white font-mono rounded-none text-[10px] font-bold uppercase transition tracking-wider cursor-pointer">
                    Selecionar Edifício A
                  </button>
                </div>

                {/* Connection Link (Optical Fiber OS2) */}
                <div className="col-span-1 lg:col-span-4 flex flex-col items-center justify-center text-center px-4 relative">
                  <div className="text-[10px] font-mono text-zinc-400 mb-2 flex items-center gap-1.5 justify-center tracking-wider uppercase font-bold">
                    <Cable className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Cabo Óptico OS2 Monomodo (Subterrâneo)</span>
                  </div>

                  {/* Simulated Fiber optic line with scrolling laser pulses */}
                  <div className="w-full h-2 bg-black rounded-none flex items-center relative overflow-hidden border border-zinc-900">
                    <motion.div 
                      className="absolute h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-36 shadow-[0_0_12px_#10b981]"
                      animate={{ left: ["-144px", "100%"] }}
                      transition={{
                        duration: pulseSpeed,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>

                  <div className="mt-3.5 space-y-1 font-mono text-[11px]">
                    <span className="text-zinc-450 block font-sans">
                      Comprimento Real: <span className="text-white font-bold font-mono">120 Metros</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono flex items-center justify-center gap-1.5 py-0.5 px-2 bg-zinc-950 border border-zinc-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Transceptores 10G SFP+ LR Ativos
                    </span>
                  </div>

                  {/* Traffic logic controller */}
                  <div className="mt-4 bg-[#0a0a0c] p-3 rounded-none border border-zinc-900 w-full max-w-xs">
                    <label className="text-[10px] text-zinc-400 font-mono flex justify-between select-none font-bold uppercase tracking-wider">
                      <span>Simular Tráfego de Dados</span>
                      <span className="text-white font-bold font-mono">
                        {pulseSpeed === 5 ? "BAIXO" : pulseSpeed === 3 ? "MÉDIO" : "LARGURA CHEIA (10GBPS)"}
                      </span>
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="2" 
                      value={pulseSpeed === 1 ? 5 : pulseSpeed === 3 ? 3 : 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setPulseSpeed(val === 1 ? 5 : val === 3 ? 3 : 1);
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer mt-2.5 accent-white"
                    />
                  </div>
                </div>

                {/* Prédio 2 - Centro de Processamento & CPD */}
                <div 
                  className={`col-span-1 lg:col-span-4 p-5 rounded-none cursor-pointer transition-all duration-300 border ${
                    selectedBuildingId === "predio-2" 
                      ? "bg-zinc-950 border-white shadow-xl scale-[1.01]" 
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/80"
                  }`}
                  onClick={() => {
                    setSelectedBuildingId("predio-2");
                    setSelectedRoomId("p2-r4"); // Default to Central CPD
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-zinc-900 text-zinc-300 text-[9px] font-mono px-2 py-0.5 rounded border border-zinc-850 font-bold select-none">
                      MATRIZ DO CPD - EDIFÍCIO B
                    </span>
                    <span className="flex h-2 w-2 relative">
                      {selectedBuildingId === "predio-2" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedBuildingId === 'predio-2' ? 'bg-emerald-500' : 'bg-zinc-650'}`}></span>
                    </span>
                  </div>
                  
                  <h3 className="text-base font-sans font-black uppercase text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-zinc-300" />
                    {BUILDINGS[1].name}
                  </h3>
                  <p className="text-xs text-zinc-405 mt-2 leading-relaxed font-sans">
                    {BUILDINGS[1].purpose}
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <p className="text-zinc-500 uppercase font-bold text-[9px]">Central CPD</p>
                      <p className="font-bold text-white mt-0.5">4 Setores + Core L3</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 uppercase font-bold text-[9px]">Rack Core</p>
                      <p className="font-bold text-white mt-0.5">19&quot; Fechado 42U</p>
                    </div>
                  </div>

                  <button className="mt-5 w-full py-2 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-white font-mono rounded-none text-[10px] font-bold uppercase transition tracking-wider cursor-pointer">
                    Selecionar Edifício B
                  </button>
                </div>

              </div>
            </div>

            {/* Cabling exploration split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Room list (5 cols) */}
              <div className="lg:col-span-5 bg-[#0e0e11] border border-zinc-900 rounded-none p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-none bg-white font-mono" />
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                      Setores do {selectedBuildingId === "predio-1" ? "Prédio A" : "Prédio B (CPD)"}
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    {selectedBuilding.rooms.map((room) => {
                      const totalRoomPoints = room.networkPoints + room.voipPoints + room.apPoints + room.cctvPoints;
                      const isSelected = selectedRoomId === room.id;
                      return (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`w-full text-left p-3 border transition-all flex justify-between items-center cursor-pointer rounded-none ${
                            isSelected
                              ? "bg-zinc-900 border-zinc-500 shadow-lg"
                              : "bg-zinc-950/40 border-zinc-950 hover:border-zinc-800 hover:bg-zinc-900/40"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white font-sans uppercase tracking-tight">{room.name}</span>
                            <span className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1.5 font-mono">
                              <Cable className="w-3 h-3 text-zinc-500" />
                              {room.cablingType}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white font-mono bg-[#09090b] px-2 py-0.5 border border-zinc-800">
                              {totalRoomPoints} Pts
                            </span>
                            {isSelected && (
                              <CheckCircle className="w-3.5 h-3.5 text-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-zinc-950 border border-zinc-900 text-xs space-y-3 rounded-none">
                  <h5 className="font-bold text-zinc-350 flex items-center gap-1.5 uppercase font-mono text-[9px] tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-zinc-450" />
                    Normas Técnicas Nacionais (CREA / ABNT)
                  </h5>
                  <p className="text-zinc-500 leading-relaxed text-[11px] font-sans">
                    Nossos profissionais executam as vias segundo o padrão <strong className="text-white">T568B</strong>, que assegura taxas sem perda por Crosstalk. Todos os materiais adotados no trajeto são blindados e revestidos de material <strong>LSZH (Low Smoke Zero Halogen)</strong>, em respeito às regras contra incêndio corporativos descritas na NBR 14705.
                  </p>
                </div>
              </div>

              {/* Specification layout (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 flex-1 flex flex-col justify-between">
                  
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 mb-4 gap-4">
                      <div>
                        <h4 className="text-base font-sans font-black text-white uppercase tracking-tight">
                          {selectedRoom.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                          {selectedRoom.description}
                        </p>
                      </div>
                      <div className="flex bg-zinc-950 border border-zinc-900 p-0.5 rounded-none shrink-0">
                        <button
                          onClick={() => setSelectedDetailTab('points')}
                          className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition rounded-none cursor-pointer ${
                            selectedDetailTab === 'points'
                              ? "bg-white text-black"
                              : "text-zinc-400 hover:text-white bg-transparent"
                          }`}
                        >
                          Pontos do Setor
                        </button>
                        <button
                          onClick={() => setSelectedDetailTab('rack')}
                          className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition rounded-none cursor-pointer ${
                            selectedDetailTab === 'rack'
                              ? "bg-white text-black"
                              : "text-zinc-400 hover:text-white bg-transparent"
                          }`}
                        >
                          Rack do Bloco
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {selectedDetailTab === 'points' ? (
                        <motion.div
                          key="points-subtab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h5 className="text-[9px] font-mono tracking-wider text-zinc-550 uppercase mb-3.5 font-bold">
                            Distribuição Normatizada de Tomadas do Setor
                          </h5>

                          {/* Endpoint dynamic count card array */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            
                            {/* Workstations Cat6A */}
                            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-none flex flex-col justify-between min-h-[75px]">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">RJ45 Dados</span>
                                <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                              </div>
                              <div className="mt-2.5">
                                <p className="text-xl font-bold text-white font-mono leading-none">{selectedRoom.networkPoints}</p>
                                <p className="text-[9px] text-zinc-500 mt-1 font-sans">Cabos Cat6A</p>
                              </div>
                            </div>

                            {/* VoIP Lines */}
                            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-none flex flex-col justify-between min-h-[75px]">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">Fonia VoIP</span>
                                <PhoneCall className="w-3.5 h-3.5 text-zinc-500" />
                              </div>
                              <div className="mt-2.5">
                                <p className="text-xl font-bold text-white font-mono leading-none">{selectedRoom.voipPoints}</p>
                                <p className="text-[9px] text-zinc-500 mt-1 font-sans">QoS Expresso</p>
                              </div>
                            </div>

                            {/* AP Wireless */}
                            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-none flex flex-col justify-between min-h-[75px]">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">Pontos AP</span>
                                <Radio className="w-3.5 h-3.5 text-zinc-500" />
                              </div>
                              <div className="mt-2.5">
                                <p className="text-xl font-bold text-white font-mono leading-none">{selectedRoom.apPoints}</p>
                                <p className="text-[9px] text-zinc-500 mt-1 font-sans">Alimentado via PoE</p>
                              </div>
                            </div>

                            {/* Câmeras CFTV IP */}
                            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-none flex flex-col justify-between min-h-[75px]">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase">Câmeras IP</span>
                                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                              </div>
                              <div className="mt-2.5">
                                <p className="text-xl font-bold text-white font-mono leading-none">{selectedRoom.cctvPoints}</p>
                                <p className="text-[9px] text-zinc-500 mt-1 font-sans">Foco em Segurança</p>
                              </div>
                            </div>

                          </div>

                          {/* Infrastructure physical path info */}
                          <div className="mt-4 p-4 bg-zinc-950 border border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs rounded-none">
                            <div>
                              <p className="font-mono text-zinc-500 font-bold mb-1 uppercase text-[9px] tracking-wide">Caminho de Distribuição Física</p>
                              <p className="text-zinc-400 font-sans leading-relaxed text-[11px]">
                                {selectedRoom.id.includes('p2-r4') 
                                  ? "Montado totalmente sobre piso elevado técnico, com saída direta em caixas de tomadas niveladas de alumínio fundido."
                                  : "Usa furações planejadas em alvenaria protegidas e canaletas estruturadas de PVC rígido com septo divisor interno."}
                              </p>
                            </div>
                            <div>
                              <p className="font-mono text-zinc-500 font-bold mb-1 uppercase text-[9px] tracking-wide">Código de Identificação de Portas</p>
                              <p className="text-zinc-300 font-mono text-[10px] break-all bg-zinc-950 p-2 border border-zinc-900/80">
                                P2P-CAB-{selectedBuildingId === "predio-1" ? "A" : "B"}-{selectedRoom.name.substring(0,3).toUpperCase()}-PT[XX]
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="rack-subtab"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-[9px] font-mono tracking-wider text-zinc-550 uppercase font-bold">
                              Elevação do Rack Relacionado a este Bloco
                            </h5>
                            <span className="text-zinc-300 font-mono text-[10px] font-semibold bg-zinc-950 px-2 py-0.5 border border-zinc-900">
                              {selectedBuildingId === "predio-1" ? "RACK 24U - BLOCO A" : "RACK 42U - CPD CENTRAL"}
                            </span>
                          </div>

                          {selectedBuildingId === "predio-1" ? (
                            <div className="bg-zinc-950 p-4 rounded-none border border-zinc-900 space-y-1.5 font-mono text-[10px] text-zinc-400">
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-2 flex justify-between items-center">
                                <span>[U22-U24] DIO Óptico de Borda</span>
                                <span className="text-zinc-300 font-bold text-[9px] bg-zinc-900 px-2 py-0.5 border border-zinc-800">2 Canais OS2</span>
                              </div>
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-1 text-center text-zinc-600 border-dashed">
                                [U21] Guia de Cabo Horizontal 1U
                              </div>
                              <div className="bg-zinc-900 border border-zinc-850 text-white rounded p-2 flex justify-between items-center">
                                <span className="font-bold text-zinc-100">[U20] Switch L3 Gerenciável 24p</span>
                                <span className="text-emerald-405 text-[9px] font-bold tracking-wider">UP-LINK SFP+ 10G</span>
                              </div>
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-2 flex justify-between items-center">
                                <span>[U19] Patch Panel 24P Blindado</span>
                                <span className="text-zinc-200 font-bold text-[9px]">18 Conectores Cat6A</span>
                              </div>
                              <div className="bg-[#0c0c0e] border border-zinc-900 border-dashed rounded p-3 text-center text-[10px] text-zinc-550 font-semibold">
                                [U1-U18] Espaço de Expansão para Novos Setores
                              </div>
                            </div>
                          ) : (
                            <div className="bg-zinc-950 p-4 rounded-none border border-zinc-900 space-y-1.5 font-mono text-[10px] text-zinc-400">
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-2 flex justify-between items-center">
                                <span>[U40-U42] DIO Centralizador</span>
                                <span className="text-zinc-300 font-bold text-[9px] bg-zinc-900 px-2 py-0.5 border border-zinc-800">4 Canais OS2</span>
                              </div>
                              <div className="bg-zinc-900 border border-zinc-850 text-white rounded p-2 flex justify-between items-center">
                                <span className="font-bold text-zinc-100">[U39] Firewall de Borda Ativo</span>
                                <span className="text-zinc-300 text-[9px] font-bold">WAN DUPLEX</span>
                              </div>
                              <div className="bg-zinc-900 border border-zinc-850 text-white rounded p-2 flex justify-between items-center">
                                <span className="font-bold text-zinc-100">[U37] Switch Core UniFi L3 24p</span>
                                <span className="text-emerald-400 text-[9px] font-bold">10G BACKBONE</span>
                              </div>
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-2 flex justify-between items-center">
                                <span>[U36] Patch Panel 24P Cat6A Blindado</span>
                                <span className="text-zinc-200 font-bold">24 Portas Ativas</span>
                              </div>
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-2 flex justify-between items-center">
                                <span>[U10-U12] Servidor de Prontuários Hosp.</span>
                                <span className="text-zinc-450">[Solares SAS]</span>
                              </div>
                              <div className="bg-[#0f0f13] border border-zinc-900 rounded p-2 flex justify-between items-center">
                                <span>[U1-U4] NoBreak SMS Corporativo 3kVA</span>
                                <span className="text-emerald-400 font-extrabold flex items-center gap-1">🔋 OK</span>
                              </div>
                            </div>
                          )}
                          <p className="text-[10px] text-zinc-500 font-sans leading-relaxed mt-1">
                            A estrutura segue a norma EIA/TIA-310 de dimensionamento vertical de gabinetes de telecomunicações.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  <div className="mt-5 pt-4.5 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400 font-semibold font-sans">Aprovado sob parametrização de testes da Fluke Networks DSX-8000</span>
                    </div>

                    <button 
                      onClick={() => setShowLogicDetails(!showLogicDetails)}
                      className="text-xs font-mono text-white hover:text-zinc-300 flex items-center gap-1.5 transition underline bg-transparent border-0 cursor-pointer font-bold uppercase tracking-wider"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showLogicDetails ? "Esconder VLANs" : "Visualizar VLANs"}
                    </button>
                  </div>

                  {showLogicDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-zinc-950 border border-zinc-900 text-xs text-zinc-400 rounded-none space-y-3 overflow-hidden"
                    >
                      <p className="font-mono text-white text-[9px] font-bold uppercase tracking-wider">Divisão Lógica por VLANs no Switch Core:</p>
                      <ul className="space-y-2 list-none text-[11px]">
                        {selectedRoom.networkPoints > 0 && (
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5" />
                            <span><strong className="text-zinc-200">VLAN 10 (Rede Comercial/Dados):</strong> Sub-rede segregada IP 10.0.10.0/24. Concede alta velocidade sem poluição de broadcast.</span>
                          </li>
                        )}
                        {selectedRoom.voipPoints > 0 && (
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                            <span><strong className="text-zinc-200">VLAN 20 (Telefonia VoIP Digital):</strong> Sub-rede 10.0.20.0/24 específica para voz. O switch garante prioridade lógica imediata em ligações.</span>
                          </li>
                        )}
                        {selectedRoom.apPoints > 0 && (
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                            <span><strong className="text-zinc-200">VLAN 30 (Wi-Fi Visitantes & Ambientes):</strong> Isolamento total ativo. Um visitante navega sem ver os arquivos da empresa.</span>
                          </li>
                        )}
                        {selectedRoom.cctvPoints > 0 && (
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5" />
                            <span><strong className="text-zinc-200">VLAN 40 (Segurança & Câmeras):</strong> Conexão e armazenamento priorizados de vídeo sem travar seu sistema interno.</span>
                          </li>
                        )}
                      </ul>
                    </motion.div>
                  )}

                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SCHEMATIC INFORMATION FLOW (EXPLAINER PARADIGM FOR CLIENTS) */}
        {activeTab === 'flow' && (
          <motion.div 
            key="flow-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 md:p-8 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-80 h-80 bg-radial from-zinc-800/5 to-transparent pointer-events-none" />
              
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-black flex items-center gap-2">
                  <Activity className="w-4 h-4 text-white animate-pulse" />
                  COMO OS DADOS TRAFEGAM NA SUA FUTURA INFRAESTRUTURA
                </h3>
                <p className="text-sm text-zinc-450 mt-1 font-sans">
                  Clique nas etapas do fluxo lógico abaixo para desmistificar cada barreira física e estratégica da sua rede.
                </p>
              </div>

              {/* Graphical representation of the logical flow */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
                {FLOW_STEPS.map((step, idx) => {
                  const isSelected = selectedFlowNode === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setSelectedFlowNode(idx)}
                      className={`relative text-left p-4 rounded-none border transition-all flex flex-col justify-between cursor-pointer group ${
                        isSelected 
                          ? "bg-zinc-900 border-white shadow-xl"
                          : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/80"
                      }`}
                    >
                      {/* Step Number Badge */}
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border w-fit mb-4 select-none ${
                        isSelected ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-400 border-zinc-800"
                      }`}>
                        ETAPA {step.id}
                      </span>

                      <div>
                        {step.icon}
                        <h4 className="text-xs font-display font-black uppercase text-white mt-3.5 tracking-tight group-hover:text-white transition line-clamp-2">
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-1 font-sans font-medium">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Small visual connection indicator */}
                      {idx < 5 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-20 pointer-events-none">
                          <ArrowRight className={`w-4 h-4 transition ${isSelected ? "text-white" : "text-zinc-800"}`} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Step Explainer Screen */}
              <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-none relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">
                      DESVENDANDO A ETAPA {FLOW_STEPS[selectedFlowNode].id} DO PROJETO
                    </span>
                    <h4 className="text-lg font-sans font-black text-white uppercase mt-0.5">
                      {FLOW_STEPS[selectedFlowNode].title}
                    </h4>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-none px-3 py-1 text-[11px] font-mono text-zinc-300 font-bold uppercase select-none">
                    Status: Planejado Ativo
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Explanation (8 columns) */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-mono font-bold text-zinc-550 uppercase tracking-widest">O que significa em termos simples?</p>
                      <p className="text-zinc-300 text-sm leading-relaxed font-sans">
                        {FLOW_STEPS[selectedFlowNode].descSimple}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-mono font-bold text-zinc-550 uppercase tracking-widest">Por que é essencial para o seu negócio?</p>
                      <p className="text-zinc-400 text-sm leading-relaxed font-sans italic">
                        &ldquo;{FLOW_STEPS[selectedFlowNode].descImport}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Technical Spec (4 columns) */}
                  <div className="md:col-span-4 bg-zinc-950 border border-zinc-900 p-4 rounded-none space-y-3 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-white border-b border-zinc-900 pb-2">
                      <Settings className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-bold uppercase text-[9px] tracking-wider">Parâmetro de Engenharia</span>
                    </div>
                    <div>
                      <p className="text-zinc-550 font-bold uppercase text-[9px]">Especificação Técnica adotada:</p>
                      <p className="text-zinc-300 font-semibold mt-1 leading-relaxed">{FLOW_STEPS[selectedFlowNode].techSpec}</p>
                    </div>
                    <div className="pt-2 text-zinc-500 text-[10px] leading-relaxed border-t border-zinc-900/60 font-sans">
                      Implementação regulada segundo a legislação ABNT de cabeamento nacional.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: GLOSSARY / DICIONARIO DESCOMPLICADO */}
        {activeTab === 'dictionary' && (
          <motion.div 
            key="dictionary-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-zinc-800/5 to-transparent pointer-events-none" />
              
              <div className="border-b border-zinc-900 pb-4">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-black">
                  📖 DICIONÁRIO DE REDE LIVRE DE COMPLICAÇÕES TÉCNICAS
                </h3>
                <p className="text-sm text-zinc-450 mt-1 font-sans">
                  Entenda as especificações de engenharia por trás do seu projeto traduzidas diretamente para as vantagens práticas da sua empresa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {GLOSSARY.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-zinc-950 border border-zinc-900 p-5 rounded-none flex flex-col justify-between hover:border-zinc-800 transition duration-300 relative group overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Badge / Term icon placeholder */}
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500">CONCEITO DO PROJETO</span>
                        <div className="h-6 w-6 bg-zinc-900 border border-zinc-800 rounded mx-0 flex items-center justify-center font-mono font-black text-xs text-zinc-400">
                          {idx + 1}
                        </div>
                      </div>

                      <h4 className="text-sm font-sans font-black text-white uppercase mt-1 tracking-tight">
                        {item.term}
                      </h4>

                      <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 font-sans text-xs text-zinc-350 leading-relaxed font-medium">
                        <span className="text-white font-mono text-[9px] block uppercase font-bold tracking-wider mb-1">Analogia Prática:</span>
                        {item.translated}
                      </div>

                      <div className="space-y-1 pl-1">
                        <span className="text-white font-mono text-[9px] uppercase font-bold tracking-wider block">Impacto Comercial no seu Dia-a-Dia:</span>
                        <p className="text-zinc-400 text-xs leading-relaxed font-sans mt-0.5">
                          {item.benefit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-zinc-900 font-mono text-[10px] text-zinc-500 leading-normal">
                      <span className="font-bold">Termo Técnico Acadêmico:</span> <span className="text-zinc-450">{item.concept}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-4 font-sans text-xs text-zinc-400 leading-relaxed rounded-none">
                <span className="text-white font-mono font-bold uppercase tracking-wide text-[10px] block mb-1">💡 DICA OPERACIONAL DE TI PARA A DIRETORIA:</span>
                Investir em um cabeamento robusto de grau corporativo (Cat6A e Fibra OS2) poupa sua empresa de gastos recorrentes com visitas emergenciais de suporte de informática. Menos oscilação elétrica, maior estabilidade para transferência de sistemas e zero dores de cabeça operacional pelos próximos 15 anos.
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
