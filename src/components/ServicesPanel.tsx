/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SERVICES } from '../data';
import { CablingService } from '../types';
import { 
  Cable, Zap, ShieldCheck, Cpu, HardDrive, ArrowRight, CheckCircle2,
  Eye, Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ServicesPanel() {
  const [activeServiceId, setActiveServiceId] = useState<string>("vistoria-tecnica");

  const activeService = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];

  const getServiceIcon = (id: string, css: string) => {
    switch(id) {
      case "vistoria-tecnica": return <Eye className={css} />;
      case "revisao-auditoria": return <Wrench className={css} />;
      case "cab-estruturado": return <Cable className={css} />;
      case "fibra-backbone": return <Zap className={css} />;
      case "certificacao-redes": return <ShieldCheck className={css} />;
      default: return <Cpu className={css} />;
    }
  };

  return (
    <div className="space-y-8 select-none" id="servicos-oferecidos">
      {/* Grid: Left Navigation / Right Active Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Navigation list (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          {SERVICES.map((srv) => {
            const isActive = srv.id === activeServiceId;
            return (
              <button
                key={srv.id}
                onClick={() => setActiveServiceId(srv.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 cursor-pointer ${
                  isActive 
                    ? "bg-zinc-950 border-white shadow-xl" 
                    : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30"
                }`}
              >
                <div className={`p-2.5 rounded-lg border ${
                  isActive 
                    ? "bg-white border-white text-black" 
                    : "bg-zinc-900 border-zinc-850 text-zinc-300"
                }`}>
                  {getServiceIcon(srv.id, "w-5 h-5")}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-mono text-zinc-455 uppercase tracking-wider font-semibold">Tópico Operacional</h4>
                  <p className="text-sm font-bold text-white truncate mt-0.5">{srv.title}</p>
                </div>

                <ArrowRight className={`w-4 h-4 transition ${isActive ? "text-white translate-x-1" : "text-zinc-500"}`} />
              </button>
            );
          })}

          <div className="p-4 rounded-xl bg-zinc-950/65 border border-zinc-900 space-y-2 mt-4 text-xs">
            <span className="text-zinc-300 font-mono text-[10px] font-semibold flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              Garantia Estendida Furukawa
            </span>
            <p className="text-zinc-405 leading-normal text-[11px] font-sans">
              Como instaladores parceiros habilitados, nossos clientes clínicos e corporativos no Amapá conquistam até <strong>25 anos de garantia</strong> certificada diretamente junto aos maiores fabricantes globais.
            </p>
          </div>
        </div>

        {/* Detailed Pane (8 Columns) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait flex flex-col justify-between">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0e0e11] border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
                  <div className="p-3 bg-white text-black rounded-xl">
                    {getServiceIcon(activeService.id, "w-8 h-8")}
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase font-semibold block">SERVIÇO HOMOLOGADO</span>
                    <h3 className="text-xl font-display font-bold text-white mt-0.5">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                {/* Subtitle/Focus */}
                <p className="text-zinc-200 text-sm leading-relaxed border-l-4 border-white pl-4 font-medium italic">
                  {activeService.shortDesc}
                </p>

                {/* Detailed descriptions */}
                <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                  {activeService.fullDesc}
                </p>

                {/* Benefits List */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                    Benefícios e Vantagens chaves:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeService.benefits.map((benefit, i) => (
                      <div key={i} className="flex gap-2.5 text-xs text-zinc-400 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-emerald-450 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications List */}
                <div className="space-y-3 pt-3 border-t border-zinc-900">
                  <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-semibold">
                    Padrões de Execução Prática:
                  </h4>
                  <ul className="list-inside space-y-2 text-xs text-zinc-400 list-none font-sans">
                    {activeService.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-650" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Call for custom support */}
              <div className="mt-8 pt-6 border-t border-zinc-900 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-xs text-zinc-450 font-sans">
                  Precisa de uma execução consultiva no Amapá? Fale conosco hoje.
                </span>
                <a 
                  href="#contato"
                  className="px-4 py-2 bg-white hover:bg-zinc-150 text-black text-xs font-medium rounded-lg transition"
                >
                  Solicitar Vistoria Técnica
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
