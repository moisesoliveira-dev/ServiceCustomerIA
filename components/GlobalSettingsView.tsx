
import React, { useState } from 'react';
import { useApp } from '../App';
import { Badge, Card, SectionHeader } from './ui/Core';
import { motion } from 'framer-motion';

const GlobalSettingsView: React.FC = () => {
  const { globalVars, setGlobalVars } = useApp();
  const [activeTab, setActiveTab] = useState<'env' | 'rbac' | 'system'>('env');

  return (
    <div className="flex-1 p-10 bg-[#0b1120] overflow-y-auto custom-scrollbar">
      <SectionHeader 
        title="Global Configuration" 
        subtitle="Gerenciamento central de infraestrutura, segredos e controle de acesso"
      />

      <div className="flex space-x-8 mb-10 border-b border-white/5">
        {[
          { id: 'env', label: 'Env Vars & Secrets' },
          { id: 'rbac', label: 'Permissions & RBAC' },
          { id: 'system', label: 'System Health' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="setting-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {activeTab === 'env' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <h3 className="text-sm font-bold text-white">Environment Variables</h3>
                 <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Disponíveis em todos os stages de orquestração</p>
               </div>
               <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-500 hover:bg-slate-800 transition-all">+ Add Variable</button>
            </div>
            
            <Card noPadding>
              <div className="divide-y divide-white/5">
                {globalVars.map(v => (
                  <div key={v.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                    <div className="flex items-center space-x-8">
                      <div className="w-48">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Key Name</p>
                        <p className="text-xs font-mono text-blue-400">{v.key}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Value</p>
                        <p className={`text-xs font-mono ${v.isSecret ? 'text-slate-700' : 'text-slate-300'}`}>
                          {v.isSecret ? '••••••••••••••••' : v.value}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {v.isSecret && <Badge color="amber">SECRET</Badge>}
                      <button className="text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest px-2">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20">
               <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center">
                 <span className="mr-2">⚠️</span> Security Warning
               </h4>
               <p className="text-xs text-amber-200/60 leading-relaxed italic">
                 Variáveis marcadas como "Secret" são criptografadas em repouso e nunca exibidas em logs de execução ou previews da IA.
               </p>
            </div>
          </div>
        )}

        {activeTab === 'rbac' && (
          <div className="space-y-6">
             <Card>
               <h3 className="text-sm font-bold text-white mb-6">User Roles & Scopes</h3>
               <div className="space-y-4">
                 {[
                   { user: 'admin@nexus.ai', role: 'MASTER_ADMIN', scope: 'GLOBAL' },
                   { user: 'operator@nexus.ai', role: 'FLOW_DESIGNER', scope: 'TENANT_A' },
                   { user: 'viewer@nexus.ai', role: 'AUDITOR', scope: 'GLOBAL_LOGS' }
                 ].map((u, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                     <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">{u.user[0].toUpperCase()}</div>
                        <div>
                           <p className="text-xs font-bold text-slate-200">{u.user}</p>
                           <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black">{u.scope}</p>
                        </div>
                     </div>
                     <Badge color={u.role.includes('ADMIN') ? 'blue' : 'slate'}>{u.role}</Badge>
                   </div>
                 ))}
               </div>
             </Card>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="grid grid-cols-2 gap-6">
             <Card className="border-emerald-500/20">
               <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Core Orchestrator</h4>
               <div className="flex items-end justify-between">
                 <span className="text-3xl font-black text-white">UP</span>
                 <span className="text-[10px] text-slate-600 font-mono">v2.4.1-stable</span>
               </div>
             </Card>
             <Card className="border-blue-500/20">
               <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Gemini API Connectivity</h4>
               <div className="flex items-end justify-between">
                 <span className="text-3xl font-black text-white">LATENCY: 42ms</span>
                 <span className="text-[10px] text-slate-600 font-mono">100% Uptime</span>
               </div>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSettingsView;
