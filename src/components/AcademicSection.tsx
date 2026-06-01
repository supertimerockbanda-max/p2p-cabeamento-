/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COMPANHIA } from '../data';
import { 
  Star, Code, Cpu, Award, 
  ChevronRight, Sparkles, Building2, Terminal, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { TeamMember } from '../types';
import React from 'react';

interface AcademicSectionProps {
  students: TeamMember[];
  setStudents: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

const getInitials = (name: string): string => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function AcademicSection({ students, setStudents }: AcademicSectionProps) {
  return (
    <div className="space-y-12 select-none font-sans" id="equipe-tecnica">
      
      {/* Engineering Department Hero Header */}
      <div className="bg-[#0e0e11] border border-zinc-900 rounded-none p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Logo / Badge Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-zinc-950 border border-zinc-900">
            <ShieldCheck className="w-16 h-16 text-white mb-3" />
            <span className="text-xs font-sans text-white font-extrabold uppercase tracking-[0.16em] block">
              DIVISÃO DE PROJETOS FÍSICOS
            </span>
            <p className="text-xs text-zinc-500 mt-1">
              P2P Engenharia & Operações de TI
            </p>
            
            <div className="h-px bg-zinc-900 w-full my-4" />
            
            <span className="text-[10px] text-zinc-500 uppercase font-sans block tracking-wider">Diretoria de Engenharia:</span>
            <p className="text-xs font-bold text-white mt-0.5">CREA-AP / Região Norte</p>
            <p className="text-[10px] text-zinc-500 font-sans tracking-tight">Supervisão Técnica da Bancada de Testes</p>
          </div>

          {/* Project goals column (8 cols) */}
          <div className="lg:col-span-8 space-y-4 text-left">
            <span className="text-xs font-sans text-white bg-zinc-900 px-3.5 py-1.5 border border-zinc-800 inline-block font-extrabold uppercase tracking-wide">
              INFRAESTRUTURA DE MISSÃO CRÍTICA
            </span>
            <h3 className="text-2xl md:text-3xl font-sans font-black text-white uppercase tracking-tight leading-none">
              Engenharia Física e Documentação Normativa
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
              Nossas soluções representam a consolidação de toda a engenharia de cabeamento estruturado. Projetamos layouts físicos focados em cenários de alta disponibilidade para a interconexão segura de redes interprediais em indústrias, escritórios modernos e grandes centros corporativos de processamento de dados.
            </p>

            {/* Quick Goals bullet list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Normas técnicas ABNT NBR 14565 e TIA/EIA</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Fusão de Fibra Óptica Monomodo OS2</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Cabeamento interno estruturado Cat6A F/UTP</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-white" />
                <span>Dimensionamento de Ativos e Racks 19&quot;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Grid */}
      <div className="space-y-6">
        <div className="text-center flex flex-col items-center space-y-2 max-w-2xl mx-auto w-full">
          <span className="text-[10px] font-mono text-zinc-400 tracking-wider font-extrabold uppercase block selection:bg-transparent text-center">
            CORPO DIRETIVO, SÓCIOS E ADMINISTRADORES
          </span>
          <h3 className="text-2xl font-sans font-black text-white uppercase leading-none text-center">
            Quadro de Sócios-Diretores & Autores do Projeto
          </h3>
          <p className="text-zinc-400 text-sm max-w-xl font-sans text-center mx-auto">
            Membros fundadores e proprietários da P2P Cabeamento Estruturado, liderando a administração corporativa e a engenharia física das implantações de rede no Norte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {students.map((member, index) => (
            <div 
              key={index}
              className="bg-[#0e0e11] border border-zinc-900 rounded-none p-5 hover:border-zinc-700 transition duration-300 flex flex-col justify-between shadow-xs font-sans"
            >
              <div>
                {/* Simulated Avatar representing initials */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-none bg-white text-black text-base font-black flex items-center justify-center font-sans shadow-md">
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{member.name || `Aluno Integrante ${index + 1}`}</h4>
                    <span className="text-[10px] font-sans text-zinc-400 uppercase tracking-widest font-extrabold block mt-0.5">{member.role}</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                  {member.bio}
                </p>
              </div>

              {/* Badges of skills */}
              <div className="pt-3 border-t border-zinc-900">
                <span className="text-[9px] font-sans text-zinc-500 uppercase tracking-widest block mb-2 font-extrabold">
                  Especializações Técnicas:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {member.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-[9px] font-mono bg-zinc-950 px-2 py-0.5 rounded-none border border-zinc-900 text-zinc-350"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Quality Agreement SLA (instead of didactic guidelines) */}
      <div className="bg-zinc-950 p-5 rounded-none border border-zinc-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-xs">
        <Terminal className="w-8 h-8 text-white flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-extrabold text-white uppercase font-sans text-[10px] tracking-[0.16em]">
            GARANTIA DE CONFORMIDADE FÍSICA E HOMOLOGAÇÃO
          </p>
          <p className="text-zinc-450 leading-normal text-[11px]">
            Nossos projetos atendem de forma integral as normas regulatórias de cabeamento e telecomunicações: organização de tomadas Cat6A com blindagem eletromagnética completa, dimensionamento de racks TIA de 19 polegadas com aterramento seguro, duto de passagem externa PE-AD sob calçadas e tráfego corporativo de alta performance livre de atenuações mecânicas.
          </p>
        </div>
      </div>

    </div>
  );
}
