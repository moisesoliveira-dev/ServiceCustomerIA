
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../App';
import { Company, CRMType } from '../types';
import { Icons } from './Icons';

const CRM_TEMPLATES = [
  { id: 'salesforce', name: 'Salesforce', icon: '☁️', color: 'bg-blue-600' },
  { id: 'hubspot', name: 'HubSpot', icon: '🟠', color: 'bg-orange-600' },
  { id: 'custom', name: 'Custom CRM', icon: '🔌', color: 'bg-slate-700' }
];

const CompanyManager: React.FC = () => {
  const { companies, addCompany, activeCompany, globalSchema } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedCRM, setSelectedCRM] = useState<CRMType>('salesforce');

  const handleCreate = () => {
    if (!newName) return;
    const newId = `comp-${Date.now()}`;
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-rose-600', 'bg-amber-600'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    addCompany({
      id: newId,
      name: newName,
      color: randomColor,
      crmType: selectedCRM,
      internalSchema: { ...globalSchema }, // Cada empresa começa com o padrão global
      crmConfig: {
        aiInstructions: `Instruções padrão para mapeamento do ${selectedCRM}...`,
        sourceJson: "{\n  \"example\": \"data\"\n}"
      }
    });
    setNewName('');
    setIsAdding(false);
  };

  return (
    <div className="flex-1 p-10 overflow-y-auto bg-[#02040a] custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-10"
        >
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Gestão de Empresas</h1>
            <p className="text-slate-500 mt-1 uppercase tracking-[0.2em] text-[10px] font-black">Infraestrutura Multi-Tenant AI</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
          >
            Nova Empresa
          </motion.button>
        </motion.header>

        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 mb-10 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6">Cadastrar Novo Ambiente</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-2">Nome da Organização</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Global Logistics Inc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Pipeline de Entrada (CRM)</label>
                  <div className="grid grid-cols-3 gap-4">
                    {CRM_TEMPLATES.map(crm => (
                      <motion.button
                        key={crm.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCRM(crm.id as CRMType)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-3 ${
                          selectedCRM === crm.id ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{crm.icon}</span>
                        <span className="text-[10px] font-black uppercase text-slate-400">{crm.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate} 
                    className="flex-1 bg-blue-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-white"
                  >
                    Ativar Ambiente
                  </motion.button>
                  <button onClick={() => setIsAdding(false)} className="px-8 bg-slate-800 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Cancelar</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="grid gap-6"
        >
          {companies.map((comp, idx) => (
            <motion.div 
              key={comp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 10, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
              className={`group bg-slate-900/30 border ${comp.id === activeCompany?.id ? 'border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'border-slate-800/60'} rounded-[1.5rem] p-6 flex items-center justify-between transition-all`}
            >
              <div className="flex items-center space-x-6">
                <motion.div 
                  layoutId={`company-avatar-${comp.id}`}
                  className={`w-14 h-14 rounded-2xl ${comp.color} flex items-center justify-center text-xl font-black text-white shadow-2xl shadow-black/40`}
                >
                  {comp.name[0]}
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{comp.name}</h3>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">TENANT-ID: {comp.id.substring(0,8)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                    <div className="flex items-center space-x-1">
                       <span className="text-[10px] text-blue-500/80 font-black uppercase tracking-widest">CORE:</span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase">{comp.crmType}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                 <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-3 bg-slate-800/50 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition-all border border-transparent hover:border-blue-500/20"
                 >
                   <Icons.Workflow />
                 </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyManager;
