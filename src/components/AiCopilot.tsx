import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2, HelpCircle, Bot, AlertTriangle, Shield, Sliders, MessageSquare, Plus, Minus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const PRESETS = [
  { label: '📊 Estimar Orçamento', text: 'Gostaria de uma estimativa profissional de orçamento para interconexão e cabeamento Cat6A blindado.' },
  { label: '⚡ Aterramento (NBR 5410)', text: 'Quais são as exigências da NBR 5410 para o aterramento e proteção de racks metálicos?' },
  { label: '🗺️ Fibra Interpredial', text: 'Como funciona o projeto do vão interpredial subterrâneo de 120m de Fibra OS2?' },
  { label: '📋 Detalhes NBR 14565', text: 'Quais os requisitos de espaço físico e raios de curvatura de acordo com a NBR 14565?' }
];

const PRESET_CATEGORIES = [
  {
    id: 'normas',
    label: '📋 NORMAS ABNT',
    questions: [
      { label: 'Raios e Curva (NBR 14565)', text: 'Quais os requisitos físicos de curvatura da NBR 14565 para cabos Cat6A e fiação de fibra óptica?' },
      { label: 'Aterramento (NBR 5410)', text: 'Como funciona a equipotencialidade e o aterramento estruturado de racks sob as regras da NBR 5410?' },
      { label: 'Ensaios Analíticos (NBR 16869)', text: 'Quais parâmetros analíticos a ABNT NBR 16869 nos obriga a certificar nos canais de rede corporativos?' },
      { label: 'Cabos Antichama (NBR 14705)', text: 'Por que a norma NBR 14705 exige o uso de revestimentos com classificação LSZH contra incêndio?' }
    ]
  },
  {
    id: 'topologia',
    label: '🏢 INFRAESTRUTURA',
    questions: [
      { label: 'Ficha Prédio 1 (Operações)', text: 'Quais são as portas, pontos de voz e CFTV projetados para o Prédio 1 (Bloco Comercial)?' },
      { label: 'Ficha Prédio 2 (Datacenter)', text: 'Como está distribuída a infraestrutura do Prédio 2 (Datacenter e CPD dos Servidores)?' },
      { label: 'Projeto do Vão Óptico 120m', text: 'Como funciona a proteção contra intempéries e o setup do link subterrâneo de 120m de fibra OS2?' },
      { label: 'Ativos e Racks Organizados', text: 'Quais ativos de rede, switches UniFi redundantes e nobreaks senoidais de rack são integrados?' }
    ]
  },
  {
    id: 'fluke',
    label: '🛠️ QUALIDADE FLUKE',
    questions: [
      { label: 'Uso do Fluke DSX-8000', text: 'Por que a P2P exige a validação oficial via Fluke DSX-8000 na entrega de infraestruturas?' },
      { label: 'Crosstalk NEXT / Perdas', text: 'O que significa crosstalk NEXT, Return Loss e Atenuação nos relatórios periciais de cobre?' },
      { label: 'Limites de Fusão Óptica', text: 'Qual o limite de perda em decibéis estabelecido para emendas ópticas por fusão de arco?' },
      { label: 'Emissão ART e CREA', text: 'A P2P emite Anotação de Responsabilidade Técnica (ART) registrada eletronicamente no CREA-AP?' }
    ]
  },
  {
    id: 'equipe',
    label: '👥 CONSELHO DIRETOR',
    questions: [
      { label: 'Quem é Alejandro Passos?', text: 'Quem é Alejandro Passos e seu papel estratégico como Diretor Geral e Financeiro da P2P?' },
      { label: 'Quem é Diene Juliane?', text: 'Quem é Diene Juliane e qual seu foco prático como Diretora de Engenharia Física da P2P?' },
      { label: 'Quem é Matheus Pinheiro?', text: 'Quem é Matheus Pinheiro e como atua na emissão de laudos oficiais de rede?' },
      { label: 'Qual o grande diferencial P2P?', text: 'Quais os grandes diferenciais técnicos e metodológicos da P2P frente à concorrência comum local?' }
    ]
  },
  {
    id: 'sustentabilidade',
    label: '🌱 ECO-RENTABILIDADE',
    questions: [
      { label: 'Compromisso Verde da P2P', text: 'Como a P2P realiza nosso sonho sem prejudicar o meio ambiente e com foco em sustentabilidade?' },
      { label: 'Materiais Recicláveis telecom', text: 'Quais materiais da área de redes e cabeamento estruturado são recicláveis?' },
      { label: 'Desconto com Green Cabling', text: 'Como funciona a logística reversa Green Cabling e quais retornos econômicos ela traz?' },
      { label: 'Vantagem Ecológica dos Cabos LSZH', text: 'Quais as vantagens de sustentabilidade ambiental dos cabos LSZH?' }
    ]
  }
];

const NORMAS_LIST = [
  {
    code: 'ABNT NBR 14565',
    title: 'Cabeamento Estruturado para Edifícios Comerciais',
    requirements: [
      'Exige identificação individualizada de tomadas e racks.',
      'Raios mínimos de curvatura de 4x o diâmetro do cabo de cobre e 10x para fibras ópticas.',
      'Suporta aplicações de até 10 Gigabit Ethernet sobre Cat6A.'
    ],
    prompt: 'Me explique detalhadamente as regras de curvatura de cabo, percursos e espaços de telecomunicações definidos na ABNT NBR 14565.'
  },
  {
    code: 'ABNT NBR 5410',
    title: 'Instalações Elétricas de Baixa Tensão',
    requirements: [
      'Equipotencialização obrigatória de massas e racks metálicos à Bep/Barra de Terra principal.',
      'Utilização de cabos de aterramento verdes/amarelos com seção mínima de 6mm².',
      'Prevenção contra surtos elétricos induzidos em cabos de dados.'
    ],
    prompt: 'Qual a forma correta de interligar o cabo de aterramento de 6mm² dos racks metálicos à barra de terra principal segundo a NBR 5410?'
  },
  {
    code: 'ABNT NBR 16869',
    title: 'Ensaios de Cabo Óptico e Par Trançado',
    requirements: [
      'Instrumentação calibrada Fluke Networks (DSX-8000) obrigatória para validação.',
      'Emissão de relatórios individuais de NEXT, Return Loss e Atenuação.',
      'Canais reprovados devem ser re-terminados e re-testados.'
    ],
    prompt: 'Quais parâmetros analíticos (NEXT, perdas de retorno, atenuação) a NBR 16869-1 nos obriga a certificar nos canais Cat6A?'
  },
  {
    code: 'ABNT NBR 14705',
    title: 'Classificação contra Incêndio para Cabos',
    requirements: [
      'Exigência de cabos LSZH (Low Smoke Zero Halogen) em rotas verticais e plenuns.',
      'Garante baixa emissão de fumaça tóxica e zero gases halogenados.',
      'Obrigatório em ambientes de reunião pública e escritórios corporativos.'
    ],
    prompt: 'Por que a NBR 14705 exige o uso de cabos com classificação de queima LSZH em rotas internas corporativas de dados?'
  }
];

export default function AiCopilot() {
  const [activeTab, setActiveTab] = useState<'chat' | 'normas' | 'simulador'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o **P2P Co-Piloto**, seu engenheiro consultor especialista em cabeamento estruturado e conformidade ABNT.\n\nEscolha um dos presets recomendados, use nosso **Simulador de Preços** acoplado nas abas superiores, ou faça perguntas livremente sobre as normas **NBR 14565**, **NBR 5410** ou **NBR 16869**.'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Expanded Presets category state
  const [activePresetCategory, setActivePresetCategory] = useState<'normas' | 'topologia' | 'fluke' | 'equipe' | 'sustentabilidade'>('normas');

  // Simulator Inputs state
  const [numPoints, setNumPoints] = useState<number>(48);
  const [fiberDistance, setFiberDistance] = useState<number>(120);
  const [useGrounding, setUseGrounding] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of container without pulling or jumping the outer viewport screen
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollableContainer = messagesEndRef.current.parentElement;
      if (scrollableContainer) {
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setApiError(null);
    const updatedMessages = [...messages, { role: 'user' as const, content: textToSend }];
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);
    setActiveTab('chat'); // return to chat view to see response dynamically

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na requisição ao servidor.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error: any) {
      console.error(error);
      setApiError(error.message || 'Erro de conexão.');
      
      // Short, human-like, and highly conversational offline fallbacks
      const lower = textToSend.toLowerCase();
      let fallbackResponse = "";

      if (lower.includes('orçamento') || lower.includes('estimar') || lower.includes('custo') || lower.includes('preço') || lower.includes('simulação técnica') || lower.includes('célula') || lower.includes('valor')) {
        const isDynamicSim = lower.includes('[simulação]');
        const pts = isDynamicSim ? numPoints : 48;
        const dist = isDynamicSim ? fiberDistance : 120;
        const groundNeeded = isDynamicSim ? useGrounding : true;

        const KeystoneCost = pts * (1.5 * 38); 
        const cableCopperMeters = pts * 42; 
        const copperCableCost = cableCopperMeters * 5.40;
        const fiberCost = dist * 8.50;
        const switchAndActiveCost = pts <= 24 ? 8500 : pts <= 48 ? 14800 : 26500;
        const groundingCost = groundNeeded ? 1400 : 0;
        const laborAndFlukeCert = pts * 180; 
        const totalPassives = KeystoneCost + copperCableCost + fiberCost + groundingCost;
        const orderTotal = totalPassives + switchAndActiveCost + laborAndFlukeCert;

        fallbackResponse = `### **Simulação de Orçamento P2P**\n\nFiz uma simulação rápida para seu projeto (**${pts} pontos Cat6A** + **${dist}m de fibra**):\n\n- **Cabeamento e Keystones Furukawa**: R$ ${(copperCableCost + KeystoneCost).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- **Racks e Conectividade Elétrica/Fibra**: R$ ${(groundingCost + fiberCost).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n- **Switches e Ativos Ubiquiti**: R$ ${switchAndActiveCost.toLocaleString('pt-BR')}\n- **Qualidade, Fluke e ART do CREA**: R$ ${laborAndFlukeCert.toLocaleString('pt-BR')}\n\n💰 **Investimento Estimado**: **R$ ${orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**\n\n*Quer que eu detalhe a soma de algum item específico? É só me pedir!*`;
      } 
      else if (lower.includes('aterramento') || lower.includes('nbr 5410') || lower.includes('equipotencial') || lower.includes('eletrostática') || lower.includes('surtos') || lower.includes('barra de terra')) {
        fallbackResponse = `### **Aterramento de Racks (NBR 5410)**\n\nNa P2P, todos os racks metálicos de 19" são interligados à Barra de Terra Principal com condutores verdes de **6mm²**.\n\nIsso neutraliza a estática, evita interferências e protege seus equipamentos ativos de surtos inesperados.\n\n*Quer um aprofundamento sobre a norma NBR 5410? Só me pedir!*`;
      } 
      else if (lower.includes('curvatura') || lower.includes('raio') || lower.includes('dobra') || lower.includes('dobrar') || lower.includes('curvar')) {
        fallbackResponse = `### **Raios Mínimos de Curvatura (NBR 14565)**\n\nPara não quebrar as vias ou perder sinal nos caminhos, seguimos estas regras de dobra:\n\n- **Cabos de Cobre Cat6A**: Mínimo de **4 vezes** o diâmetro externo.\n- **Fibras Internas**: Mínimo de **10 vezes** o diâmetro.\n- **Fibras Externas Subterrâneas**: Mínimo de **20 vezes** o diâmetro.\n\n*Quer saber mais sobre as taxas de ocupação das calhas metálicas? Pode perguntar.*`;
      }
      else if (lower.includes('fluke') || lower.includes('dsx') || lower.includes('certifica') || lower.includes('laudo') || lower.includes('relatório') || lower.includes('analítico')) {
        fallbackResponse = `### **Qualidade Fluke DSX-8000**\n\nA P2P certifica 100% dos canais metálicos e ópticos com aparelhos profissionais calibrados:\n\n- **Cobre**: Medimos diafonia (NEXT), perdas e mapeamento de pinos.\n- **Fibra**: Medimos a atenuação que é limitada ao máximo de **0.1 dB** por fusão.\n- **Entrega**: Entregamos relatórios PDF oficiais do *LinkWare Fluke* assinados por engenheiro habilitado com ART do CREA.\n\n*Quer ver um exemplo de laudo técnico? Só me dizer.*`;
      }
      else if (lower.includes('diene') || lower.includes('juliane') || (lower.includes('engenharia') && lower.includes('diretora'))) {
        fallbackResponse = `### **Diene Juliane - Diretora de Engenharia Física**\n\n**Diene** é engenheira especialista em telecomunicações. Ela comanda o design da infraestrutura física, a passagem correta dos cabos por calhas e fusões de fibra óptica.\n\n*Lema: "O software roda muito melhor se a infraestrutura física for impecável."*`;
      }
      else if (lower.includes('alejandro') || lower.includes('passos') || (lower.includes('diretor') && (lower.includes('geral') || lower.includes('financeiro')))) {
        fallbackResponse = `### **Alejandro Passos - Diretor Geral e Financeiro**\n\n**Alejandro** coordena a precificação de projetos, ROI de TI, viabilidade econômica e parcerias globais de fornecimento da P2P.\n\n*Lema: "Nosso foco é dar estabilidade técnica com viabilidade financeira sólida."*`;
      }
      else if (lower.includes('matheus') || lower.includes('pinheiro') || (lower.includes('diretor') && (lower.includes('auditoria') || lower.includes('testes')))) {
        fallbackResponse = `### **Matheus Pinheiro - Diretor de Auditoria e Testes**\n\n**Matheus** lidera o controle pericial. É o responsável por auditar conexões com equipamentos Fluke calibrados e assinar as ARTs no CREA-AP.\n\n*Lema: "Aqui não há espaço para emendas amadoras, se o Fluke não passar, é refeito."*`;
      }
      else if (lower.includes('equipe') || lower.includes('fundadores') || lower.includes('sócios') || lower.includes('liderança')) {
        fallbackResponse = `### **Os Fundadores da P2P**\n\nNossa diretoria junta três mentes focadas:\n\n1. **Alejandro Passos**: Gestão financeira e viabilidade comercial.\n2. **Diene Juliane**: Projeto físico, caminhos mecânicos e fibras.\n3. **Matheus Pinheiro**: Testes Fluke Networks e homologação legal (CREA).\n\n*Deseja saber a formação ou trajetória de algum deles?*`;
      }
      else if (lower.includes('prédio 1') || lower.includes('prédio1') || lower.includes('bloco 1') || lower.includes('operações') || lower.includes('recepção') || lower.includes('sala de trabalho') || lower.includes('lab')) {
        fallbackResponse = `### **Prédio 1 - Bloco de Operações (48 pontos)**\n\nO Bloco de Operações conta com a seguinte distribuição técnica de pontos Cat6A:\n\n- **Recepção**: 4 pontos de dados, 2 VoIP, 1 Access Point e 2 Câmeras CFTV.\n- **Salas de Trabalho (Staff)**: 6 pontos de rede de alta velocidade, 3 VoIP e 1 Access Point.\n- **Laboratório**: 4 pontos blindados e 1 Câmera de monitoramento de alta resolução.\n- **Administração**: 4 pontos ethernet, 2 VoIP e 1 Access Point.\n\n*Se quiser saber como esses pontos descem até o rack, me avise.*`;
      }
      else if (lower.includes('prédio 2') || lower.includes('prédio2') || lower.includes('bloco 2') || lower.includes('datacenter') || lower.includes('cpd') || lower.includes('servidores') || lower.includes('controladoria')) {
        fallbackResponse = `### **Prédio 2 - Bloco Datacenter/CPD (48 pontos)**\n\nEste bloco reúne o coração lógico do projeto:\n\n- **Suporte Técnico**: 4 pontos ethernet, 2 VoIP, 1 AP e 2 Câmeras de monitoramento.\n- **Controladoria**: 8 pontos estáveis de alto tráfego financeiro, 4 VoIP e 1 Câmera.\n- **Diretoria**: 4 pontos de rede Cat6A blindados e 1 AP prioritário.\n- **CPD / Servidores**: 12 pontos no Rack de Ativos, 1 VoIP para manutenção e 2 Câmeras.\n\n*Quer ver como conectamos as duas salas através do link externo? Só perguntar!*`;
      }
      else if (lower.includes('fibra') || lower.includes('monomodo') || lower.includes('os2') || lower.includes('120m') || lower.includes('interpredial') || lower.includes('subterrâneo')) {
        fallbackResponse = `### **Enlace Óptico de 120m (Subterrâneo)**\n\nConectamos o Prédio 1 ao Prédio 2 de forma isolada contra descargas atmosféricas:\n\n- **Fibra**: Cabo OS2 Monomodo de 4 vias protegido contra umidade subterrânea.\n- **Fusões**: Enlace terminado em DIOs metálicos limitados a **0.1 dB** de perda por emenda.\n- **Ativos**: Operação em **10 Gbps** estáveis utilizando switches L3 e transceptores SFP+.\n\n*Quer detalhes sobre as técnicas de instalação subaquáticas ou dutos?*`;
      }
      else if (lower.includes('ubiquiti') || lower.includes('switch') || lower.includes('poe') || lower.includes('ativos') || lower.includes('l3')) {
        fallbackResponse = `### **Ativos Ubiquiti UniFi L3**\n\nA P2P adota switches corporativos gerenciáveis com ótimas especificações:\n\n- **Uplink**: Link de 10 Gbps em fibra óptica para máxima velocidade de interligação.\n- **Alimentação**: PoE+ integrado, ligando câmeras e Access Points apenas pelo cabo de rede.\n- **Energia**: Fontes redundantes e nobreaks senoidais para mitigar quedas de luz.\n\n*Caso queira saber mais sobre as VLANs planejadas, fale comigo.*`;
      }
      else if (lower.includes('furukawa') || lower.includes('f/utp') || lower.includes('blindado') || lower.includes('blindagem') || lower.includes('par trançado')) {
        fallbackResponse = `### **Cabeamento Furukawa Cat6A Blindado**\n\nExplicando de forma simples a escolha desse cabo premium:\n\n- **Modelo**: Furukawa GigaLan Cat6A F/UTP.\n- **Blindagem**: Uma fita de alumínio protege o sinal contra o ruído eletromagnético de cabos elétricos próximos.\n- **Benefício**: Evita quedas de pacotes, garantindo transmissão em até 10 Gbps a 500 MHz.\n\n*Caso precise de especificações detalhadas de atenuação por metro, só me pedir!*`;
      }
      else if (lower.includes('lszh') || lower.includes('fumaça') || lower.includes('antichama') || lower.includes('incêndio') || lower.includes('nbr 14705')) {
        fallbackResponse = `### **Segurança contra Incêndios (LSZH)**\n\nSeguimos a norma de segurança de vidas ABNT NBR 14705:\n\n- **Low Smoke Zero Halogen (LSZH)**: Os cabos da P2P possuem jaqueta livre de halogênios.\n- **Diferencial**: Se submetidos ao fogo, não propagam chamas e emitem apenas fumaça translúcida não-tóxica (diferente de cabos comuns que liberam fumaça ácida letal).\n\n*Quer as especificações técnicas da queima? Peça aqui.*`;
      }
      else if (lower.includes('abrigo') || lower.includes('canal') || lower.includes('eletroduto') || lower.includes('ocupação') || lower.includes('taxa de preenchimento')) {
        fallbackResponse = `### **Taxas de Ocupação de Conduítes (NBR 14565)**\n\n- **Regra dos 40%**: Ocupamos no máximo 40% da área útil do eletroduto ou calha com cabos.\n- **Reserva**: Os outros 60% ficam vazios para dissipação térmica de energia PoE e futuras ampliações de fiação.\n\n*Quer que eu calcule as bitolas ideais de eletrodutos para o seu número de pontos? Só pedir.*`;
      }
      else if (lower.includes('sustent') || lower.includes('meio ambiente') || lower.includes('recicl') || lower.includes('verde') || lower.includes('ecoló') || lower.includes('cabling')) {
        fallbackResponse = `### **Compromisso de Eco-Rentabilidade P2P**\n\nAjudamos a tornar seu sonho realidade sem prejudicar o meio ambiente! Nossos projetos aliam alta rentabilidade técnica a práticas ecológicas e circulares:\n\n- **Cobre e Alumínio 100% Reciclados**: Sobras e sucatas de cobre de alta pureza e alumínio estrutural de racks 19" são destinados integralmente à reciclagem, gerando retorno na obra.\n- **Programa Green Cabling (Furukawa)**: Reciclamos cabeamento antigo, gerando créditos ecológicos e descontos comerciais de até 15% em novos insumos superiores.\n- **Cabos LSZH**: Livres de cloro e flúor nocivos ao solo, oferecem segurança física à vida e são compostos de termoplásticos facilmente reutilizáveis.\n\n*Quer que eu mostre como obter o selo e desconto verde do programa Green Cabling?*`;
      }
      else if (lower.includes('contato') || lower.includes('macapá') || lower.includes('amapá') || lower.includes('crea') || lower.includes('art') || lower.includes('endereço')) {
        fallbackResponse = `### **Contato e Atendimento P2P**\n\n- **Origem**: Somos uma integradora de alta tecnologia amapaense situada em Macapá.\n- **Garantia**: Oferecemos garantia oficial estendida de 25 anos em toda a malha instalada.\n- **Análise Técnica**: Emitimos ART registrada no CREA-AP para autenticação de todos os laudos.\n\n*Quer agendar uma visita presencial ou reunião virtual?*`;
      }
      else if (lower.includes('ajuda') || lower.includes('opções') || lower.includes('funciona') || lower.includes('menu')) {
        fallbackResponse = `### **Como posso te ajudar hoje?**\n\nPosso detalhar qualquer um dos seguintes temas sem complicação:\n\n- **orçamento**: Simula os custos brutos do seu projeto do simulador.\n- **normas**: Tira dúvidas sobre regras ABNT (parâmetros técnicos, aterramentos, etc).\n- **topologia**: Detalha os pontos do Prédio 1 (Operações) e Prédio 2 (Datacenter).\n- **fluke**: Como funciona a nossa certificação e laudo.\n- **sustentabilidade**: Rentabilidade e materiais 100% recicláveis.\n- **equipe**: Conheça a nossa diretoria de especialistas.\n\n*Digite o que deseja saber de forma simples!*`;
      }
      else {
        fallbackResponse = `**Olá!** Entendi sua pergunta. Na **P2P Cabeamento Estruturado**, atuamos sob estrita conformidade de engenharia de rede metálica blindada e óptica.\n\nPara perguntas complexas integradas a um modelo avançado, adicione sua **GEMINI_API_KEY** na aba de Segredos (Settings > Secrets) no AI Studio.\n\n*Dica: Digite "ajuda" para ver os tópicos que posso te responder agora mesmo sem IA!*`;
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
        setLoading(false);
      }, 100);
      return;
    }

    setLoading(false);
  };

  const submitSimulationPrompt = () => {
    const prompt = `[SIMULAÇÃO] Por favor, realize um cálculo técnico analítico com estimativas de custos detalhadas e justificativas de conformidade de normas para o seguinte projeto personalizado:\n\n- Pontos Metálicos de Rede Cat6A: **${numPoints}**\n- Distância de Enlace de Fibra Óptica Monomodo OS2: **${fiberDistance} metros**\n- Necessidade de Aterramento Equipotencial dos Racks Metálicos de CPD: **${useGrounding ? "SIM (ABNT NBR 5410)" : "NÃO"}**`;
    handleSend(prompt);
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Histórico reiniciado. Escolha uma das abas superiores ou faça uma pergunta sobre engenharia de cabeamento.'
      }
    ]);
    setInputValue('');
    setApiError(null);
  };

  return (
    <div id="ai-copilot-container" className="bg-[#09090b] border border-zinc-900 rounded-none h-[570px] flex flex-col justify-between overflow-hidden shadow-2xl relative">
      
      {/* Tab bar header */}
      <div className="bg-[#0b0b0e] border-b border-zinc-900 flex flex-col shrink-0">
        
        {/* Core title and reset actions */}
        <div className="p-3.5 flex justify-between items-center border-b border-zinc-900/40">
          <div className="flex items-center gap-2">
            <div className="p-1 px-1.5 bg-white text-black rounded-none flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.16em] text-white flex items-center gap-1.5">
                P2P Co-Piloto ABNT
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </h4>
              <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider block">Estudo & Dimensionamento Orçamentário</span>
            </div>
          </div>

          <button 
            onClick={handleReset}
            title="Reiniciar conversa"
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900/60 rounded-none border border-zinc-900 hover:border-zinc-800 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 text-center text-[10px] font-sans font-bold text-zinc-500 divide-x divide-zinc-900">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 transition flex items-center justify-center gap-1.5 cursor-pointer select-none rounded-none outline-none ${activeTab === 'chat' ? 'bg-[#0e0e12] text-white font-black border-b border-b-emerald-400' : 'hover:bg-[#0c0c0e] hover:text-zinc-300'}`}
          >
            <MessageSquare className="w-3 h-3" />
            CONVERSAR
          </button>
          
          <button 
            onClick={() => setActiveTab('normas')}
            className={`py-2.5 transition flex items-center justify-center gap-1.5 cursor-pointer select-none rounded-none outline-none ${activeTab === 'normas' ? 'bg-[#0e0e12] text-white font-black border-b border-b-emerald-400' : 'hover:bg-[#0c0c0e] hover:text-zinc-300'}`}
          >
            <Shield className="w-3 h-3" />
            NORMAS ABNT
          </button>

          <button 
            onClick={() => setActiveTab('simulador')}
            className={`py-2.5 transition flex items-center justify-center gap-1.5 cursor-pointer select-none rounded-none outline-none ${activeTab === 'simulador' ? 'bg-[#0e0e12] text-white font-black border-b border-b-emerald-400' : 'hover:bg-[#0c0c0e] hover:text-zinc-300'}`}
          >
            <Sliders className="w-3 h-3" />
            SIMULADOR
          </button>
        </div>
      </div>

      {/* Main Panel Content container */}
      <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ACTIVE CHAT */}
          {activeTab === 'chat' && (
            <motion.div 
              key="chat-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col min-h-0"
              style={{ contentVisibility: 'auto' }}
            >
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 text-xs ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`p-3 rounded-none border leading-relaxed max-w-[88%] font-sans ${
                      m.role === 'user'
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-200 shadow-sm'
                        : 'bg-zinc-900/35 border-zinc-900/60 text-zinc-400'
                    }`}>
                      {/* Markdown parsing element with clear headings */}
                      <div className="space-y-2 text-[10.5px] whitespace-pre-wrap leading-relaxed">
                        {m.content.split('\n').map((line, lIdx) => {
                          // Filter markdown level 3 headers
                          if (line.startsWith('### ')) {
                            return (
                              <h5 key={lIdx} className="text-white font-sans font-extrabold text-[11px] uppercase tracking-wider mt-3 pb-1 border-b border-zinc-900">
                                {line.replace('### ', '')}
                              </h5>
                            );
                          }
                          // Filter separator line
                          if (line.trim() === '---') {
                            return <hr key={lIdx} className="border-t border-zinc-900 my-2" />;
                          }
                          // Check lists bullet points
                          if (line.match(/^-\s+/) || line.match(/^\*\s+/)) {
                            const trimmedLine = line.replace(/^[-\*]\s+/, '');
                            return (
                              <div key={lIdx} className="pl-3.5 flex gap-2 items-start mt-1">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span className="flex-1 text-zinc-400 leading-normal">{parseLineFormat(trimmedLine)}</span>
                              </div>
                            );
                          }
                          // Number lines format
                          if (line.match(/^\d+\.\s+/)) {
                            const prefix = line.match(/^\d+\.\s+/)?.[0] || '';
                            return (
                              <div key={lIdx} className="pl-3.5 flex gap-2 items-start mt-1.5">
                                <span className="text-emerald-400 font-mono font-bold">{prefix}</span>
                                <span className="flex-1 text-zinc-400 leading-normal">{parseLineFormat(line.replace(/^\d+\.\s+/, ''))}</span>
                              </div>
                            );
                          }
                          return <p key={lIdx} className="leading-relaxed">{parseLineFormat(line)}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* API Warning banner (collapsible styled detail) */}
                {apiError && (
                  <div className="bg-amber-950/20 border border-amber-900/50 p-3 text-[10px] text-amber-500 font-sans flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <div className="space-y-1">
                      <span className="font-extrabold uppercase tracking-wider block">Modo Simulação Inteligente</span>
                      <p className="leading-normal text-[10px] text-zinc-450">
                        O Co-Piloto opera via parâmetros regulatórios locais nativos do Amapá. Adicione <code className="text-white font-mono bg-amber-900/30 px-1 py-0.5 text-[9.5px]">GEMINI_API_KEY</code> nos Segredos do AI Studio para habilitar a IA consultora avançada.
                      </p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex gap-2.5 items-center p-2.5 text-[10px] text-zinc-500 font-mono tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>CALCULANDO DIRETRIZES DE ENGENHARIA...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Presets recommenders at the bottom of Chat if history is short */}
              {messages.length === 1 && (
                <div className="mt-auto pt-3 border-t border-zinc-900/40 shrink-0 flex flex-col gap-2">
                  <span className="text-[7.5px] font-mono uppercase tracking-[0.15em] text-zinc-500 block">BIBLIOTECA INTERATIVA DE QUESTÕES DA IA:</span>
                  
                  {/* Category switcher tabs */}
                  <div className="flex flex-wrap gap-1">
                    {PRESET_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActivePresetCategory(cat.id as any)}
                        className={`text-[8px] md:text-[8.5px] px-1.5 py-0.5 font-mono uppercase tracking-wider transition cursor-pointer ${
                          activePresetCategory === cat.id 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Active category's questions */}
                  <div className="grid grid-cols-1 gap-1">
                    {PRESET_CATEGORIES.find(c => c.id === activePresetCategory)?.questions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        type="button"
                        onClick={() => handleSend(q.text)}
                        className="text-[9.5px] text-left text-zinc-300 hover:text-white bg-[#070709] hover:bg-zinc-900/60 p-2 border border-zinc-900 hover:border-zinc-800 transition cursor-pointer font-sans rounded-none font-medium block w-full group relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{q.label}</span>
                          <span className="text-[8px] font-mono text-zinc-600 group-hover:text-emerald-400 transition ml-auto shrink-0">Perguntar →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: NORMATIVAS ABNT CHEATSHEET */}
          {activeTab === 'normas' && (
            <motion.div 
              key="normas-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto p-4 space-y-4 focus-visible:outline-none"
            >
              <div className="space-y-3 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-white">Manual Rápido de Normas Governamentais</h5>
                </div>
                <p className="text-[10.5px] text-zinc-500 leading-normal">
                  Consulte os parâmetros de instalação corporativa segundo o ordenamento técnico da ABNT. Clique em qualquer norma para questionar nossa IA especialista.
                </p>
              </div>

              <div className="space-y-3">
                {NORMAS_LIST.map((norma, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-[#070709] border border-zinc-900 hover:border-zinc-800 transition-colors duration-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-900/50 mb-2">
                        <span className="font-mono text-[10px] font-black text-white uppercase tracking-wider">{norma.code}</span>
                        <span className="text-[8px] font-mono uppercase bg-emerald-950/20 text-emerald-400 px-1.5 py-0.5 border border-emerald-900/20">VIGENTE</span>
                      </div>
                      <h6 className="text-[9.5px] font-sans font-bold text-zinc-300 uppercase tracking-wide leading-tight mb-2">
                        {norma.title}
                      </h6>
                      <ul className="space-y-1 pl-1">
                        {norma.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="text-[9px] text-zinc-400 leading-normal flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 mt-1.5 border-t border-zinc-900/50 flex justify-end">
                      <button 
                        onClick={() => handleSend(norma.prompt)}
                        className="text-[9px] font-bold text-emerald-400 hover:text-white bg-emerald-950/10 hover:bg-emerald-500/10 border border-emerald-900/30 px-2.5 py-1 transition cursor-pointer"
                      >
                        Perguntar Co-Piloto →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PRICE & PORTS SIMULATOR */}
          {activeTab === 'simulador' && (
            <motion.div 
              key="simulador-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-white">Simulador de Projeto Corporativo</h5>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Ajuste os parâmetros abaixo para gerar instantaneamente um laudo analítico de orçamento sob normas ABNT e garantia estendida P2P de excelência.
                  </p>
                </div>

                {/* Input 1: Points */}
                <div className="space-y-2 bg-[#070709] p-3 border border-zinc-900">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider font-bold">Tomadas Metálicas Cat6A:</span>
                    <span className="text-white font-black text-xs">{numPoints} Pontos</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setNumPoints(prev => Math.max(12, prev - 12))}
                      disabled={numPoints <= 12}
                      className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    
                    <input 
                      type="range" 
                      min="12" 
                      max="192" 
                      step="12"
                      value={numPoints}
                      onChange={(e) => setNumPoints(Number(e.target.value))}
                      className="flex-1 accent-white" 
                    />

                    <button 
                      onClick={() => setNumPoints(prev => Math.min(192, prev + 12))}
                      disabled={numPoints >= 192}
                      className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wide block mt-1">Conforme NBR 14565 (Mínimo recomendado de 1 ponto/10m²)</span>
                </div>

                {/* Input 2: Fiber Link distance */}
                <div className="space-y-2 bg-[#070709] p-3 border border-zinc-900">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider font-bold">Vão de Fibra Óptica OS2:</span>
                    <span className="text-white font-black text-xs">{fiberDistance} metros</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setFiberDistance(prev => Math.max(50, prev - 25))}
                      disabled={fiberDistance <= 50}
                      className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-xs font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    
                    <input 
                      type="range" 
                      min="50" 
                      max="600" 
                      step="25"
                      value={fiberDistance}
                      onChange={(e) => setFiberDistance(Number(e.target.value))}
                      className="flex-1 accent-white" 
                    />

                    <button 
                      onClick={() => setFiberDistance(prev => Math.min(600, prev + 25))}
                      disabled={fiberDistance >= 600}
                      className="p-1 px-2.5 bg-zinc-950 hover:bg-zinc-900 text-white border border-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer text-xs font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wide block mt-1">Enlace subterrâneo com proteção anti-umidade PE-AD</span>
                </div>

                {/* Input 3: Checkbox NBR 5410 Grounding */}
                <div className="flex items-center justify-between p-3.5 bg-[#070709] border border-zinc-900 text-[10px] font-mono text-zinc-400 uppercase">
                  <span className="font-bold tracking-wider">Aterramento de Racks (NBR 5410):</span>
                  <button 
                    onClick={() => setUseGrounding(!useGrounding)}
                    className={`px-3 py-1 text-[9px] font-bold border transition duration-200 cursor-pointer ${
                      useGrounding 
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                    }`}
                  >
                    {useGrounding ? 'ATIVO (RECOMENDADO)' : 'DESATIVADO'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900/60 mt-auto">
                <button
                  onClick={submitSimulationPrompt}
                  className="w-full py-3 bg-white hover:bg-transparent text-black hover:text-white border border-white text-[10px] font-black uppercase tracking-[0.18em] transition duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  GERAR ORÇAMENTO TÉCNICO
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Standard Form Footer for user standard inputs */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-900 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Interaja com o Co-Piloto especialista..."
            disabled={loading}
            className="flex-1 bg-[#09090b] border border-zinc-900 hover:border-zinc-850 focus:border-zinc-700 text-xs text-white px-3 py-2.5 rounded-none outline-none font-sans placeholder-zinc-600 transition"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className={`px-4 bg-white text-black border border-white flex items-center justify-center cursor-pointer transition ${
              inputValue.trim() && !loading ? 'hover:bg-transparent hover:text-white' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}

// Simple text converter for markdown formatting (**bold** and *italic*) or inline code
function parseLineFormat(text: string) {
  if (!text) return '';
  const parts = [];
  let currentIdx = 0;

  // regex to match markdown elements: bold (**text**), code (`text`), italic (*text*)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchStr = match[0];
    const matchIndex = match.index;

    // push plain text before match
    if (matchIndex > currentIdx) {
      parts.push(text.substring(currentIdx, matchIndex));
    }

    if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
      parts.push(<strong key={matchIndex} className="text-white font-black">{matchStr.substring(2, matchStr.length - 2)}</strong>);
    } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
      parts.push(<em key={matchIndex} className="text-zinc-200 italic">{matchStr.substring(1, matchStr.length - 1)}</em>);
    } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
      parts.push(<code key={matchIndex} className="bg-zinc-900 border border-zinc-850 text-emerald-400 font-mono px-1 py-0.5 rounded text-[9.5px]">{matchStr.substring(1, matchStr.length - 1)}</code>);
    }

    currentIdx = regex.lastIndex;
  }

  if (currentIdx < text.length) {
    parts.push(text.substring(currentIdx));
  }

  return parts.length > 0 ? parts : text;
}
