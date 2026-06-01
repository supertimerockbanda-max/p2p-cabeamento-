/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { COMPANHIA } from '../data';
import { 
  Send, Mail, Phone, MapPin, Terminal, CheckCircle2, 
  ArrowRight, ShieldCheck, Clock, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Macapá',
    distance: '100m',
    points: 'Sob Vistoria',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // For progress logs
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const amapaCities = [
    "Macapá", "Santana", "Laranjal do Jari", "Mazagão", "Oiapoque", "Porto Grande"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const executeSimulation = async () => {
    setIsSubmitting(true);
    setSubmitStep(1); // Connecting to network

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    await delay(1000);
    setSubmitStep(2); // Analyzing paths

    await delay(1200);
    setSubmitStep(3); // Registering node queue

    await delay(1050);
    const randTicket = "P2P-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randTicket);
    setSubmitStep(4); // Success

    await delay(500);
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Por favor, preencha o Nome, E-mail e Telefone.");
      return;
    }
    executeSimulation();
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: 'Macapá',
      distance: '100m',
      points: 'Sob Vistoria',
      message: ''
    });
    setSubmitted(false);
    setSubmitStep(0);
  };

  return (
    <div className="space-y-8 animate-fade-in select-none" id="contato-suporte">
      
      {/* Headings */}
      <div className="border-b border-zinc-900 pb-5 text-left">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold block">
          CENTRAL DE ATENDIMENTO E SUPORTE TÉCNICO
        </span>
        <h2 className="text-2xl font-display font-bold text-white uppercase mt-2">
          Contato & Solicitação de Vistoria
        </h2>
        <p className="text-zinc-400 text-sm mt-1 max-w-2xl font-sans">
          Fale diretamente com os projetistas da P2P. Atendimento corporativo rápido para Macapá, Santana e demais regiões do Amapá.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Contact Info column (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 font-sans">
          <div className="bg-[#0e0e11] border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight font-sans">
              Nossa Sede Central
            </h3>
            
            <div className="space-y-4">
              
              {/* Address */}
              <div className="flex items-start gap-4 text-xs">
                <div className="p-2.5 bg-zinc-900 text-white border border-zinc-800 rounded-lg">
                  <MapPin className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-200">Endereço de Atendimento</h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Av. FAB, 1250 - Central, Macapá - AP, 68900-010
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 text-xs">
                <div className="p-2.5 bg-zinc-900 text-white border border-zinc-800 rounded-lg">
                  <Mail className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-200 font-sans">E-mail Comercial</h4>
                  <p className="text-zinc-300 mt-0.5 font-mono">
                    contato@p2pcabeamento.com.br
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    comercial@p2p.inf.br
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 text-xs">
                <div className="p-2.5 bg-zinc-900 text-white border border-zinc-800 rounded-lg">
                  <Phone className="w-4 h-4 text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-200 font-sans">Suporte Técnico</h4>
                  <p className="text-zinc-400 mt-0.5 font-mono">
                    +55 (96) 99123-4567 (Simulação Suporte)
                  </p>
                </div>
              </div>

            </div>

            {/* Quick stats and operating hours */}
            <div className="pt-4 border-t border-zinc-900 space-y-3.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-450" />
                <span>Atendimento: Segunda a Sexta das 14h às 22h</span>
              </div>
              
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-450" />
                <span>Projetado dentro das normas TIA e CREA AP</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#0e0e11] border border-zinc-900 rounded-2xl">
            <h4 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider mb-2">
              Regras Administrativas Amapá
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Todos os nossos projetos e desenhos físicos são devidamente acompanhados de ART (Anotação de Responsabilidade Técnica) junto ao CREA, atestando conformidade plena para vistorias públicas, faturamento e vistorias sanitárias hospitalares locais amapaenses.
            </p>
          </div>
        </div>

        {/* Dynamic Interactive support and contact form - (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="bg-[#0e0e11] border border-zinc-900 rounded-2xl p-6 md:p-8 h-full shadow-sm">
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleSubmit} 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-sm font-bold text-white font-display uppercase tracking-wide border-b border-zinc-900 pb-2 mb-4 font-sans">
                    Solicitar Site Survey Técnico
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Name */}
                    <div className="space-y-1 text-xs font-sans">
                      <label className="text-zinc-300 font-medium">Nome Completo / Empresa:</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Ex: Distribuidora Amapá ou Nome Próprio"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-white focus:border-zinc-700 focus:outline-none transition font-sans text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1 text-xs font-sans">
                      <label className="text-zinc-300 font-medium">E-mail Corporativo:</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Ex: ti@clinicasaude.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-white focus:border-zinc-700 focus:outline-none transition font-sans text-xs"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Phone */}
                    <div className="space-y-1 text-xs font-sans">
                      <label className="text-zinc-300 font-medium font-sans">WhatsApp / Telefone:</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Ex: (96) 98112-3456"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-white focus:border-zinc-700 focus:outline-none transition font-sans text-xs"
                      />
                    </div>

                    {/* City Selection */}
                    <div className="space-y-1 text-xs font-sans">
                      <label className="text-zinc-300 font-medium font-sans">Município (AP):</label>
                      <select 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-white focus:border-zinc-700 focus:outline-none transition font-sans text-xs"
                      >
                        {amapaCities.map(cty => (
                          <option key={cty} value={cty}>{cty}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Message */}
                  <div className="space-y-1 text-xs font-sans">
                    <label className="text-zinc-300 font-medium">Descrição Adicional de Requisitos:</label>
                    <textarea 
                      name="message" 
                      rows={3}
                      placeholder="Espaço livre para detalhar se precisa de interligação aérea, piso elevado para CPD ou identificação de racks antigos..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 text-white focus:border-zinc-700 focus:outline-none transition font-sans text-xs resize-none"
                    />
                  </div>

                  {/* Terminal output simulation block while isSubmitting */}
                  {isSubmitting && (
                    <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-900 font-mono text-[10px] space-y-1.5 text-zinc-300">
                      <div className="flex items-center gap-1.5 font-bold uppercase border-b border-zinc-900 pb-1.5 text-zinc-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Log de Traceroute Técnico - P2P Server AP</span>
                      </div>
                      
                      {submitStep >= 1 && (
                        <p className="animate-pulse text-zinc-400">▶ ESTABELECENDO CONEXÃO: {formData.city.toUpperCase()}-P2P.ENGINEERING.NET...</p>
                      )}
                      
                      {submitStep >= 2 && (
                        <p className="text-zinc-300">✔ LINK FÍSICO DETECTADO: Canal Ativo 10G duplex. Latency: 0.8ms</p>
                      )}
                      
                      {submitStep >= 3 && (
                        <p className="text-zinc-300">▲ EFETUANDO ENFILEIRAMENTO: Pontos={formData.points} de dados.</p>
                      )}
                      
                      {submitStep >= 4 && (
                        <p className="text-emerald-400 font-bold">★ CONCLUÍDO: Registro Efetuado com sucesso no CPD central.</p>
                      )}
                    </div>
                  )}

                  {!isSubmitting && (
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-white hover:bg-zinc-150 text-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer mt-4 font-sans"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Chamado de Suporte e Site Survey
                    </button>
                  )}

                </motion.form>
              ) : (
                <motion.div 
                  key="submitted-state"
                  className="flex flex-col items-center justify-center text-center py-10 space-y-4 font-sans"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="h-16 w-16 bg-[#0c0c0e] text-emerald-400 rounded-full flex items-center justify-center border border-zinc-800 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono bg-zinc-950 px-3 py-1 rounded-full border border-zinc-900 font-semibold select-none">
                      Chamado de Redes Cadastrado!
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mt-1">
                      Obrigado pelo seu contato!
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                      Seu pedido de Site Survey foi catalogado em nosso painel administrativo. Retornaremos em breve por telefone ou e-mail com a data sugerida do agendamento.
                    </p>
                  </div>

                  <div className="bg-[#050507] rounded-xl p-4 w-full border border-zinc-900 font-mono text-left max-w-sm space-y-2 text-[11px] text-zinc-300">
                    <p className="text-zinc-500 uppercase tracking-widest text-[9px] border-b border-zinc-900 pb-1">
                      Comprovante de Cadastro Lógico:
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Protocolo:</span>
                      <span className="text-white font-semibold">{ticketId}</span>
                    </p>
                    <p className="flex justify-between font-sans">
                      <span className="text-zinc-500 font-mono">Cliente Origem:</span>
                      <span className="text-white font-semibold">{formData.name}</span>
                    </p>
                    <p className="flex justify-between font-sans">
                      <span className="text-zinc-500 font-mono">Cidade Alvo:</span>
                      <span className="text-white font-semibold">{formData.city}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Pontos Rede:</span>
                      <span className="text-white font-semibold">{formData.points} Pontos</span>
                    </p>
                  </div>

                  <button
                    onClick={handleResetForm}
                    className="py-2.5 px-6 bg-zinc-900 hover:bg-zinc-805 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition mt-4 cursor-pointer"
                  >
                    Novo Chamado / Registrar outro
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
