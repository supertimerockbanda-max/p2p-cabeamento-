/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent, useEffect } from 'react';
import { EQUIPMENT_LIST, INFRA_GERAL, COMPANHIA } from '../data';
import { Equipment } from '../types';
import { 
  Calculator, Receipt, Plus, Minus, Check, Sparkles, Printer,
  Layers, Settings, Trash2, AlertTriangle, HelpCircle, ShieldCheck,
  FolderSync, LayoutGrid, Cpu, Cable, Server, ArrowRight, CheckCircle2,
  Bookmark, Award, ThumbsUp, Trash, Wifi, X, Leaf, Coins, Recycle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Expande o catálogo original com novos itens profissionais e opcionais relevantes
const COMPREHENSIVE_CATALOG: Omit<Equipment, 'quantity'>[] = [
  ...EQUIPMENT_LIST.map(e => ({
    id: e.id,
    name: e.name,
    brand: e.brand,
    unitPrice: e.unitPrice,
    category: e.category,
    specs: e.specs
  })),
  // Novos itens extras para enriquecer a simulação
  {
    id: "eq-nobreak-1500",
    name: "Nobreak Senoidal On-Line Dupla Conversão 1500VA TIA-19\"",
    brand: "Intelbras",
    unitPrice: 2490.00,
    category: "infra",
    specs: "Proteção contra oscilações severas, quedas de energia e descargas elétricas na rede."
  },
  {
    id: "eq-switch-48p-cat",
    name: "Switch Gerenciável L3 PoE+ 48 Portas Gigabit + 4 Portas SFP+ 10G",
    brand: "Ubiquiti UniFi",
    unitPrice: 9400.00,
    category: "active",
    specs: "Switch corporativo de altíssima densidade para expansão central de CPDs."
  },
  {
    id: "eq-protetor-surto",
    name: "Protetor Elétrico de Surto Ethernet RJ45 Blindado Gg",
    brand: "Clamper",
    unitPrice: 195.00,
    category: "passive",
    specs: "Dispositivo de surto para descargas induzidas em cabos de rede externos de CFTV."
  },
  {
    id: "eq-cam-cftv",
    name: "Câmera IP Dome 4MP Externa IR-30m Metálica PoE IP67",
    brand: "Intelbras VIP",
    unitPrice: 620.00,
    category: "active",
    specs: "Câmera de vigilância de alta definição com IP67 resistente à chuva e intempéries."
  },
  {
    id: "eq-calha-aram",
    name: "Eletrocalha Aramada Zincada Reforçada 100x50mm (por metro)",
    brand: "Valemam",
    unitPrice: 48.00,
    category: "infra",
    specs: "Encaminhamento aéreo ventilado dos feixes de cabos sob forros ou dutos técnicos."
  }
];

export default function BudgetCalculator({ students, activeTemplate }: { students?: any[], activeTemplate?: any }) {
  // Helper to resolve signature name dynamically from the student's name
  const getSignatureName = (fullName: string, defaultName: string) => {
    if (!fullName) return defaultName;
    const nameOnly = fullName.trim();
    if (!nameOnly || nameOnly.toLowerCase().startsWith("aluno integrante") || nameOnly.toLowerCase().startsWith("nome do aluno")) {
      return defaultName;
    }
    const parts = nameOnly.split(/\s+/);
    if (parts.length >= 3) {
      return `${parts[0][0]}. ${parts[1][0]}. ${parts[parts.length - 1]}`;
    } else if (parts.length === 2) {
      return `${parts[0][0]}. ${parts[1]}`;
    }
    return nameOnly;
  };
  // Itens atualmente adicionados ao projeto
  const [items, setItems] = useState<Equipment[]>(() => {
    // Inicializa com a lista padrão de equipamentos
    return EQUIPMENT_LIST.map(item => ({ ...item }));
  });

  const [fiberDistance, setFiberDistance] = useState<number>(INFRA_GERAL.distanciaInterpredial);
  const [includeCertification, setIncludeCertification] = useState<boolean>(true);
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'active' | 'passive' | 'infra'>('all');

  // PDF Proposal states
  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);
  const [clientCompany, setClientCompany] = useState<string>("MINISTÉRIO DA TECNOLOGIA - SUPERINTENDÊNCIA NORTE");
  const [projectTitle, setProjectTitle] = useState<string>("PROJETO DE REDE METÁLICA E BACKBONE DE ALTA DISPONIBILIDADE");
  const [includeGreenSelo, setIncludeGreenSelo] = useState<boolean>(true);
  const proposalCode = useMemo(() => `P2P-PROP-2026-${Math.floor(2140 + Math.random() * 6300)}-AP`, []);

  // Wizard States for automatic client guidance
  const [wizardNodes, setWizardNodes] = useState<number>(48);
  const [wizardFiberEnabled, setWizardFiberEnabled] = useState<boolean>(true);
  const [wizardWifi, setWizardWifi] = useState<'none' | 'basic' | 'standard' | 'high'>('standard');
  const [wizardUPS, setWizardUPS] = useState<boolean>(false);
  const [wizardCftv, setWizardCftv] = useState<'none' | 'basic' | 'full'>('none');

  // Centralized dynamic cart updater
  const syncCartFromWizard = (
    nodes: number,
    fiberEnabled: boolean,
    wifi: 'none' | 'basic' | 'standard' | 'high',
    ups: boolean,
    cftv: 'none' | 'basic' | 'full',
    currentDistance: number
  ) => {
    setAnalysisResult({ status: null, message: '', score: 0, points: [] });
    setItems(() => {
      const baseList = COMPREHENSIVE_CATALOG.map(baseItem => {
        // 1. RJ45 Cobre nodes & switches
        if (baseItem.id === "eq-keystone-cat6a" || baseItem.id === "eq-patchcord-cat6a") {
          return { ...baseItem, quantity: nodes };
        }
        if (baseItem.id === "eq-patchpanel-cat6a") {
          return { ...baseItem, quantity: Math.max(1, Math.ceil(nodes / 24)) };
        }
        if (baseItem.id === "eq-cabo-cat6a") {
          const boxesNeeded = Math.ceil((nodes * 35) / 305);
          return { ...baseItem, quantity: Math.max(1, boxesNeeded) };
        }
        if (baseItem.id === "eq-switch-core") {
          const switchesNeeded = Math.ceil(nodes / 24);
          return { ...baseItem, quantity: fiberEnabled ? Math.max(2, switchesNeeded) : Math.max(1, switchesNeeded) };
        }

        // 2. Fiber Interpredial
        if (baseItem.id === "eq-cabo-fibra") {
          return { ...baseItem, quantity: fiberEnabled ? currentDistance + 30 : 0 };
        }
        if (baseItem.id === "eq-conduite-pead") {
          return { ...baseItem, quantity: fiberEnabled ? currentDistance : 0 };
        }
        if (["eq-dio-munt", "eq-pigtail-lc", "eq-patchcord-opt", "eq-transceptor-sfp"].includes(baseItem.id)) {
          return { ...baseItem, quantity: fiberEnabled ? (baseItem.id === "eq-pigtail-lc" ? 4 : 2) : 0 };
        }

        // 3. Wi-Fi APs
        if (baseItem.id === "eq-ap-uni") {
          let qty = 0;
          if (wifi === 'basic') qty = 2;
          else if (wifi === 'standard') qty = 4;
          else if (wifi === 'high') qty = 8;
          return { ...baseItem, quantity: qty };
        }

        // 4. Nobreak Backup
        if (baseItem.id === "eq-nobreak-1500") {
          return { ...baseItem, quantity: ups ? 1 : 0 };
        }

        // 5. CFTV & Surge Protection
        if (baseItem.id === "eq-cam-cftv") {
          return { ...baseItem, quantity: cftv === 'basic' ? 4 : cftv === 'full' ? 8 : 0 };
        }
        if (baseItem.id === "eq-protetor-surto") {
          return { ...baseItem, quantity: cftv === 'basic' ? 4 : cftv === 'full' ? 8 : 0 };
        }

        // Keep normal default items
        if (baseItem.id.includes("rack") || baseItem.name.toLowerCase().includes("rack")) {
          return { ...baseItem, quantity: fiberEnabled || nodes > 48 ? 2 : 1 };
        }

        const existing = items.find(i => i.id === baseItem.id);
        const prevQty = existing ? existing.quantity : 0;
        return { ...baseItem, quantity: prevQty || (baseItem.id === "eq-fita-ident" ? 2 : 0) };
      });

      return baseList.filter(item => item.quantity > 0);
    });
  };

  const handleWizardNodesChange = (v: number) => {
    setWizardNodes(v);
    syncCartFromWizard(v, wizardFiberEnabled, wizardWifi, wizardUPS, wizardCftv, fiberDistance);
  };
  const handleWizardFiberChange = (enabled: boolean) => {
    setWizardFiberEnabled(enabled);
    const dist = enabled ? (fiberDistance > 0 ? fiberDistance : 120) : 0;
    if (enabled && fiberDistance === 0) {
      setFiberDistance(120);
    } else if (!enabled) {
      setFiberDistance(0);
    }
    syncCartFromWizard(wizardNodes, enabled, wizardWifi, wizardUPS, wizardCftv, dist);
  };
  const handleWizardWifiChange = (v: 'none' | 'basic' | 'standard' | 'high') => {
    setWizardWifi(v);
    syncCartFromWizard(wizardNodes, wizardFiberEnabled, v, wizardUPS, wizardCftv, fiberDistance);
  };
  const handleWizardUPSChange = (enabled: boolean) => {
    setWizardUPS(enabled);
    syncCartFromWizard(wizardNodes, wizardFiberEnabled, wizardWifi, enabled, wizardCftv, fiberDistance);
  };
  const handleWizardCftvChange = (v: 'none' | 'basic' | 'full') => {
    setWizardCftv(v);
    syncCartFromWizard(wizardNodes, wizardFiberEnabled, wizardWifi, wizardUPS, v, fiberDistance);
  };

  // Sincroniza o modelo (template) escolhido na galeria com o simulador
  useEffect(() => {
    if (activeTemplate) {
      setAnalysisResult({ status: null, message: '', score: 0, points: [] });
      setFiberDistance(activeTemplate.fiberLength);
      setIncludeCertification(true);

      // Sync wizard state selectors
      const nodeCount = activeTemplate.nodeCount || 48;
      setWizardNodes(nodeCount);

      const hasFiber = activeTemplate.fiberLength > 0;
      setWizardFiberEnabled(hasFiber);

      let wifiSetting: 'none' | 'basic' | 'standard' | 'high' = 'standard';
      if (activeTemplate.id === "tpl-campus") {
        wifiSetting = 'high';
      } else if (activeTemplate.id === "tpl-datacenter") {
        wifiSetting = 'basic';
      } else if (activeTemplate.id === "tpl-logistica") {
        wifiSetting = 'standard';
      } else if (activeTemplate.id === "tpl-laboratorio") {
        wifiSetting = 'none';
      }
      setWizardWifi(wifiSetting);

      const hasUpsSetting = activeTemplate.id === "tpl-datacenter";
      setWizardUPS(hasUpsSetting);

      const cftvSetting: 'none' | 'basic' | 'full' = activeTemplate.id === "tpl-datacenter" ? 'basic' : 'none';
      setWizardCftv(cftvSetting);
      
      setItems(() => {
        const baseList = EQUIPMENT_LIST.map(baseItem => {
          if (baseItem.id === "eq-keystone-cat6a" || baseItem.id === "eq-patchcord-cat6a") {
            return { ...baseItem, quantity: activeTemplate.nodeCount };
          }
          if (baseItem.id === "eq-patchpanel-cat6a") {
            return { ...baseItem, quantity: Math.ceil(activeTemplate.nodeCount / 24) };
          }
          if (baseItem.id === "eq-cabo-cat6a") {
            const boxesNeeded = Math.ceil((activeTemplate.nodeCount * 35) / 305);
            return { ...baseItem, quantity: Math.max(1, boxesNeeded) };
          }
          if (baseItem.id === "eq-cabo-fibra") {
            return { ...baseItem, quantity: activeTemplate.fiberLength > 0 ? activeTemplate.fiberLength + 30 : 0 };
          }
          if (baseItem.id === "eq-conduite-pead") {
            return { ...baseItem, quantity: activeTemplate.fiberLength };
          }
          if (baseItem.id === "eq-switch-core") {
            const switchesNeeded = Math.ceil(activeTemplate.nodeCount / 24);
            return { ...baseItem, quantity: Math.max(2, switchesNeeded) };
          }
          if (baseItem.id === "eq-ap-uni") {
            if (activeTemplate.id === "tpl-campus") {
              return { ...baseItem, quantity: 8 };
            }
            if (activeTemplate.id === "tpl-datacenter") {
              return { ...baseItem, quantity: 2 };
            }
            if (activeTemplate.id === "tpl-logistica") {
              return { ...baseItem, quantity: 4 };
            }
            return { ...baseItem, quantity: 4 };
          }
          return { ...baseItem };
        });

        if (activeTemplate.fiberLength === 0) {
          return baseList.filter(item => 
            !["eq-cabo-fibra", "eq-dio-munt", "eq-pigtail-lc", "eq-patchcord-opt", "eq-conduite-pead", "eq-transceptor-sfp"].includes(item.id)
          );
        }
        return baseList;
      });
    }
  }, [activeTemplate]);
  
  // Custom item states
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);
  const [customItem, setCustomItem] = useState({
    name: '',
    brand: 'Genérica',
    unitPrice: 100,
    category: 'passive' as 'active' | 'passive' | 'infra',
    specs: 'Descrição ou especificações técnicas adicionais do material.',
    quantity: 1
  });

  // Simulator for feasibility analysis
  const [analysisResult, setAnalysisResult] = useState<{
    status: 'success' | 'warning' | 'info' | null;
    message: string;
    score: number;
    points: string[];
  }>({ status: null, message: '', score: 0, points: [] });

  // Sincroniza a distância do enlace externo (fibra e conduíte subterrâneo) no carrinho
  const handleDistanceSliderChange = (newVal: number) => {
    setFiberDistance(newVal);
    setItems(prev => prev.map(item => {
      // Ajusta o cabo de fibra (+30 metros de folga logística para curvas e fusões nos DIOs)
      if (item.id === "eq-cabo-fibra") {
        return { ...item, quantity: newVal + 30 };
      }
      // Ajusta o conduíte de PE-AD subterrâneo na vala
      if (item.id === "eq-conduite-pead") {
        return { ...item, quantity: newVal };
      }
      return item;
    }));
  };

  // Altera quantidade de itens no orçamento
  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty <= 0) {
      // Remove o item se a quantidade chegar a zero
      handleRemoveItem(id);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Remove item do orçamento por completo
  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Adiciona um item do catálogo ao orçamento atual
  const handleAddItemFromCatalog = (catalogItem: Omit<Equipment, 'quantity'>) => {
    setItems(prev => {
      const exists = prev.find(item => item.id === catalogItem.id);
      if (exists) {
        // Se já existe, apenas incrementa em 1 a quantidade
        return prev.map(item => 
          item.id === catalogItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Se é novo no carrinho, adiciona com quantidade conforme categoria ou padrão
        let qty = 1;
        if (catalogItem.id === "eq-keystone-cat6a" || catalogItem.id === "eq-patchcord-cat6a") {
          qty = 48; // Prédio integrado necessita dos 48 pontos
        } else if (catalogItem.id === "eq-cabo-fibra") {
          qty = fiberDistance + 30;
        } else if (catalogItem.id === "eq-conduite-pead") {
          qty = fiberDistance;
        }
        return [...prev, { ...catalogItem, quantity: qty }];
      }
    });
  };

  // Adiciona item customizado inserido pelo formulário do usuário
  const handleAddCustomItem = (e: FormEvent) => {
    e.preventDefault();
    if (!customItem.name.trim()) return;

    const newItem: Equipment = {
      id: `custom-${Date.now()}`,
      name: customItem.name,
      brand: customItem.brand || "Especializada",
      quantity: Number(customItem.quantity) || 1,
      unitPrice: Number(customItem.unitPrice) || 0,
      category: customItem.category,
      specs: customItem.specs || "Projeto customizado conforme especificação pontual."
    };

    setItems(prev => [...prev, newItem]);
    
    // Reset form states
    setCustomItem({
      name: '',
      brand: 'Genérica',
      unitPrice: 100,
      category: 'passive',
      specs: 'Descrição ou especificações técnicas adicionais do material.',
      quantity: 1
    });
    setShowCustomForm(false);
  };

  // Aplica Templates Estruturais Prontos rapidos
  const applyTemplate = (type: 'original' | 'simplificado' | 'fibra-only' | 'limpo') => {
    setAnalysisResult({ status: null, message: '', score: 0, points: [] });
    
    if (type === 'original') {
      setItems(EQUIPMENT_LIST.map(item => ({ ...item })));
      setFiberDistance(120);
      setIncludeCertification(true);
      setWizardNodes(48);
      setWizardFiberEnabled(true);
      setWizardWifi('standard');
      setWizardUPS(false);
      setWizardCftv('none');
    } 
    else if (type === 'simplificado') {
      // Pequeno escritório comercial - sem enlace externo de fibra, apenas rede cobre metálica local
      const filtered = EQUIPMENT_LIST.filter(item => 
        !["eq-cabo-fibra", "eq-dio-munt", "eq-pigtail-lc", "eq-patchcord-opt", "eq-conduite-pead", "eq-transceptor-sfp"].includes(item.id)
      ).map(item => {
        if (item.id === "eq-switch-core") return { ...item, quantity: 1 }; // Apenas 1 rack local
        if (item.id === "eq-ap-uni") return { ...item, quantity: 3 }; // Menos APs
        if (item.id === "eq-keystone-cat6a" || item.id === "eq-patchcord-cat6a") return { ...item, quantity: 24 }; // 24 pontos locais
        return { ...item };
      });
      setItems(filtered);
      setFiberDistance(0);
      setIncludeCertification(true);
      setWizardNodes(24);
      setWizardFiberEnabled(false);
      setWizardWifi('basic');
      setWizardUPS(false);
      setWizardCftv('none');
    } 
    else if (type === 'fibra-only') {
      // Backbone óptico interpredial puro
      const filtered = EQUIPMENT_LIST.filter(item => 
        ["eq-cabo-fibra", "eq-dio-munt", "eq-pigtail-lc", "eq-patchcord-opt", "eq-conduite-pead", "eq-transceptor-sfp"].includes(item.id)
      ).map(item => ({ ...item }));
      setItems(filtered);
      setFiberDistance(120);
      setIncludeCertification(false);
      setWizardNodes(0);
      setWizardFiberEnabled(true);
      setWizardWifi('none');
      setWizardUPS(false);
      setWizardCftv('none');
    } 
    else if (type === 'limpo') {
      setItems([]);
      setFiberDistance(0);
      setIncludeCertification(false);
      setWizardNodes(0);
      setWizardFiberEnabled(false);
      setWizardWifi('none');
      setWizardUPS(false);
      setWizardCftv('none');
    }
  };

  // Cálculos consolidados dinâmicos
  const totalNetworkPoints = useMemo(() => {
    // Estimativas de pontos de rede com base no hardware de cobre contratado (ou seja, conectores instalados)
    const keystoneItem = items.find(i => i.id === "eq-keystone-cat6a");
    return keystoneItem ? keystoneItem.quantity : 0;
  }, [items]);

  const certificationCost = includeCertification ? (totalNetworkPoints * 35.00) : 0;
  
  const subtotalByCategory = useMemo(() => {
    return {
      active: items.filter(i => i.category === 'active').reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0),
      passive: items.filter(i => i.category === 'passive').reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0),
      infra: items.filter(i => i.category === 'infra').reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0),
      services: certificationCost
    };
  }, [items, certificationCost]);

  const rawTotal = subtotalByCategory.active + subtotalByCategory.passive + subtotalByCategory.infra + subtotalByCategory.services;
  const discountAmount = (rawTotal * discountPercent) / 100;
  const grandTotal = rawTotal - discountAmount;

  // Porcentagem de participação no custo final por categoria
  const percentSharing = useMemo(() => {
    if (rawTotal === 0) return { active: 0, passive: 0, infra: 0, services: 0 };
    return {
      active: Math.round((subtotalByCategory.active / rawTotal) * 100),
      passive: Math.round((subtotalByCategory.passive / rawTotal) * 100),
      infra: Math.round((subtotalByCategory.infra / rawTotal) * 100),
      services: Math.round((subtotalByCategory.services / rawTotal) * 100)
    };
  }, [subtotalByCategory, rawTotal]);

  // Filtra catálogo em exibição com base na categoria selecionada
  const filteredCatalogItems = useMemo(() => {
    if (activeCatalogTab === 'all') return COMPREHENSIVE_CATALOG;
    return COMPREHENSIVE_CATALOG.filter(item => item.category === activeCatalogTab);
  }, [activeCatalogTab]);

  // Simula a Análise de Viabilidade Técnica e Emite feedback
  const runViabilityAnalysis = () => {
    const hasCoreSwitch = items.some(i => i.id === "eq-switch-core" && i.quantity >= 2);
    const hasFiberEnlace = items.some(i => i.id === "eq-cabo-fibra" && i.quantity > 0);
    const hasConduit = items.some(i => i.id === "eq-conduite-pead" && i.quantity > 0);
    const hasRacks = items.some(i => i.category === "infra" && i.name.toLowerCase().includes("rack"));
    const hasPoEAPs = items.some(i => i.id === "eq-ap-uni" && i.quantity >= 4);

    let score = 50;
    const points: string[] = [];

    if (hasCoreSwitch) {
      score += 15;
      points.push("✓ Presença de switches gerenciados de camada L3 nos dois prédios para as VLANs do projeto.");
    } else {
      points.push("⚠ Faltam switches gerenciáveis L3 em quantidade ideal para gerenciar a redundância e isolamento.");
    }

    if (hasFiberEnlace) {
      score += 15;
      points.push("✓ Enlace óptico monomodo (OS2) garante isolamento de aterramento entre as estruturas e descargas atmosféricas.");
      if (hasConduit) {
        score += 10;
        points.push("✓ Rota subterrânea em duto de PE-AD de alta densidade aprovado contra infiltrações e umidade pluvial.");
      } else {
        points.push("⚠ Enlace óptico está definido como aéreo ou sem proteção subterrânea adequada.");
      }
    } else {
      points.push("⚠ Ausência de cabo óptico interpredial. Enlaces metálicos normais externos sofrem com indução eletromagnética.");
    }

    if (hasRacks) {
      score += 10;
      points.push("✓ Racks de Piso e Servidor dimensionados corretamente para os ambientes físicos.");
    } else {
      points.push("⚠ Sem racks listados para a ancoragem mecânica e resfriamento térmico seguro.");
    }

    if (includeCertification) {
      score += 10;
      points.push("✓ Certificação Fluke inclusa: Garante relatórios oficiais emitidos sob normas NBR 14565 / ANSI.");
    } else {
      points.push("⚠ Sem certificação Fluke: Ausência de verificação analítica oficial contra atenuações secundárias.");
    }

    if (hasPoEAPs) {
      score += 10;
      points.push("✓ Ampla cobertura Wi-Fi 6 prevista para atendimento local das dependências corporativas.");
    }

    let status: 'success' | 'warning' | 'info' = 'info';
    let message = "Projeto está em fase de planejamento básico. Requer novos elementos.";

    if (score >= 90) {
      status = 'success';
      message = "Projeto com Altíssimo Padrão de Engenharia! Total conformidade com as rígidas normas brasileiras ABNT NBR 14565 e NBR 5410.";
    } else if (score >= 70) {
      status = 'success';
      message = "Projeto Saudável e Funcional! Atende às principais demandas físicas da infraestrutura de ponta.";
    } else if (score >= 50) {
      status = 'warning';
      message = "Atenção: O projeto atual apresenta ausência de alguns componentes normativos de redundância física.";
    } else {
      status = 'warning';
      message = "Crítico: Praticamente nula a blindagem estrutural e as rotas de tráfego físico. Ajuste no catálogo.";
    }

    setAnalysisResult({ status, message, score, points });
  };

  const handlePrint = () => {
    setShowPDFModal(true);
  };

  const handleCopySummary = () => {
    const summaryText = `
--- ORÇAMENTO TÉCNICO COMPLETO: ${COMPANHIA.nome} ---
Cenário de Integração Logística e Corporativa
Homologado em Conformidade com as Normas Brasileiras ABNT NBR 14565 e NBR 5410

DETALHES DO PROJETO SELECIONADO:
- Enlace Óptico Interpredial: ${fiberDistance > 0 ? `${fiberDistance}m subterrâneo em PE-AD` : "Não Incluso/Enlace Curto"}
- Pontos Locais Metálicos: ${totalNetworkPoints} Pontos estruturados em Cat6A Blindados

QUADRO DE INVESTIMENTOS (BRL):
- Equipamentos Ativos (Switches/APs): R$ ${subtotalByCategory.active.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Materiais Passivos (Cabos/Patch Panels): R$ ${subtotalByCategory.passive.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Infraestrutura de Racks & Dutos: R$ ${subtotalByCategory.infra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Serviço de Aferição Analítica Fluke: R$ ${subtotalByCategory.services.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

RESUMO FINANCEIRO:
- Valor Bruto: R$ ${rawTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Desconto Aplicado (${discountPercent}%): R$ ${discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- TOTAL FINAL DO EMPREENDIMENTO: R$ ${grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

*Orçamento interativo calculado eletronicamente pelo módulo de orçamento da P2P Engenharia.*
    `;
    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="space-y-8 select-none" id="orcamento-geral">
      
      {/* Intro info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold block">
            MÓDULO CONFIGURADOR E EDITÁVEL DE PROJETO
          </span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-2">
            Monte & Planeje Seu Orçamento Técnico
          </h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl font-sans">
            Customize o projeto adicionando equipamentos do catálogo, criando itens sob demanda, escolhendo templates ou definindo a folga logística do link físico de fibra.
          </p>
        </div>

        <button 
          onClick={() => applyTemplate('original')}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-none text-xs font-semibold uppercase tracking-wider transition cursor-pointer font-sans"
        >
          Resetar Infra Original
        </button>
      </div>

      {/* QUICK TEMPLATE SWITCHER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => applyTemplate('original')}
          className="bg-[#0e0e11] border border-zinc-900 p-3 text-left hover:border-zinc-700 transition group rounded-none"
        >
          <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold font-sans">
            <Server className="w-3.5 h-3.5 text-zinc-400" />
            Integrado Completo
          </div>
          <p className="text-[10px] text-zinc-550 mt-1">2 prédios com enlace subterrâneo e 48 pontos.</p>
        </button>

        <button
          onClick={() => applyTemplate('simplificado')}
          className="bg-[#0e0e11] border border-zinc-900 p-3 text-left hover:border-zinc-700 transition group rounded-none"
        >
          <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold font-sans">
            <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
            Escritório Único
          </div>
          <p className="text-[10px] text-zinc-550 mt-1">Local metálico Cat6A. Sem enlace de fibra externo.</p>
        </button>

        <button
          onClick={() => applyTemplate('fibra-only')}
          className="bg-[#0e0e11] border border-zinc-900 p-3 text-left hover:border-zinc-700 transition group rounded-none"
        >
          <div className="flex items-center gap-1.5 text-xs text-white uppercase font-bold font-sans">
            <Cable className="w-3.5 h-3.5 text-zinc-400" />
            Apenas Link Físico
          </div>
          <p className="text-[10px] text-zinc-550 mt-1">Foco na fusão óptica interpredial e dutos.</p>
        </button>

        <button
          onClick={() => applyTemplate('limpo')}
          className="bg-black border border-zinc-900/60 p-3 text-left hover:border-red-950 transition group rounded-none"
        >
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 uppercase font-bold font-sans group-hover:text-red-400">
            <Trash className="w-3.5 h-3.5 text-zinc-655" />
            Limpar Todo Projeto
          </div>
          <p className="text-[10px] text-zinc-550 mt-1">Zere o carrinho e crie o seu projeto do zero absoluta.</p>
        </button>
      </div>

      {/* SELECIONADOR INTERATIVO SIMPLIFICADO DE ORÇAMENTO (ASSISTENTE PARA O CLIENTE) */}
      <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-zinc-800/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
            <div>
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">ASSISTENTE SIMPLIFICADO DE REDE</h3>
              <p className="text-base font-sans font-black text-white uppercase tracking-tight mt-0.5">Configure sua infraestrutura em poucos cliques</p>
            </div>
          </div>
          <span className="text-[10px] font-mono border border-zinc-800 bg-zinc-950 px-3 py-1 rounded-none text-zinc-400 select-none">
            Ideal para estimativa rápida de projeto
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Opção 1: Pontos RJ45 */}
          <div className="space-y-2 bg-zinc-950/40 p-4 border border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <Server className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">1. Estações de Trabalho</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">Quantas mesas ou computadores usarão cabo de rede?</p>
            </div>
            <div className="pt-3">
              <select 
                value={wizardNodes} 
                onChange={(e) => handleWizardNodesChange(Number(e.target.value))} 
                className="w-full bg-[#09090b] border border-zinc-800 text-xs px-2.5 py-2 outline-none font-mono focus:border-zinc-700 text-white font-bold cursor-pointer transition hover:border-white rounded-none"
              >
                <option value="12">Até 12 Pontos (Pequeno)</option>
                <option value="24">Até 24 Pontos (Médio / Escritório)</option>
                <option value="48">Até 48 Pontos (Completo / Grande)</option>
                <option value="72">Até 72 Pontos (Densidade Ativa)</option>
                <option value="96">Até 96 Pontos (Infra Total / Campus)</option>
              </select>
            </div>
          </div>

          {/* Opção 2: Enlace de Fibra */}
          <div className="space-y-2 bg-zinc-950/40 p-4 border border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <Cable className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">2. Prédios Separados?</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">Seu projeto necessita de conexão externa de fibra?</p>
            </div>
            <div className="pt-3">
              <select 
                value={wizardFiberEnabled ? "yes" : "no"} 
                onChange={(e) => handleWizardFiberChange(e.target.value === "yes")} 
                className="w-full bg-[#09090b] border border-zinc-800 text-xs px-2.5 py-2 outline-none font-mono focus:border-zinc-700 text-white font-bold cursor-pointer transition hover:border-white rounded-none"
              >
                <option value="no">Não (Apenas 1 Bloco)</option>
                <option value="yes">Sim (Enlace entre Prédios)</option>
              </select>
            </div>
          </div>

          {/* Opção 3: Cobertura Wi-Fi */}
          <div className="space-y-2 bg-zinc-950/40 p-4 border border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <Wifi className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">3. Wi-Fi Corporativo</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">Qual o nível e cobertura de sinal Wi-Fi sem fio?</p>
            </div>
            <div className="pt-3">
              <select 
                value={wizardWifi} 
                onChange={(e) => handleWizardWifiChange(e.target.value as any)} 
                className="w-full bg-[#09090b] border border-zinc-800 text-xs px-2.5 py-2 outline-none font-mono focus:border-zinc-700 text-white font-bold cursor-pointer transition hover:border-white rounded-none"
              >
                <option value="none">Nenhum (Apenas Cabos)</option>
                <option value="basic">Básico (2 Access Points)</option>
                <option value="standard">Padrão Amplo (4 Access Points)</option>
                <option value="high">Campus / Extremo (8 Access Points)</option>
              </select>
            </div>
          </div>

          {/* Opção 4: Segurança de Energia (Nobreak) */}
          <div className="space-y-2 bg-zinc-950/40 p-4 border border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">4. Autonomia Elétrica</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-sans font-sans">Sua central precisa continuar ligada se acabar a luz?</p>
            </div>
            <div className="pt-3">
              <select 
                value={wizardUPS ? "yes" : "no"} 
                onChange={(e) => handleWizardUPSChange(e.target.value === "yes")} 
                className="w-full bg-[#09090b] border border-zinc-800 text-xs px-2.5 py-2 outline-none font-mono focus:border-zinc-700 text-white font-bold cursor-pointer transition hover:border-white rounded-none"
              >
                <option value="no">Não (Conexão Direta)</option>
                <option value="yes">Sim (Adicionar Nobreak)</option>
              </select>
            </div>
          </div>

          {/* Opção 5: Câmeras IP CFTV */}
          <div className="space-y-2 bg-[#09090b] p-4 border border-zinc-900/60 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white">
                <Settings className="w-4 h-4 text-zinc-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-sans">5. Câmeras & CFTV</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">Adicionar câmeras de segurança IP e protetores de surto?</p>
            </div>
            <div className="pt-3">
              <select 
                value={wizardCftv} 
                onChange={(e) => handleWizardCftvChange(e.target.value as any)} 
                className="w-full bg-[#0e0e11] border border-zinc-850 text-xs px-2.5 py-2 outline-none font-mono focus:border-zinc-700 text-white font-bold cursor-pointer transition hover:border-white rounded-none"
              >
                <option value="none">Sem Monitoramento</option>
                <option value="basic">Básico (4 Câmeras + DPS)</option>
                <option value="full">Completo (8 Câmeras + DPS)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-3 flex flex-wrap items-center justify-between gap-4 text-[10.5px] font-sans text-zinc-400 rounded-none">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-mono font-bold">✨ Atualmente Configurado:</span>
            <span className="border-r border-zinc-850 pr-2.5">{wizardNodes} Pontos metálicos RJ45 Cat6A</span>
            <span className="border-r border-zinc-850 pr-2.5">{wizardFiberEnabled ? `Enlace de Fibra OS2 (${fiberDistance}m)` : "Sem enlace de fibra interpredial"}</span>
            <span className="border-r border-zinc-850 pr-2.5">{wizardWifi === 'none' ? "Sem Wi-Fi" : wizardWifi === 'basic' ? "2x APs de Rede" : wizardWifi === 'standard' ? "4x APs de Cobertura" : "8x APs de Alta Performance"}</span>
            <span>{wizardUPS ? "🔋 Nobreak Inteligente Ativo" : "Sem backup de energia"}</span>
            {wizardCftv !== 'none' && <span> • 📹 {wizardCftv === 'basic' ? '4' : '8'}x Câmeras de CFTV</span>}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono italic">O orçamento é atualizado automaticamente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cost Editors - Left Side (Col-span 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Work in Cart */}
          <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                <Calculator className="w-4 h-4 text-zinc-400" />
                Seu Projeto: Elementos Atualizados ({items.length})
              </h3>
              
              <button
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="text-[10px] font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-none flex items-center gap-1 uppercase transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                {showCustomForm ? "Fechar Personalizado" : "Criar Item Personalizado"}
              </button>
            </div>

            {/* CUSTOM ITEM CREATION FORM */}
            <AnimatePresence>
              {showCustomForm && (
                <motion.form 
                  onSubmit={handleAddCustomItem}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-zinc-950 p-4 border border-zinc-900 rounded-none space-y-4 overflow-hidden font-sans"
                >
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-bold">🛠️ ADICIONAR UM NOVO ITEM AO SEU PROJETO</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold block">1. Qual é o nome do equipamento ou serviço?</label>
                      <input 
                        type="text" 
                        required
                        value={customItem.name}
                        onChange={(e) => setCustomItem(prev => ({...prev, name: e.target.value}))}
                        placeholder="Ex: Cabo de rede extra, Tomada extra, etc."
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-zinc-600 rounded-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold block">2. Qual é a marca ou fabricante do item?</label>
                      <input 
                        type="text" 
                        value={customItem.brand}
                        onChange={(e) => setCustomItem(prev => ({...prev, brand: e.target.value}))}
                        placeholder="Ex: Furukawa, Ubiquiti, Intelbras, etc."
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-zinc-600 rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold block">3. Em qual grupo ele se encaixa?</label>
                      <select 
                        value={customItem.category}
                        onChange={(e) => setCustomItem(prev => ({...prev, category: e.target.value as any}))}
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-zinc-600 rounded-none"
                      >
                        <option value="active">Equipamento Ativo (Roteador, Switch, Wi-Fi)</option>
                        <option value="passive">Material Passivo (Cabo, Tomada RJ45, Painel)</option>
                        <option value="infra">Infraestrutura (Rack, canaletas, tubulação)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold block">4. Quanto custa cada unidade? (R$)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={customItem.unitPrice}
                        onChange={(e) => setCustomItem(prev => ({...prev, unitPrice: parseFloat(e.target.value) || 0}))}
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-zinc-600 rounded-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase font-semibold block">5. Quantos você precisa?</label>
                      <input 
                        type="number" 
                        min="1"
                        value={customItem.quantity}
                        onChange={(e) => setCustomItem(prev => ({...prev, quantity: parseInt(e.target.value) || 1}))}
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-zinc-600 rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-semibold block">6. O que este item faz? (Breve detalhe técnico)</label>
                    <input 
                      type="text" 
                      value={customItem.specs}
                      onChange={(e) => setCustomItem(prev => ({...prev, specs: e.target.value}))}
                      placeholder="Ex: Cabo azul de alta velocidade para ligar as salas operacionais da central."
                      className="w-full text-xs bg-zinc-900 border border-zinc-800 p-2 text-white outline-none focus:border-zinc-600 rounded-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-white text-black hover:bg-zinc-200 transition text-xs font-bold uppercase rounded-none tracking-wider cursor-pointer"
                  >
                    Adicionar no Orçamento do Projeto
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* LIVE WORKING CART ITEMS */}
            {items.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-zinc-900 rounded-xl space-y-3">
                <AlertTriangle className="w-8 h-8 text-zinc-550 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-300 font-sans uppercase">Seu Orçamento está Vazio</h4>
                <p className="text-[11px] text-zinc-500 max-w-sm mx-auto font-sans">
                  Você limpou sua lista de itens. Utilize os botões de <strong>Templates Rápidos</strong> acima, ou escolha componentes do <strong>Catálogo Geral</strong> no rodapé para montar sua estrutura dinâmica.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {items.map((item) => {
                  const totalCost = item.unitPrice * item.quantity;
                  const categoryBadgeColor = 
                    item.category === 'active' ? 'text-cyan-400 border-cyan-900 bg-cyan-950/20' :
                    item.category === 'passive' ? 'text-amber-400 border-amber-900 bg-amber-950/20' :
                    'text-purple-400 border-purple-900 bg-purple-950/20';

                  return (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-black/40 border border-zinc-900 hover:border-zinc-800 p-3 flex justify-between items-center gap-4 transition"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-white font-sans">{item.name}</span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850 uppercase font-semibold">
                            {item.brand}
                          </span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border uppercase font-semibold ${categoryBadgeColor}`}>
                            {item.category === 'active' ? 'Ativo' : item.category === 'passive' ? 'Passivo' : 'Infra'}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-normal font-sans max-w-lg">{item.specs}</p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3.5">
                        <div className="text-right font-sans">
                          <p className="text-[10px] text-zinc-550 font-mono">Unid: R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p className="text-xs font-black text-white font-mono">R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>

                        <div className="flex items-center gap-1 bg-zinc-900 p-1 border border-zinc-800">
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-white font-mono font-bold px-1.5 min-w-8 text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Deletion */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-zinc-550 hover:text-red-400 hover:bg-red-950/20 rounded border border-transparent hover:border-red-900/40 transition cursor-pointer"
                          title="Remover Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DYNAMIC EQUIPMENT CATALOG */}
          <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-5 space-y-4">
            <div className="border-b border-zinc-900 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-zinc-400" />
                  Catálogo de Equipamentos de Alta Performance
                </h3>
                <p className="text-[10px] text-zinc-450 mt-0.5">Explore e escolha os dispositivos autorizados para incluir em sua fatura.</p>
              </div>

              {/* Filtering tabs */}
              <div className="flex bg-zinc-950 p-1 border border-zinc-900 space-x-1">
                {(['all', 'active', 'passive', 'infra'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveCatalogTab(tab)}
                    className={`text-[8px] font-mono uppercase px-2.5 py-1 tracking-wider font-bold transition cursor-pointer ${
                      activeCatalogTab === tab 
                        ? 'bg-white text-black' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab === 'all' ? 'Todos' : tab === 'active' ? 'Ativos' : tab === 'passive' ? 'Passivos' : 'Infra'}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[350px] overflow-y-auto pr-1">
              {filteredCatalogItems.map((catItem) => {
                const currentInCart = items.find(i => i.id === catItem.id);
                
                return (
                  <div 
                    key={catItem.id}
                    className="bg-zinc-950/60 p-3 border border-zinc-900/80 hover:border-zinc-800 flex flex-col justify-between space-y-3 transition group"
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[11px] font-bold text-zinc-200 leading-snug group-hover:text-white transition">{catItem.name}</span>
                        {currentInCart && (
                          <span className="text-[8px] font-mono tracking-wider font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 px-1.5 py-0.2 rounded-none uppercase flex items-center gap-1 flex-shrink-0 animate-pulse">
                            <Check className="w-2 h-2 text-white" />
                            ({currentInCart.quantity})
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5 text-[8px] font-mono">
                        <span className="text-zinc-500">Marca: <strong className="text-zinc-300">{catItem.brand}</strong></span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400 capitalize">{catItem.category === 'active' ? 'Ativo' : catItem.category === 'passive' ? 'Passivo' : 'Infra'}</span>
                      </div>
                      <p className="text-[10px] text-zinc-450 leading-relaxed font-sans mt-1">{catItem.specs}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-950 font-sans">
                      <span className="text-xs font-bold text-zinc-200 font-mono">R$ {catItem.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      
                      <button
                        onClick={() => handleAddItemFromCatalog(catItem)}
                        className="px-2.5 py-1 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Professional Invoice Receipt Sheet - Right Side (Col-span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Invoice card */}
          <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 shadow-2xl space-y-6 relative print:border-0 print:shadow-none print:p-0">
            
            {/* Invoice header */}
            <div className="border-b border-dashed border-zinc-800 pb-5 text-center">
              <span className="text-[9px] text-zinc-400 uppercase font-mono border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 rounded-none inline-block mb-2 font-black tracking-widest">
                Simulador de Investimento Técnico
              </span>
              <h3 className="text-lg font-display font-black text-white uppercase tracking-tight font-sans">
                {COMPANHIA.nome}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-1 font-semibold">
                Infraestrutura Física de Redes de Alta Performance
              </p>
              <p className="text-[9px] text-zinc-550 font-mono">
                P2P Engenharia & Cabeamento Inteligente • Amapá
              </p>
            </div>

            {/* Dynamic Slider on Enlace */}
            <div className="space-y-4 font-sans bg-zinc-950 p-3 border border-zinc-900">
              <div className="flex justify-between text-xs text-zinc-300">
                <span className="font-semibold text-zinc-400 font-mono flex items-center gap-1.5">
                  <Cable className="w-3.5 h-3.5" />
                  Comprimento Físico Enlace OS2:
                </span>
                <span className="font-mono font-bold text-white">{fiberDistance} m</span>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="300" 
                step="10"
                value={fiberDistance}
                onChange={(e) => handleDistanceSliderChange(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
              />
              
              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono leading-none">
                <span>0m (curto)</span>
                <span>300m (outdoor)</span>
              </div>

              {/* Alert if fiber or conduit is not in cart but distance is modified */}
              {fiberDistance > 0 && !items.some(i => i.id === "eq-cabo-fibra") && (
                <div className="bg-amber-950/20 border border-amber-900/60 p-2 text-[9px] text-amber-300 font-sans mt-2 rounded">
                  ⚠ <strong>Link desativado:</strong> O cabo de fibra óptica OS2 não está no seu orçamento. Adicione-o no catálogo abaixo para quantificar a distância.
                </div>
              )}
            </div>

            {/* Certification Toggle */}
            <div className="font-sans">
              <label className="flex items-start gap-2.5 cursor-pointer bg-zinc-950 p-3 border border-zinc-900 hover:border-zinc-850 text-xs text-zinc-300 rounded-none">
                <input 
                  type="checkbox"
                  checked={includeCertification}
                  onChange={(e) => setIncludeCertification(e.target.checked)}
                  className="rounded-none border-zinc-800 text-white focus:ring-zinc-800 h-4 w-4 bg-zinc-900 mt-0.5"
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-zinc-200">Certificar Tomadas (Fluke DSX-8000)</span>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Serviço de aferição e relatório analítico de rede Cat6A (R$ 35,00 por ponto instalado).
                  </p>
                </div>
              </label>
            </div>

            {/* DYNAMIC COST BREAKDOWN (SLATE SEGMENTS BREAKDOWN) */}
            <div className="space-y-1 rounded-none bg-zinc-950/65 border border-zinc-900 p-3 font-sans">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 block uppercase font-bold text-center">Partilha de Custos do Orçamento</span>
              <div className="h-2 w-full flex bg-zinc-900 rounded-none overflow-hidden mt-1 md:mt-2">
                <div style={{ width: `${percentSharing.active}%` }} className="bg-cyan-500" title={`Equipamentos Ativos: ${percentSharing.active}%`} />
                <div style={{ width: `${percentSharing.passive}%` }} className="bg-amber-500" title={`Materiais Passivos: ${percentSharing.passive}%`} />
                <div style={{ width: `${percentSharing.infra}%` }} className="bg-purple-500" title={`Infraestrutura: ${percentSharing.infra}%`} />
                <div style={{ width: `${percentSharing.services}%` }} className="bg-emerald-500" title={`Aferição/Serviços: ${percentSharing.services}%`} />
              </div>
              <div className="grid grid-cols-4 gap-1 text-[8px] font-mono text-zinc-400 text-center pt-2">
                <div className="flex flex-col items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 inline-block rounded-full mb-0.5" />
                  <span>Ativos: {percentSharing.active}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-1.5 h-1.5 bg-amber-500 inline-block rounded-full mb-0.5" />
                  <span>Passivo: {percentSharing.passive}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 inline-block rounded-full mb-0.5" />
                  <span>Infra: {percentSharing.infra}%</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 inline-block rounded-full mb-0.5" />
                  <span>Serviço: {percentSharing.services}%</span>
                </div>
              </div>
            </div>

            {/* Discount Control Slider */}
            <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-none space-y-2 font-sans">
              <div className="flex justify-between text-xs text-zinc-300">
                <span className="text-zinc-350 font-mono font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-zinc-400" />
                  Desconto Comercial / Parceria:
                </span>
                <span className="font-mono font-bold text-white">{discountPercent}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="30"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[9px] text-zinc-500 font-mono leading-none">
                <span>0% sem bônus</span>
                <span>Desconto de {discountPercent}% aplicado: - R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* GRAND TOTAL */}
            <div className="border-t border-dashed border-zinc-850 pt-5 flex justify-between items-end bg-black/20 p-2">
              <div>
                <p className="text-[10px] text-zinc-550 uppercase font-mono font-bold">Investimento Estimado:</p>
                <p className="text-[9px] text-zinc-600 font-sans">Impostos técnicos inclusos na homologação</p>
              </div>
              <p className="text-2xl font-display font-black text-white font-mono text-right leading-none">
                R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Buttons and actions */}
            <div className="pt-2 space-y-2.5 print:hidden font-sans">
              <button
                onClick={handleCopySummary}
                className={`w-full py-3 px-4 rounded-none text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
                  isCopied 
                    ? "bg-emerald-850 text-white border border-emerald-700" 
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                <Receipt className="w-4 h-4" />
                {isCopied ? "Orçamento Técnico Copiado!" : "Copiar Resumo Técnico"}
              </button>

              <button
                onClick={handlePrint}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Gerar PDF do Projeto
              </button>
            </div>

            {/* Signatures for corporate design approval */}
            <div className="border-t border-zinc-850 pt-5 space-y-4">
              <span className="text-[9px] text-zinc-600 font-mono block text-center uppercase tracking-wider font-extrabold">
                DIRETORIA TECNOLÓGICA - ASSINATURAS DE HOMOLOGAÇÃO
              </span>
              <div className="grid grid-cols-3 gap-2 text-[8px] text-zinc-500 font-mono text-center leading-normal">
                <div className="border-t border-zinc-900 pt-1.5">
                  <strong>{getSignatureName(students?.[0]?.name, "P. H. Santos")}</strong>
                  <p className="text-[7.5px] text-zinc-600 uppercase">Arquiteto Redes</p>
                </div>
                <div className="border-t border-zinc-900 pt-1.5">
                  <strong>{getSignatureName(students?.[1]?.name, "P. A. Souza")}</strong>
                  <p className="text-[7.5px] text-zinc-600 uppercase font-bold text-zinc-400">Líder Técnico</p>
                </div>
                <div className="border-t border-zinc-900 pt-1.5">
                  <strong>{getSignatureName(students?.[2]?.name, "L. G. Ferreira")}</strong>
                  <p className="text-[7.5px] text-zinc-600 uppercase">Eng. Testes</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE TECHNICAL VIABILITY SIMULATOR */}
          <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                Análise de Viabilidade Física Real-Time
              </h3>
              <p className="text-[10px] text-zinc-450">Simule uma conformidade analítica do seu projeto de acordo com a norma TIA.</p>
            </div>

            <button
              onClick={runViabilityAnalysis}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest transition cursor-pointer font-sans"
            >
              Executar Varredura de Conformidade
            </button>

            {analysisResult.status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border text-xs font-sans rounded-none space-y-2.5 ${
                  analysisResult.status === 'success' ? 'bg-emerald-950/20 border-emerald-900/60 text-zinc-200' :
                  analysisResult.status === 'warning' ? 'bg-amber-950/20 border-amber-900/60 text-zinc-200' :
                  'bg-zinc-950 border-zinc-900 text-zinc-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] uppercase font-semibold text-zinc-400">Varredura de Engenharia Física</span>
                  <span className={`font-mono font-bold text-xs p-1 px-2 rounded-none ${
                    analysisResult.status === 'success' ? 'bg-emerald-900/40 text-emerald-400' :
                    analysisResult.status === 'warning' ? 'bg-amber-900/40 text-amber-400' :
                    'bg-zinc-900 text-zinc-300'
                  }`}>
                    Conformidade: {analysisResult.score}/100
                  </span>
                </div>

                <p className="font-bold border-b border-zinc-900/30 pb-1.5 text-zinc-100">{analysisResult.message}</p>
                
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-[10px] text-zinc-400 leading-relaxed">
                  {analysisResult.points.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </div>

      {/* PDF PROPOSAL MODAL */}
      <AnimatePresence>
        {showPDFModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-0 md:p-6 overflow-y-auto font-sans select-none print:bg-white print:fixed print:inset-0 print:p-0 print:m-0"
          >
            {/* Standard Media Print Style Override */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-pdf-document, #printable-pdf-document * {
                  visibility: visible !important;
                }
                #printable-pdf-document {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  background: white !important;
                  color: black !important;
                  padding: 1.5cm !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                /* Hide element classes during printing */
                .print-hidden-element {
                  display: none !important;
                }
              }
            `}} />

            <div className="bg-[#030305] border-0 md:border border-zinc-900 w-full max-w-6xl flex flex-col lg:flex-row h-full md:h-[90vh] overflow-hidden rounded-none print:bg-white print:border-0 print:h-auto print:max-h-none print:w-full print:block">
              
              {/* Left Panel: Settings and controls */}
              <div className="w-full lg:w-96 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-900 p-6 space-y-6 overflow-y-auto print:hidden flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">RELATÓRIO PDF</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight font-sans">Gerador de Proposta</h4>
                    </div>
                    <button 
                      onClick={() => setShowPDFModal(false)}
                      className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900 transition rounded-none cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase font-black uppercase tracking-wider block">Razão Social / Nome do Cliente</label>
                      <input 
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value.toUpperCase())}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-emerald-600 transition"
                        placeholder="NOME DO CLIENTE"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase font-black uppercase tracking-wider block">Título do Empreendimento</label>
                      <textarea 
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value.toUpperCase())}
                        rows={3}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-emerald-600 transition resize-none"
                        placeholder="DESCRIÇÃO DO PROJETO"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          id="include-green"
                          checked={includeGreenSelo}
                          onChange={(e) => setIncludeGreenSelo(e.target.checked)}
                          className="w-4 h-4 rounded-none bg-zinc-900 border-zinc-800 text-emerald-600 accent-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="include-green" className="text-xs font-mono text-zinc-350 cursor-pointer flex items-center gap-1.5 hover:text-white transition">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Incorporar Compromisso Verde
                        </label>
                      </div>
                      <p className="text-[10px] text-zinc-550 leading-normal pl-6">
                        Adiciona as diretrizes de reciclagem de materiais (Cobre, Alumínio) e o desconto Green Cabling Furukawa ao PDF final.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase font-black uppercase tracking-wider block">Porcentagem de Desconto Comercial (%)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-6 border-t border-zinc-900">
                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer font-sans"
                  >
                    <Printer className="w-4.5 h-4.5" />
                    SALVAR PDF / IMPRIMIR
                  </button>
                  
                  <button
                    onClick={() => setShowPDFModal(false)}
                    className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer font-sans"
                  >
                    Fechar Editor
                  </button>
                </div>
              </div>

              {/* Right Panel: White Paper Render (A4 representation) */}
              <div className="flex-1 bg-zinc-900 overflow-y-auto p-4 md:p-8 flex justify-center print:bg-white print:p-0 print:block">
                
                {/* Clean white document sheet */}
                <div 
                  id="printable-pdf-document"
                  className="bg-white text-black p-8 md:p-12 w-full max-w-[210mm] shadow-2xl relative font-sans text-left border border-zinc-200 aspect-[1/1.414] overflow-y-auto print:shadow-none print:border-0 print:p-0 print:m-0 print:w-full print:block print:max-w-none"
                >
                  {/* Watermark / Background accents for layout */}
                  <div className="absolute top-[8cm] left-[2cm] right-[2cm] border-[6px] border-emerald-500/5 rounded-full aspect-square flex items-center justify-center pointer-events-none print:hidden">
                    <span className="font-mono text-[70px] font-black text-emerald-500/3 tracking-widest uppercase rotate-12">P2P ENGENHARIA</span>
                  </div>

                  {/* Document Header Logo & Business Address */}
                  <div className="flex justify-between items-start border-b-2 border-black pb-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest bg-black text-white px-2 py-0.5 uppercase">P2P CABEAMENTO</span>
                      <h2 className="text-xl font-bold uppercase tracking-tight m-0 text-black">P2P Cabeamento Estruturado</h2>
                      <p className="text-[9px] font-mono text-zinc-600 uppercase m-0 leading-relaxed font-semibold">
                        Sólida Engenharia Física e Certificação de Conectores no Estado do Amapá
                      </p>
                    </div>
                    <div className="text-right text-[8.5px] font-mono text-zinc-600 space-y-0.5 leading-tight">
                      <strong className="text-black">MATRIZ MACAPÁ - AMAPÁ</strong>
                      <p className="m-0">Av. Fab, 1250 - Centro, Macapá - AP, 68900-073</p>
                      <p className="m-0">CNPJ: 44.621.848/0001-90 | CREA-AP: 2541-AP</p>
                      <p className="m-0">p2p.engenharia.ap@gmail.com | (96) 99124-7850</p>
                    </div>
                  </div>

                  {/* Proposal Metadata Summary */}
                  <div className="grid grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200 p-4 mt-6 text-[10px] font-sans">
                    <div className="space-y-1">
                      <p className="m-0 text-zinc-500 uppercase font-mono tracking-wider">PROPONENTE TÉCNICO / CONTATO:</p>
                      <p className="m-0 font-bold text-zinc-800 uppercase text-xs">{COMPANHIA.nome}</p>
                      <p className="m-0 text-zinc-600">Representante do Polo de Certificação de Rede do Norte</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="m-0 text-zinc-500 uppercase font-mono tracking-wider">CÓDIGO DE HOMOLOGAÇÃO:</p>
                      <p className="m-0 font-mono font-bold text-zinc-950 text-xs">{proposalCode}</p>
                      <p className="m-0 text-zinc-600">Emitido em: **29 de Maio de 2026** (Validade: 30 dias)</p>
                    </div>
                  </div>

                  {/* Subject and Target Details */}
                  <div className="mt-6 space-y-4">
                    <div className="border-l-4 border-black pl-3 py-1 space-y-1">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-extrabold block">DADOS DE DESTINATÁRIO E OBRA:</span>
                      <h4 className="text-[12px] font-bold uppercase m-0 tracking-tight text-black flex items-center gap-1.5">
                        CLIENTE ADQUIRENTE: {clientCompany || "CLIENTE CORPORATIVO PARCEIRO"}
                      </h4>
                      <p className="text-[10px] text-zinc-600 m-0 font-mono">
                        EMPREENDIMENTO: {projectTitle || "PROPOSTA DE DESENVOLVIMENTO DE INFRAESTRUTURA DE REDE"}
                      </p>
                    </div>
                    <p className="text-[10.5px] text-zinc-700 leading-relaxed mt-2 m-0 font-sans">
                      Apresentamos o Relatório Técnico Comercial consolidando todos os ativos de telecomunicações, acessórios de cabeamento estruturado e mão de obra homologada necessários para a completa infraestrutura física. O escopo abrange o enlace interpredial de fibra óptica subterrânea e o cabeamento local blindado.
                    </p>
                  </div>

                  {/* Bill of Materials (BOM) Grid */}
                  <div className="mt-6 space-y-5">
                    <h5 className="text-[10px] font-mono tracking-wide uppercase border-b border-zinc-250 pb-1 font-extrabold text-black m-0">
                      DETALHAMENTO CONSOLIDADO DE MATERIAIS E SERVIÇOS
                    </h5>

                    {/* Active Hardware */}
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-500 uppercase">1. EQUIPAMENTOS ATIVOS (BACKHAUL & WIRELESS)</span>
                      <table className="w-full text-left border-collapse text-[9.5px]">
                        <thead>
                          <tr className="bg-zinc-50 text-zinc-650 font-mono font-bold border-b border-zinc-300">
                            <th className="py-1 px-2 text-black">Hardware Ativo Selecionado</th>
                            <th className="py-1 px-2 text-center text-black">Fórmula/Fabricante</th>
                            <th className="py-1 px-2 text-right text-black">Preço Unitário</th>
                            <th className="py-1 px-2 text-center text-black">Qtd</th>
                            <th className="py-1 px-2 text-right text-black">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.filter(i => i.category === 'active').map((i, index) => (
                            <tr key={index} className="border-b border-zinc-100 font-sans">
                              <td className="py-1.5 px-2 font-medium text-black">
                                {i.name}
                                <span className="block text-[7.5px] text-zinc-500 font-mono">{i.specs}</span>
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-600">{i.brand}</td>
                              <td className="py-1.5 px-2 text-right font-mono text-zinc-600">R$ {i.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-800 font-semibold">{i.quantity}</td>
                              <td className="py-1.5 px-2 text-right font-mono font-bold text-black font-semibold">R$ {(i.unitPrice * i.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                          {items.filter(i => i.category === 'active').length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-2 text-center text-zinc-400 font-mono">Sem ativos selecionados</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Passive Hardware */}
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-500 uppercase">2. COMPONENTES PASSIVOS (CONECTIVIDADE CAT6A EMBUTIDA)</span>
                      <table className="w-full text-left border-collapse text-[9.5px]">
                        <thead>
                          <tr className="bg-zinc-50 text-zinc-650 font-mono font-bold border-b border-zinc-300">
                            <th className="py-1 px-2 text-black">Material Passivo Selecionado</th>
                            <th className="py-1 px-2 text-center text-black">Fórmula/Fabricante</th>
                            <th className="py-1 px-2 text-right text-black">Preço Unitário</th>
                            <th className="py-1 px-2 text-center text-black">Qtd</th>
                            <th className="py-1 px-2 text-right text-black">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.filter(i => i.category === 'passive').map((i, index) => (
                            <tr key={index} className="border-b border-zinc-100 font-sans">
                              <td className="py-1.5 px-2 font-medium text-black">
                                {i.name}
                                <span className="block text-[7.5px] text-zinc-500 font-mono">{i.specs}</span>
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-600">{i.brand}</td>
                              <td className="py-1.5 px-2 text-right font-mono text-zinc-600">R$ {i.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-800 font-semibold">{i.quantity}</td>
                              <td className="py-1.5 px-2 text-right font-mono font-bold text-black font-semibold">R$ {(i.unitPrice * i.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                          {items.filter(i => i.category === 'passive').length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-2 text-center text-zinc-400 font-mono">Sem passivos selecionados</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Infrastructure & Support */}
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-500 uppercase">3. INFRAESTRUTURA DE RACKS & PROTEÇÃO CIVIL</span>
                      <table className="w-full text-left border-collapse text-[9.5px]">
                        <thead>
                          <tr className="bg-zinc-50 text-zinc-650 font-mono font-bold border-b border-zinc-300">
                            <th className="py-1 px-2 text-black">Acessório Físico / Rack</th>
                            <th className="py-1 px-2 text-center text-black">Fórmula/Fabricante</th>
                            <th className="py-1 px-2 text-right text-black">Preço Unitário</th>
                            <th className="py-1 px-2 text-center text-black">Qtd</th>
                            <th className="py-1 px-2 text-right text-black">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.filter(i => i.category === 'infra').map((i, index) => (
                            <tr key={index} className="border-b border-zinc-100 font-sans">
                              <td className="py-1.5 px-2 font-medium text-black">
                                {i.name}
                                <span className="block text-[7.5px] text-zinc-500 font-mono">{i.specs}</span>
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-600">{i.brand}</td>
                              <td className="py-1.5 px-2 text-right font-mono text-zinc-600">R$ {i.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-800 font-semibold">{i.quantity}</td>
                              <td className="py-1.5 px-2 text-right font-mono font-bold text-black font-semibold">R$ {(i.unitPrice * i.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                          {items.filter(i => i.category === 'infra').length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-2 text-center text-zinc-400 font-mono">Sem materiais de infraestrutura selecionados</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Services and certification */}
                    {includeCertification && (
                      <div className="space-y-1.5">
                        <span className="text-[8.5px] font-mono font-bold tracking-widest text-zinc-500 uppercase">4. SERVIÇOS DE CERTIFICAÇÃO COM FLUKE DSX-8000</span>
                        <table className="w-full text-left border-collapse text-[9.5px]">
                          <thead>
                            <tr className="bg-zinc-50 text-zinc-650 font-mono font-bold border-b border-zinc-300">
                              <th className="py-1 px-2 text-black">Serviço Analítico Consultivo</th>
                              <th className="py-1 px-2 text-center text-black">Procedimento de Teste</th>
                              <th className="py-1 px-2 text-right text-black">Valor por Ponto</th>
                              <th className="py-1 px-2 text-center text-black">Pontos</th>
                              <th className="py-1 px-2 text-right text-black">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="font-sans">
                              <td className="py-1.5 px-2 font-medium text-black">
                                Laudo Técnico pericial de conformidade ABNT NBR 14565
                                <span className="block text-[7.5px] text-zinc-500 font-mono">
                                  Testes de diafonia NEXT, margens de atenuação, perdas ópticas e emissão de certificados oficiais via software LinkWare.
                                </span>
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-600">Varredura Fluke</td>
                              <td className="py-1.5 px-2 text-right font-mono text-zinc-600">R$ 35,00</td>
                              <td className="py-1.5 px-2 text-center font-mono text-zinc-800 font-semibold">{totalNetworkPoints}</td>
                              <td className="py-1.5 px-2 text-right font-mono font-bold text-black font-semibold">R$ {certificationCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Ecological / Profitability Section */}
                  {includeGreenSelo && (
                    <div className="mt-6 border border-emerald-300 bg-emerald-50 p-4 rounded-none font-sans flex items-start gap-3.5">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-full mt-1 shrink-0">
                        <Leaf className="w-5 h-5 text-emerald-800" />
                      </div>
                      <div className="space-y-1">
                        <h6 className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-widest m-0 leading-none">
                          HOMOLOGAÇÃO DE PROJETO SUSTENTÁVEL E LOGÍSTICA REVERSA
                        </h6>
                        <p className="text-[9.5px] text-emerald-950 m-0 leading-normal font-bold">
                          A P2P Engenharia assegura: "Ajudamos a tornar o seu sonho realidade sem prejudicar o meio ambiente."
                        </p>
                        <p className="text-[9px] text-zinc-600 m-0 leading-relaxed font-sans">
                          Todo o cobre metálico puro e componentes excedentes de racks em alumínio desinstalados ou cortados sob sobressalentes são destinados certificados ao canal Furukawa Green Cabling. Este compromisso de engenharia física reverteu créditos diretos aplicados à faturamento estrutural nesta listagem de preços.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Financial Summary Box */}
                  <div className="mt-8 border-t border-dashed border-zinc-400 pt-5 flex justify-end">
                    <div className="w-full md:w-80 space-y-2 text-[10px] font-sans">
                      <div className="flex justify-between text-zinc-600 font-mono">
                        <span>SUBTOTAL DO PROJETO:</span>
                        <span className="font-bold">R$ {rawTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-mono">
                          <span>DESCONTO COMERCIAL ({discountPercent}%):</span>
                          <span className="font-bold">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-end border-t border-black pt-2 bg-zinc-50 p-1.5">
                        <span className="font-bold text-black uppercase text-xs">VALOR LÍQUIDO FINAL:</span>
                        <span className="font-display font-black text-black text-sm font-mono font-bold">
                          R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corporate approval signatures block */}
                  <div className="mt-14 space-y-5">
                    <p className="text-center text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                      DEPARTAMENTO DE ENGENHARIA DE TELECOMANDO - CERTIFICAÇÃO CREA AP
                    </p>
                    <div className="grid grid-cols-3 gap-6 text-[8.5px] font-mono text-center">
                      <div className="space-y-1 font-sans">
                        <div className="border-t border-black pt-2 text-zinc-850 font-bold uppercase tracking-tight text-[9px]">
                          {getSignatureName(students?.[0]?.name, "P. H. Santos")}
                        </div>
                        <p className="text-[7.5px] text-zinc-500 uppercase m-0 leading-tight">Arquiteto de Redes Sênior</p>
                      </div>
                      <div className="space-y-1 font-sans">
                        <div className="border-t border-black pt-2 text-black font-bold uppercase tracking-tight text-[9px]">
                          {getSignatureName(students?.[1]?.name, "P. A. Souza")}
                        </div>
                        <p className="text-[7.5px] text-zinc-500 uppercase m-0 leading-tight border-0 bg-transparent">Coordenador Geral</p>
                      </div>
                      <div className="space-y-1 font-sans">
                        <div className="border-t border-black pt-2 text-zinc-850 font-bold uppercase tracking-tight text-[9px]">
                          {getSignatureName(students?.[2]?.name, "L. G. Ferreira")}
                        </div>
                        <p className="text-[7.5px] text-zinc-500 uppercase m-0 leading-tight">Engenharia de Campo CREA/AP</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
