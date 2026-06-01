/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Building, Equipment, TeamMember, CablingService } from './types';

export const COMPANHIA = {
  nome: "P2P Cabeamento Estruturado",
  slogan: "Interligando negócios com a robustez e a segurança das normas brasileiras.",
  descricaoCurta: "Especialista nacional em infraestrutura de dados, engenharia de cabo óptico e conformidade total com as normas da ABNT NBR 14565 e NBR 5410.",
  historia: "A P2P é uma integradora de capital 100% brasileiro fundada no Amapá. Projetamos e executamos redes físicas de missão crítica respeitando estritamente o código normativo brasileiro — sob as diretrizes vigentes da ABNT NBR 14565 e NBR 5410 (para segurança de malhas e aterramentos elétricos de CPD), garantindo compatibilidade complementar com referências internacionais (ANSI/TIA-568-D). Mitigamos perdas ópticas e gargalos para impulsionar a soberania e a eficiência do parque tecnológico regional."
};

// Option A: Dois prédios interligados (Bloco de Operações e CPD Central)
export const INFRA_GERAL = {
  opcao: "Opção A — Dois Prédios Interligados",
  cenario: "Bloco de Operações e CPD Central",
  distanciaInterpredial: 120, // metros
  meioFisicoInterconexao: "Cabo de Fibra Óptica Monomodo (OS2) de 4 Fibras para ambiente externo protegida por conduíte PE-AD subterrâneo.",
  capacidadeInterconexao: "10 Gbps bidirecionais via transceptores SFP+ 10GBASE-LR executados em chassi de switches gerenciáveis.",
  normasAtendidas: [
    "ABNT NBR 14565: Cabeamento estruturado brasileiro para edifícios comerciais (norma principal).",
    "ABNT NBR 5410: Instalações elétricas de baixa tensão (aplicada à equipotencialização de racks).",
    "ABNT NBR 16869: Tecnologia da Informação — Ensaios de cabeamento estruturado e verificação de canais.",
    "ANSI/TIA-568.0-D / ANSI/TIA-568.1-D: Padrão americano utilizado para parametrização internacional complementar.",
    "ANSI/TIA-569-D / ANSI/TIA-606-C: Recomendações de rotas físicas e identificação padronizada de portas."
  ]
};

export const BUILDINGS: Building[] = [
  {
    id: "predio-1",
    name: "Prédio 1 — Bloco de Operações",
    purpose: "Atendimento presencial corporativo, triagens de requisição e serviços integrados locais.",
    floorCount: 1,
    rackModel: "Rack de Piso TIA-19\" 24U (Profundidade 670mm)",
    description: "Ambiente que requer foco em imunidade contra interferências eletromagnéticas e alta cobertura de pontos para computadores de atendimento e conexão VoIP.",
    coordinates: { x: 25, y: 50 },
    rooms: [
      {
        id: "p1-r1",
        name: "Recepção & Triagem de Chamados",
        networkPoints: 4, // computadores, impressoras de senha
        voipPoints: 2,
        apPoints: 1, // Wi-Fi público/privado separado por VLAN
        cctvPoints: 2, // câmeras IP de alta definição
        cablingType: "Cat6A F/UTP (Blindado)",
        description: "Entrada principal, alto tráfego de usuários. Pontos blindados evitam ruídos eletromagnéticos."
      },
      {
        id: "p1-r2",
        name: "Salas de Trabalho e Operações",
        networkPoints: 6, // 3 salas, 2 pontos por mesa
        voipPoints: 3,
        apPoints: 1,
        cctvPoints: 0,
        cablingType: "Cat6A F/UTP",
        description: "Área de estações de trabalho comerciais, acesso veloz ao banco de dados do servidor central."
      },
      {
        id: "p1-r3",
        name: "Laboratório de Engenharia & Qualidade",
        networkPoints: 4, // ligação direta com computadores de teste e equipamentos de bancada
        voipPoints: 1,
        apPoints: 0,
        cctvPoints: 1,
        cablingType: "Cat6A F/UTP (Blindado)",
        description: "Salas de testes técnicos com equipamentos. Exige banda estável para transferência de arquivos em massa e telemetria."
      },
      {
        id: "p1-r4",
        name: "Administração Geral",
        networkPoints: 4, // faturamento, RH e estoque
        voipPoints: 2,
        apPoints: 1,
        cctvPoints: 1,
        cablingType: "Cat6A F/UTP",
        description: "Gestão operacional local, acesso às planilhas internas e ao ERP unificado."
      }
    ]
  },
  {
    id: "predio-2",
    name: "Prédio 2 — Centro de Processamento & CPD",
    purpose: "Administração central, controladoria, diretoria e datacenter centralizador da infraestrutura (CPD).",
    floorCount: 1,
    rackModel: "Rack Fechado de Servidor TIA-19\" 42U (Profundidade 1000mm)",
    description: "Centro nervoso lógico de toda a rede. Hospeda o switch core principal, o gateway de internet, servidores de arquivos redundantes e processamento corporativo seguro.",
    coordinates: { x: 75, y: 50 },
    rooms: [
      {
        id: "p2-r1",
        name: "Setor de Suporte & Faturamento",
        networkPoints: 4, // computadores de faturamento, impressoras de rede
        voipPoints: 2,
        apPoints: 1,
        cctvPoints: 2, // monitoramento constante de valores
        cablingType: "Cat6A F/UTP",
        description: "Operações corporativas imediatas, alta prioridade de QoS para transações operacionais e baixíssima latência."
      },
      {
        id: "p2-r2",
        name: "Controladoria & Planejamento",
        networkPoints: 8, // analistas fiscais e contábeis
        voipPoints: 4,
        apPoints: 1,
        cctvPoints: 1,
        cablingType: "Cat6A F/UTP",
        description: "Processamento de rotinas operacionais, balanços mensais e integração direta com o ERP do grupo corporativo."
      },
      {
        id: "p2-r3",
        name: "Diretoria & Reuniões",
        networkPoints: 4, // mesa diretora, mesa de videoconferência
        voipPoints: 2,
        apPoints: 1,
        cctvPoints: 1,
        cablingType: "Cat6A F/UTP",
        description: "Videoconferências em 4K sem lag, acesso imediato a painéis de BI e relatórios consolidados."
      },
      {
        id: "p2-r4",
        name: "CPD & Sala de Servidores",
        networkPoints: 12, // conexões de servidores e uplink switches
        voipPoints: 1, // telefone IP de manutenção
        apPoints: 1,
        cctvPoints: 2, // controle de acesso por vídeo biométrico
        cablingType: "Cat6A F/UTP & Patch Cords Monomodo Duplex",
        description: "Sala de Servidores com piso elevado, ar condicionado de precisão, nobreak senoidal, gerador externo e patch panels com DIO óptico centralizador da interligação."
      }
    ]
  }
];

export const SERVICES: CablingService[] = [
  {
    id: "vistoria-tecnica",
    title: "Vistoria e Mapeamento de Campo (Site Survey)",
    shortDesc: "Inspeção técnica consultiva farta, mapeamento tridimencional de caminhos e infraestrutura física.",
    fullDesc: "Antes de iniciar qualquer lançamento de rede, realizamos uma vistoria em campo minuciosa e sem custo oculto. Traçamos perfis térmicos e barreiras de atenuação para o Wi-Fi corporativo, inspecionamos caixas de passagem subterrâneas, furações de laje (shafts prediais) e as condições térmicas e elétricas das salas de CPD (aterramentos, blindagem e climatização).",
    benefits: [
      "Evita 99% de atrasos ou estouro de orçamento por caminhos obstruídos.",
      "Mapeamento de cobertura com simulação de atenuação de barreiras sólidas (paredes, lajes).",
      "Relatório descritivo inicial detalhando a viabilidade geométrica e física do espaço."
    ],
    specs: [
      "Medições milimétricas a laser de distorções e caminhos físicos de calhas secundárias.",
      "Dimensionamento das taxas de ocupação ideal de eletrodutos segundo a ABNT NBR 14565.",
      "Laudo fotográfico do estado físico estrutural para aprovação prévia em reuniões diretivas."
    ]
  },
  {
    id: "revisao-auditoria",
    title: "Revisão, Diagnóstico e Auditoria de Redes",
    shortDesc: "Correção de gargalos silenciosos de lentidão, substituição preventiva e redesenho ativo de CPDs caóticos.",
    fullDesc: "Sua rede atual sofre com quedas inexplicáveis ou instabilidade em determinados horários? Analisamos toda a integridade física de cabos oxidados, dobras incorretas e links lógicos mal configurados. Realizamos o redesenho físico e lógico (VLANs, segurança e QoS) para que sua empresa atinja o máximo potencial prático do cabeamento existente.",
    benefits: [
      "Identificação precisa e correção imediata de loops lógicos e pontos congestionados.",
      "Transformação visual e reorganização de racks caóticos (estilo 'ninho de cobras').",
      "Eliminação do tempo ocioso corporativo (downtime) com melhoria gritante de desempenho."
    ],
    specs: [
      "Mapeamento lógico de portas com remanejamento rápido (port-patching) estruturado.",
      "Checklist detalhado de atenuação metálica e oxidação em tomadas RJ-45 Keystone.",
      "Emissão de parecer pericial apontando riscos de interrupções físicas perigosas no CPD."
    ]
  },
  {
    id: "cab-estruturado",
    title: "Cabeamento Estruturado Metálico (Cat6A)",
    shortDesc: "Infraestrutura de dados e voz de altíssima confiabilidade e imunidade a ruídos.",
    fullDesc: "Implantação de redes metálicas de alta performance utilizando cabos blindados Cat6A para taxas de transmissão estáveis até 10 Gbps. Planejamos o trajeto de calhas, eletrodutos de aço galvanizado, fixações seguras em bandoletes e canaletas de PVC de alta resistência mecânica, respeitando totalmente o raio de curvatura exigido pelas normas técnicas.",
    benefits: [
      "Suporte a taxas de dados de até 10 Gbps a 100 metros de distância.",
      "Redução drástica do ruído eletromagnético em ambientes industriais ou corporativos de alta densidade.",
      "Identificação padronizada por cores das tomadas RJ-45 Keystone de acordo com T568B."
    ],
    specs: [
      "Tomadas blindadas padrão Keystone RJ-45 Cat6A.",
      "Sistemas de identificação segundo norma ANSI/TIA-606-C.",
      "Instalação de tomadas em caixas de sobrepor ou embutidas com acabamento elegante."
    ]
  },
  {
    id: "fibra-backbone",
    title: "Interconexão Óptica de Alto Desempenho",
    shortDesc: "Enlaces de fibra óptica monomodo (OS2) subterrâneos com estabilidade total.",
    fullDesc: "Desenho e execução de conexões de alta velocidade entre racks localizados em edifícios separados através de caminhos subterrâneos robustos. A blindagem ambiental do conduíte subterrâneo PE-AD garante proteção prolongada contra umidade de águas subterrâneas (típicas da região norte), além de oferecer fusões ópticas estáveis com perdas de inserção menores de 0.1 dB por emenda.",
    benefits: [
      "Isolamento elétrico total, eliminando completamente diferenças de potencial de aterramento.",
      "Imunidade absoluta a raios, intempéries e indução eletromagnética interpredial.",
      "Sinal óptico estável de longa distância com largura de banda praticamente ilimitada."
    ],
    specs: [
      "Fusões ópticas realizadas com máquina profissional de alinhamento pelo núcleo.",
      "Distribuidor Interno Óptico (DIO) montado em rack TIA-19 polegadas.",
      "Transceptores ópticos SFP+ Monomodo de 10 Gbps com conectação duplex LC/UPC."
    ]
  },
  {
    id: "certificacao-redes",
    title: "Certificação de Canais com Fluke Networks",
    shortDesc: "Emissão de relatórios e laudos técnicos oficiais com validade internacional.",
    fullDesc: "Garantia formal de excelência técnica. Testamos todos os links de cobre Cat6A e fibra óptica OS2 instalados usando testadores certificados da marca Fluke Networks. Identificamos com precisão perdas de retorno, nível de diafonia (NEXT, FEXT), comprimento físico e taxa de atenuação óptica para garantir ao cliente a aprovação no teste de integridade.",
    benefits: [
      "Garantia de 15 a 25 anos do fabricante sobre os materiais instalados.",
      "Prevenção ativa de perdas microscópicas de conexão que geram lentidão silenciosa.",
      "Entrega de relatórios analíticos PDF oficiais de cada ponto testado."
    ],
    specs: [
      "Testes de perda de inserção óptica (OTDR e Power Meter).",
      "Medições detalhadas de NEXT, PS-NEXT, ACR-F e Atenuação de canais Cat6A.",
      "Certificação assinada por Engenheiro de Telecomunicações devidamente registrado no CREA."
    ]
  }
];

export const EQUIPMENT_LIST: Equipment[] = [
  // Redes Metálicas Cat6A
  {
    id: "eq-cabo-cat6a",
    name: "Cabo Metálico Furukawa Cat6A F/UTP (Blindado) LSZH Azul",
    brand: "Furukawa SOHOPLUS",
    quantity: 6, // caixas de 305m (total aprox 1830m)
    unitPrice: 1650.00,
    category: "passive",
    specs: "Cabo blindado contra interferências eletromagnéticas, capa retardante a chamas livre de halogênios (LSZH)."
  },
  {
    id: "eq-patchpanel-cat6a",
    name: "Patch Panel Blindado Cat6A 24 Portas 1U Descarregado TIA-19\"",
    brand: "Furukawa",
    quantity: 2,
    unitPrice: 580.00,
    category: "passive",
    specs: "Aço de alta resistência, suporte de aterramento traseiro, 1U para racks padrão ANSI/TIA de 19 polegadas."
  },
  {
    id: "eq-keystone-cat6a",
    name: "Conector Keystone RJ-45 Fêmea Cat6A Blindado Metálico",
    brand: "Furukawa",
    quantity: 48, // 48 pontos ao total nos dois prédios
    unitPrice: 38.00,
    category: "passive",
    specs: "Acoplamento blindado 360 graus de contato contínuo contra atenuação e ruído alien crosstalk."
  },
  {
    id: "eq-patchcord-cat6a",
    name: "Patch Cord Cat6A Shilded 1.5 metros Azul (Ligação Switch x Panel)",
    brand: "Furukawa",
    quantity: 48,
    unitPrice: 42.00,
    category: "passive",
    specs: "Condutores multifilares de cobre estanhado, capa de proteção injetada anti-estrangulamento."
  },

  // Backbone Óptico (Interligação)
  {
    id: "eq-cabo-fibra",
    name: "Cabo Óptico Monomodo OS2 Outdoor 4 Fibras Sm Geleado CFOAC-SM",
    brand: "Furukawa COG",
    quantity: 150, // 150 metros (120m vão real + 30m margem de fusão/sobras)
    unitPrice: 8.50,
    category: "passive",
    specs: "Fibra monomodo com proteção contra umidade, resistente a intemperies térmicas externas do norte e raios UV."
  },
  {
    id: "eq-dio-munt",
    name: "Distribuidor Interno Óptico (DIO) de Parede/Rack 1U Completo",
    brand: "Furukawa",
    quantity: 2,
    unitPrice: 450.00,
    category: "passive",
    specs: "Bandejas para acomodação de fusão, adaptadores ópticos LC simplex/duplex, gaveta deslizante."
  },
  {
    id: "eq-pigtail-lc",
    name: "Kit Pigtail Óptico Monomodo SM LC/UPC 1.5m",
    brand: "Intelbras",
    quantity: 2,
    unitPrice: 120.00,
    category: "passive",
    specs: "Adaptador óptico monomodo simples com baixíssima atenuação para fusão no DIO."
  },
  {
    id: "eq-patchcord-opt",
    name: "Cordão Óptico Duplex Monomodo LC-LC 2.0 metros OS2",
    brand: "Furukawa",
    quantity: 4,
    unitPrice: 85.00,
    category: "passive",
    specs: "Transmissão duplex simultânea de dados ópticos de alta integridade."
  },

  // Racks de Telecomunicações & Infra
  {
    id: "eq-rack-p1",
    name: "Rack de Piso TIA-19\" 24U - Bloco de Operações",
    brand: "MaxEletron",
    quantity: 1,
    unitPrice: 1650.00,
    category: "infra",
    specs: "Porta dianteira de acrílico visível, guias laterais organizadoras, base soleira de metal."
  },
  {
    id: "eq-rack-p2",
    name: "Rack Fechado de Servidor 19\" 42U - CPD Principal",
    brand: "MaxEletron",
    quantity: 1,
    unitPrice: 3400.00,
    category: "infra",
    specs: "Portas perfuradas de aço (colmeia) para exaustão de servidores, duas réguas de tomada 12 saídas integradas."
  },
  {
    id: "eq-guias-cabo",
    name: "Organizador de Cabos Horizontal 1U Argolas Fechadas",
    brand: "Furukawa",
    quantity: 6,
    unitPrice: 65.00,
    category: "infra",
    specs: "Aço tratado, pintura epóxi preta, guia e esconde cabos de remanejamento."
  },
  {
    id: "eq-conduite-pead",
    name: "Eletroduto Flexível PE-AD Subterrâneo Termoplástico 1.1/4\"",
    brand: "Kanalex",
    quantity: 120, // 120 metros de vala externa
    unitPrice: 18.00,
    category: "infra",
    specs: "Eletroduto resistente a pressões de terreno e infiltrações pluviais severas."
  },

  // Equipamentos Ativos (Atendimento da Rede)
  {
    id: "eq-switch-core",
    name: "Switch Gerenciável L3 PoE+ 24 Portas Gigabit + 4 Portas SFP+ 10G",
    brand: "Ubiquiti UniFi Pro 24",
    quantity: 2, // 1 switch para cada rack nos dois prédios
    unitPrice: 6300.00,
    category: "active",
    specs: "Switches gerenciados L3, suporte a VLAN redundante, PoE ativo para Access Points e Câmeras VoIP."
  },
  {
    id: "eq-transceptor-sfp",
    name: "Transceptor Óptico SFP+ 10GBASE-LR Monomodo 1310nm LC 10km",
    brand: "Ubiquiti 10G",
    quantity: 4, // 2 para ativação duplex primária + 2 de substituição preventiva
    unitPrice: 320.00,
    category: "active",
    specs: "Módulo conectável a quente (Hot-swappable) com alcance padrão de até 10km de alta fidelidade."
  },
  {
    id: "eq-router-firewall",
    name: "Roteador Firewall UniFi Dream Machine Pro Gateway Enterprise",
    brand: "Ubiquiti",
    quantity: 1, // fica na sala CPD do prédio centralizador (Prédio 2)
    unitPrice: 5900.00,
    category: "active",
    specs: "Firewall Gigabit, controlador de rede ativo integrado, baia para disco rígido gravador de Câmeras CFTV."
  },
  {
    id: "eq-ap-uni",
    name: "Access Point UniFi U6 Lite Dual-Band Wi-Fi 6 MIMO PoE",
    brand: "Ubiquiti Network",
    quantity: 8, // 3 no Prédio 1 + 5 no Prédio 2 (atendimento wireless total)
    unitPrice: 1100.00,
    category: "active",
    specs: "Aparelho Wi-Fi 6 de montagem em teto, suporte a roaming automático sem queda de sinal nas dependências corporativas."
  }
];

export const TEAM: TeamMember[] = [
  {
    name: "Alejandro Passos",
    role: "Sócio-Fundador e Diretor Geral Administrativo",
    skills: ["Norma ABNT NBR 14565", "Gestão Corporativa", "Planejamento Estratégico", "Certificação Fluke DSX-8000"],
    avatar: "AP",
    bio: "Co-fundador e Administrador Chefe da P2P. Coordena a viabilidade financeira do projeto, lidera o plano estratégico de portfólio físico, as relações comerciais e o blueprint lógico de missão crítica."
  },
  {
    name: "Diene Juliane",
    role: "Sócia-Fundadora e Diretora Chefe de Engenharia Física",
    skills: ["Fusão de Fibra OS2", "Segurança NBR 5410", "Aterramento e Racks", "Norma NBR 14565"],
    avatar: "DJ",
    bio: "Co-fundadora e Sócia Diretora Técnica. Responsável pela governança operacional, dimensionamento físico de caminhos e espaços, segurança de CPD e homologação de links ópticos."
  },
  {
    name: "Matheus Pinheiro",
    role: "Sócio-Fundador e Diretor de Auditoria e Testes",
    skills: ["Ensaios NBR 16869-1", "Análise de Faturamento", "Custo-Benefício Integrado", "CAD de Rede"],
    avatar: "MP",
    bio: "Co-fundador e Diretor de Homologação. Coordena a qualidade técnica final frente aos ensaios regulamentares da NBR 16869-1, emitindo os laudos periciais de conformidade."
  }
];
