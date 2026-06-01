import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, ShieldCheck, Activity, Cpu, FileText, 
  CheckCircle, MessageSquare, LogOut, ArrowRight, Radio, ExternalLink, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  clientName: string;
  setClientName: (val: string) => void;
  emailInput: string;
  setEmailInput: (val: string) => void;
  linkThroughput: number;
  activePortalTab: string;
  setActivePortalTab: (val: string) => void;
  ticketSubject: string;
  setTicketSubject: (val: string) => void;
  ticketSent: boolean;
  setTicketSent: (val: boolean) => void;
  onLogout: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  isLoggedIn,
  setIsLoggedIn,
  clientName,
  setClientName,
  emailInput,
  setEmailInput,
  linkThroughput,
  activePortalTab,
  setActivePortalTab,
  ticketSubject,
  setTicketSubject,
  ticketSent,
  setTicketSent,
  onLogout
}: LoginModalProps) {
  
  const [passInput, setPassInput] = useState<string>('');
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Optical transceivers parameters simulation
  const [opticalPower, setOpticalPower] = useState<number>(-3.15);
  const [temp, setTemp] = useState<number>(41.8);
  const [voltage, setVoltage] = useState<number>(3.31);

  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(() => {
      setOpticalPower(+(-3.0 - Math.random() * 0.4).toFixed(2));
      setTemp(+(41.0 + Math.random() * 1.5).toFixed(1));
      setVoltage(+(3.29 + Math.random() * 0.04).toFixed(2));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setFormError("O email corporativo é obrigatório.");
      return;
    }
    if (passInput.length < 4) {
      setFormError("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    setFormError(null);
    setAuthenticating(true);

    setTimeout(() => {
      setIsLoggedIn(true);
      setAuthenticating(false);
      setActivePortalTab("telemetria");
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="login-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Blurred Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#09090b] border border-zinc-900 w-full max-w-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
        >
          {/* Decorative Top Border */}
          <div className="h-1 w-full bg-gradient-to-r from-zinc-800 via-white to-zinc-800 shrink-0" />

          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b border-zinc-900 bg-[#0c0c0f] shrink-0">
            <div>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-zinc-500 block">
                {isLoggedIn ? "CONSOLE CORPORATIVO AUTENTICADO" : "CONEXÃO CRIPTOGRAFADA"}
              </span>
              <h3 className="text-sm font-sans font-black text-white uppercase tracking-wider mt-0.5">
                {isLoggedIn ? "Portal de Infraestrutura P2P" : "Acessar Portal do Cliente"}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900 transition rounded-none cursor-pointer border border-transparent hover:border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-[380px] max-h-[75vh]">
            {!isLoggedIn ? (
              /* LOGIN STATE */
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[12px] text-zinc-450 leading-relaxed font-sans">
                    Bem-vindo à central de relatórios de conformidade e integridade física de links. Insira suas credenciais corporativas fornecidas pela engenharia P2P.
                  </p>
                  <p className="text-[10px] text-zinc-550 italic font-sans">
                    *Para testar imediatamente, você pode preencher qualquer nome e senha abaixo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-950/20 border border-red-900/50 text-[11px] text-red-400 font-sans">
                      {formError}
                    </div>
                  )}

                  {/* Nome Cliente */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Nome do Cliente / Gestor</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="text" 
                        required 
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Alessandro Passos"
                        className="w-full bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 text-xs px-10 py-3 rounded-none outline-none font-sans text-white placeholder-zinc-700 transition"
                      />
                    </div>
                  </div>

                  {/* Email Corporativo */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Email Corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="email" 
                        required 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Ex: alepassos.san@gmail.com"
                        className="w-full bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 text-xs px-10 py-3 rounded-none outline-none font-sans text-white placeholder-zinc-700 transition"
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Senha de Técnico</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <input 
                        type="password" 
                        required 
                        value={passInput}
                        onChange={(e) => setPassInput(e.target.value)}
                        placeholder="Digite sua senha cadastrada"
                        className="w-full bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 text-xs px-10 py-3 rounded-none outline-none font-sans text-white placeholder-zinc-700 transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={authenticating}
                      className="w-full bg-white hover:bg-zinc-200 text-black text-[11px] font-sans font-black uppercase tracking-[0.16em] py-4 rounded-none transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authenticating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Autenticando Acesso...</span>
                        </>
                      ) : (
                        <>
                          <span>Realizar Login</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Secure footer notification */}
                <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-none flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-500 leading-normal font-sans">
                    Para conformidade com a segurança da informação, sessões inativas expiram mecanicamente. Todos os acessos de auditoria são assinados digitalmente.
                  </p>
                </div>
              </div>
            ) : (
              /* LOGGED IN VIEW - CUSTOMER PORTAL */
              <div className="space-y-6">
                
                {/* Upper client row welcome card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-zinc-950 border border-zinc-900 rounded-none gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-mono font-black text-xs">
                      P2P
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{clientName}</h4>
                      <p className="text-[10px] text-zinc-500 font-sans mt-0.5">{emailInput} • Cliente Autorizado</p>
                    </div>
                  </div>

                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-850 text-[10px] font-mono uppercase tracking-wider transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair</span>
                  </button>
                </div>

                {/* Dashboard Menu Tabs */}
                <div className="flex border-b border-zinc-900 shrink-0">
                  <button 
                    onClick={() => { setActivePortalTab("telemetria"); setTicketSent(false); }}
                    className={`flex items-center gap-2 py-3 px-4 border-b-2 text-[10px] font-sans font-bold uppercase tracking-wider cursor-pointer transition ${
                      activePortalTab === "telemetria"
                        ? "border-white text-white"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>⚡ Telemetria Ativa</span>
                  </button>

                  <button 
                    onClick={() => { setActivePortalTab("laudos"); setTicketSent(false); }}
                    className={`flex items-center gap-2 py-3 px-4 border-b-2 text-[10px] font-sans font-bold uppercase tracking-wider cursor-pointer transition ${
                      activePortalTab === "laudos"
                        ? "border-white text-white"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>🛡️ Laudos & Conformidade</span>
                  </button>

                  <button 
                    onClick={() => { setActivePortalTab("suporte"); }}
                    className={`flex items-center gap-2 py-3 px-4 border-b-2 text-[10px] font-sans font-bold uppercase tracking-wider cursor-pointer transition ${
                      activePortalTab === "suporte"
                        ? "border-white text-white"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>📋 Técnico & Chamados</span>
                  </button>
                </div>

                {/* Tab content panel */}
                <div>
                  {activePortalTab === "telemetria" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Box 1: Bandwidth */}
                        <div className="bg-[#0b0b0e] border border-zinc-900 p-4">
                          <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block font-bold">PROCESSO DE TRANSMISSÃO</span>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-2xl font-mono text-white font-extrabold">{linkThroughput.toFixed(3)}</span>
                            <span className="text-zinc-500 text-[10px] font-mono uppercase">Gbps</span>
                          </div>
                          <span className="text-[9px] text-emerald-400 font-mono mt-2 flex items-center gap-1 font-bold">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Fibra OS2 • Opticamente Estável
                          </span>
                        </div>

                        {/* Box 2: Optical Power */}
                        <div className="bg-[#0b0b0e] border border-zinc-900 p-4">
                          <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block font-bold">SINAL DE ENLACE RX</span>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-2xl font-mono text-white font-extrabold">{opticalPower}</span>
                            <span className="text-zinc-500 text-[10px] font-mono uppercase">dBm</span>
                          </div>
                          <span className="text-[9px] text-zinc-400 font-mono mt-2 block">
                            Margem recomendada: &gt; -15 dBm
                          </span>
                        </div>

                        {/* Box 3: Transceiver metrics */}
                        <div className="bg-[#0b0b0e] border border-zinc-900 p-4">
                          <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase block font-bold">TEMPERATURA & VOLTAGEM</span>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-base font-mono text-white font-extrabold">{temp}°C</span>
                            <span className="text-zinc-600 text-xs font-mono">/</span>
                            <span className="text-base font-mono text-white font-bold">{voltage}V</span>
                          </div>
                          <span className="text-[9px] text-zinc-400 font-mono mt-2 block">
                            Hardware do Chassi Ubiquiti L3
                          </span>
                        </div>
                      </div>

                      {/* Optical Path Schema details */}
                      <div className="border border-zinc-900 bg-zinc-950 p-4 font-mono text-[10px] space-y-3">
                        <span className="text-zinc-350 font-sans font-bold uppercase tracking-wide block">Roteamento Opticamente Monitorado</span>
                        <div className="space-y-2 border-l border-zinc-850 pl-3">
                          <div className="flex items-center gap-2">
                            <Radio className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-zinc-400">Prédio 1 (Bloco Operações) → Transceptor SFP+ (10GBASE-LR 1310nm)</span>
                            <span className="ml-auto text-emerald-400 font-bold uppercase">TX ATIVO</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-zinc-400">Canal Físico Subterrâneo 4 vias OS2 Monomodo (120 metros)</span>
                            <span className="ml-auto text-emerald-400 font-bold">0.02 dB/km LOSS</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Radio className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="text-zinc-400">Prédio 2 (CPD Central) → Unidade Sw. Ubiquiti Gen2 PoE+ rackmount</span>
                            <span className="ml-auto text-emerald-400 font-bold uppercase">RX ATIVO</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activePortalTab === "laudos" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5 mb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Laudos de Certificação Emitidos</h4>
                        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                          Nossos relatórios possuem validade legal com registro CREA/ART. Baixe ou analise as leituras capturadas por equipamentos Fluke Networks.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {/* Cert 1 */}
                        <div className="p-4 bg-[#0b0b0e] border border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-800 text-white rounded-none shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-[11px] font-sans font-extrabold text-white uppercase tracking-wider">Laudo Relatório do Bloco 1 (Cobre Cat6A Especializado)</h5>
                              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Parâmetros: NBR 14565 • Equipamento: Fluke DSX-8000 • 48 Pontos Certificados</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-900/30 text-emerald-400 px-3 py-1 border border-emerald-900 uppercase">
                            🔋 PASS / OK
                          </span>
                        </div>

                        {/* Cert 2 */}
                        <div className="p-4 bg-[#0b0b0e] border border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-800 text-white rounded-none shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-[11px] font-sans font-extrabold text-white uppercase tracking-wider">Laudo Relatório Fibra OS2 (Backbone Fluke CertiFiber)</h5>
                              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Vias calibradas com OTDR a 1310/1550nm • Atenuação total: 0.12 dB • Enlace Interpredial</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-900/30 text-emerald-400 px-3 py-1 border border-emerald-900 uppercase">
                            🔋 PASS / OK
                          </span>
                        </div>

                        {/* Cert 3 */}
                        <div className="p-4 bg-[#0b0b0e] border border-zinc-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-800 text-white rounded-none shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-[11px] font-sans font-extrabold text-white uppercase tracking-wider">Laudo Aterramento e Equipotencialidade de Chassi Racks (NBR 5410)</h5>
                              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Resistência aferida: 4.2 Ohms • Proteções de surto classe II e barras de cobre TGB instaladas</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-900/30 text-emerald-400 px-3 py-1 border border-emerald-900 uppercase">
                            🔋 PASS / OK
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activePortalTab === "suporte" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {ticketSent ? (
                        <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-none text-center space-y-3">
                          <div className="inline-flex p-3 bg-emerald-950/25 border border-emerald-900 text-emerald-400 items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solicitação Registrada Oficialmente no CREA!</h4>
                          <p className="text-[11px] text-zinc-550 max-w-md mx-auto leading-relaxed">
                            O chamado foi ativado e transmitido com prioridade técnica. Nosso diretor de testes **Matheus Pinheiro** ou a Engenheira Civil **Diene Juliane** responderá por email e gerará a respectiva ART técnica corporativa.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={() => { setTicketSent(false); setTicketSubject(""); }}
                              className="text-[10px] uppercase tracking-wider font-mono px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-850 cursor-pointer transition"
                            >
                              Novo Chamado
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Suporte Técnico de Engenharia</h4>
                            <p className="text-[11px] text-zinc-500 font-sans">
                              Abra um ticket direto para os engenheiros regulamentados da P2P Cabeamento.
                            </p>
                          </div>

                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (ticketSubject.trim()) {
                                setTicketSent(true);
                              }
                            }}
                            className="space-y-3.5"
                          >
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Assunto / Tipo de Incidente</label>
                              <input 
                                type="text"
                                required
                                value={ticketSubject}
                                onChange={(e) => setTicketSubject(e.target.value)}
                                placeholder="Ex: Solicitar expansão de pontos Cat6A ou alteração de topologia"
                                className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-850 focus:border-zinc-700 text-xs px-4  py-3 rounded-none outline-none font-sans text-white placeholder-zinc-700 transition"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Descrição da Solicitação Técnica</label>
                              <textarea 
                                rows={3}
                                required
                                placeholder="Descreva os detalhes da alteração regulamentada ou suporte físico necessário..."
                                className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-850 focus:border-zinc-700 text-xs px-4 py-3 rounded-none outline-none font-sans text-white placeholder-zinc-700 transition resize-none"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-white hover:bg-zinc-200 text-black text-[11px] font-sans font-black uppercase tracking-[0.16em] py-3.5 rounded-none transition cursor-pointer"
                            >
                              Registrar Solicitação com ART
                            </button>
                          </form>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
