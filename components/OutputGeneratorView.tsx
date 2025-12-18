
import React, { useState } from 'react';
import { useApp } from '../App';
import { Badge, Card, CodeEditor, SectionHeader } from './ui/Core';
import { OutputRoute, Header, OutputExecution } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from './Icons';

const AVAILABLE_VARIABLES = [
  { key: '{{conversation.id}}', description: 'ID Único da Sessão' },
  { key: '{{customer.name}}', description: 'Nome do Cliente Normalizado' },
  { key: '{{state.intent}}', description: 'Intenção detectada pela IA' },
  { key: '{{ai.output}}', description: 'Resposta final gerada' },
  { key: '{{ai.summary}}', description: 'Resumo da interação' },
  { key: '{{system.timestamp}}', description: 'Horário da execução' }
];

const OutputGeneratorView: React.FC = () => {
  const { activeCompany, updateCompany } = useApp();
  const [editingRoute, setEditingRoute] = useState<OutputRoute | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'history'>('config');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  if (!activeCompany) return null;

  const routes = activeCompany.outputRoutes || [];

  const handleSave = () => {
    if (!editingRoute) return;
    const newRoutes = routes.find(r => r.id === editingRoute.id)
      ? routes.map(r => r.id === editingRoute.id ? editingRoute : r)
      : [...routes, editingRoute];
    
    updateCompany(activeCompany.id, { outputRoutes: newRoutes });
    setEditingRoute(null);
    setSimulationResult(null);
  };

  const runSimulation = () => {
    if (!editingRoute) return;
    setIsSimulating(true);
    
    // Simula interpolação de variáveis
    let interpolatedBody = editingRoute.bodyTemplate;
    AVAILABLE_VARIABLES.forEach(v => {
      interpolatedBody = interpolatedBody.replace(new RegExp(v.key, 'g'), `"Valor_Exemplo_${v.key.split('.')[1].replace('}}', '')}"`);
    });

    setTimeout(() => {
      const newExecution: OutputExecution = {
        id: `EXEC-${Math.floor(Math.random() * 10000)}`,
        timestamp: new Date().toLocaleString(),
        status: 200,
        duration: '142ms',
        payload: JSON.parse(interpolatedBody),
        response: { success: true, message: "Webhook received successfully", relay_id: "REL-992" }
      };

      setSimulationResult(newExecution);
      
      // Adiciona ao histórico da rota
      const updatedRoute = {
        ...editingRoute,
        history: [newExecution, ...(editingRoute.history || [])].slice(0, 10)
      };
      setEditingRoute(updatedRoute);
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="flex-1 p-10 bg-[#02040a] overflow-y-auto custom-scrollbar">
      <SectionHeader 
        title="Output Routes" 
        subtitle="Gerenciamento de webhooks e egress de dados com injeção dinâmica de variáveis"
        action={
          <button 
            onClick={() => setEditingRoute({ id: Date.now().toString(), name: 'Nova Rota de Saída', url: '', method: 'POST', headers: [], bodyTemplate: '{\n  "id": "{{conversation.id}}",\n  "answer": "{{ai.output}}"\n}' })} 
            className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
          >
            + New Destination
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List of Routes */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Configured Egress</h3>
          {routes.map(route => (
            <button 
              key={route.id} 
              onClick={() => { setEditingRoute(route); setActiveTab('config'); setSimulationResult(null); }}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all ${editingRoute?.id === route.id ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <Badge color={route.method === 'POST' ? 'blue' : 'slate'}>{route.method}</Badge>
                {route.history && route.history[0]?.status === 200 && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
              </div>
              <h4 className="text-sm font-bold text-white truncate">{route.name}</h4>
              <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">{route.url || 'URL não definida'}</p>
            </button>
          ))}
          {routes.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] opacity-30 italic text-xs">
              Nenhuma rota configurada.
            </div>
          )}
        </div>

        {/* Editor & Simulator */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {editingRoute ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex space-x-6 border-b border-white/5 mb-6">
                  {['config', 'history'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab as any)}
                      className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-blue-400' : 'text-slate-600'}`}
                    >
                      {tab === 'config' ? 'Endpoint Config' : 'Response History'}
                      {activeTab === tab && <motion.div layoutId="tab-underline-out" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
                    </button>
                  ))}
                </div>

                {activeTab === 'config' ? (
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                      <Card className="border-slate-800">
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-28">
                              <label className="text-[9px] font-black text-slate-600 uppercase mb-1 block">Method</label>
                              <select 
                                value={editingRoute.method} 
                                onChange={e => setEditingRoute({...editingRoute, method: e.target.value as any})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                              >
                                <option>POST</option><option>PUT</option><option>GET</option>
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="text-[9px] font-black text-slate-600 uppercase mb-1 block">Target URL</label>
                              <input 
                                type="text" value={editingRoute.url} 
                                onChange={e => setEditingRoute({...editingRoute, url: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-blue-400 font-mono"
                                placeholder="https://api.empresa.com/hooks/nexus"
                              />
                            </div>
                          </div>

                          <div className="h-64 flex flex-col">
                            <label className="text-[9px] font-black text-slate-600 uppercase mb-2 block">Body Template (JSON)</label>
                            <CodeEditor 
                              label="Dynamic Body" 
                              value={editingRoute.bodyTemplate} 
                              onChange={val => setEditingRoute({...editingRoute, bodyTemplate: val})} 
                            />
                          </div>

                          <div className="flex justify-between items-center pt-4">
                             <button onClick={runSimulation} disabled={isSimulating} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                               {isSimulating ? 'Sending Request...' : 'Simular Request'}
                             </button>
                             <div className="flex gap-2">
                               <button onClick={() => setEditingRoute(null)} className="px-4 text-[10px] font-bold text-slate-500">Cancel</button>
                               <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20">Save Route</button>
                             </div>
                          </div>
                        </div>
                      </Card>

                      {simulationResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                           <Card className="border-emerald-500/20 bg-emerald-500/[0.02]">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Simulation Success</span>
                                <Badge color="emerald">HTTP {simulationResult.status} OK</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                                <div>
                                  <p className="text-slate-600 mb-1 uppercase">Sent Payload:</p>
                                  <pre className="p-3 bg-slate-950 rounded-lg text-blue-400 overflow-auto max-h-32">{JSON.stringify(simulationResult.payload, null, 2)}</pre>
                                </div>
                                <div>
                                  <p className="text-slate-600 mb-1 uppercase">Remote Response:</p>
                                  <pre className="p-3 bg-slate-950 rounded-lg text-emerald-400 overflow-auto max-h-32">{JSON.stringify(simulationResult.response, null, 2)}</pre>
                                </div>
                              </div>
                           </Card>
                        </motion.div>
                      )}
                    </div>

                    {/* Variable Assistant */}
                    <div className="space-y-6">
                      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Variable Assistant</h4>
                        <div className="space-y-3">
                          {AVAILABLE_VARIABLES.map(v => (
                            <button 
                              key={v.key}
                              onClick={() => setEditingRoute({...editingRoute, bodyTemplate: editingRoute.bodyTemplate + `\n  "key": "${v.key}"`})}
                              className="w-full p-3 bg-slate-950 border border-white/5 rounded-xl text-left hover:border-blue-500/50 transition-all group"
                            >
                              <code className="text-[11px] text-blue-400 font-bold block mb-1 group-hover:text-blue-300">{v.key}</code>
                              <span className="text-[9px] text-slate-600 uppercase font-black">{v.description}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[2rem]">
                         <p className="text-[9px] text-amber-500/60 font-black uppercase leading-relaxed tracking-wider">
                           Use chaves duplas para injetar dados processados pela IA ou metadados de sistema.
                         </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card className="border-slate-800">
                    <div className="divide-y divide-white/5">
                      {(editingRoute.history || []).length > 0 ? editingRoute.history?.map((exec, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                           <div className="flex items-center space-x-6">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${exec.status === 200 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                {exec.status}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-white">{exec.id}</h5>
                                <p className="text-[9px] text-slate-600 font-mono mt-1">{exec.timestamp}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</p>
                              <p className="text-xs font-bold text-blue-400">{exec.duration}</p>
                           </div>
                        </div>
                      )) : (
                        <div className="p-20 text-center opacity-30 text-xs italic">Nenhum histórico disponível para esta rota.</div>
                      )}
                    </div>
                  </Card>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] bg-slate-900/10 py-32">
                 <div className="w-16 h-16 bg-slate-950 border border-white/5 rounded-3xl flex items-center justify-center text-slate-700 mb-6">
                    <Icons.Output />
                 </div>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Select or Create an Output Route</p>
                 <p className="text-[9px] text-slate-700 font-bold uppercase mt-2">Configure para onde a IA deve enviar os resultados finais</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OutputGeneratorView;
