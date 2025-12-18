import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../App';
import { Company, CRMType } from '../types';
import { Icons } from './Icons';

const CRM_TEMPLATES = [
  { id: 'salesforce', name: 'Salesforce', icon: '☁️', color: 'bg-blue-600' },
  { id: 'hubspot', name: 'HubSpot', icon: '🟠', color: 'bg-orange-600' },
  { id: 'custom', name: 'Custom CRM', icon: '🔌', color: 'bg-slate-700' }
];

const ITEMS_PER_PAGE = 5;

const EditForm: React.FC<{
  onSave: () => void;
  onCancel: () => void;
  newName: string;
  setNewName: (name: string) => void;
  selectedCRM: CRMType;
  setSelectedCRM: (crm: CRMType) => void;
}> = ({ onSave, onCancel, newName, setNewName, selectedCRM, setSelectedCRM }) => (
  <div className="bg-slate-900/60 border border-blue-500/20 rounded-[2rem] p-8 mt-[-1rem] mb-6 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
    <h2 className="text-lg font-bold text-white mb-6">Editar Ambiente</h2>
    <div className="space-y-6">
      <div>
        <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">Nome da Organização</label>
        <input 
          type="text" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ex: Global Logistics Inc."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
        />
      </div>
      <div>
        <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-4">Pipeline de Entrada (CRM)</label>
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
              <span className="text-[12px] font-black uppercase text-slate-400">{crm.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex space-x-4 pt-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave} 
          className="flex-1 bg-blue-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-white"
        >
          Salvar Alterações
        </motion.button>
        <button onClick={onCancel} className="px-8 bg-slate-800 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Cancelar</button>
      </div>
    </div>
  </div>
);


const CompanyManager: React.FC = () => {
  const { companies, addCompany, updateCompany, deleteCompany, activeCompany, setActiveCompanyById, globalSchema, outputTemplate } = useApp();
  const [formOpenFor, setFormOpenFor] = useState<'new' | Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  
  const [newName, setNewName] = useState('');
  const [selectedCRM, setSelectedCRM] = useState<CRMType>('salesforce');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (formOpenFor && formOpenFor !== 'new') {
      setNewName(formOpenFor.name);
      setSelectedCRM(formOpenFor.crmType);
    } else {
      setNewName('');
      setSelectedCRM('salesforce');
    }
  }, [formOpenFor]);

  const handleSave = () => {
    if (!newName || !formOpenFor) return;
    
    if (formOpenFor === 'new') {
      const newId = `comp-${Date.now()}`;
      const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-rose-600', 'bg-amber-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      addCompany({
        id: newId,
        name: newName,
        color: randomColor,
        crmType: selectedCRM,
        internalSchema: { ...globalSchema },
        outputTemplate: { ...outputTemplate },
        crmConfig: {
          aiInstructions: `Instruções padrão para mapeamento do ${selectedCRM}...`,
          sourceJson: "{\n  \"example\": \"data\"\n}"
        }
      });
    } else {
      updateCompany(formOpenFor.id, {
        name: newName,
        crmType: selectedCRM
      });
    }
    setFormOpenFor(null);
  };

  const handleConfirmDelete = () => {
    if (deletingCompany) {
      deleteCompany(deletingCompany.id);
      setDeletingCompany(null);
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companies, searchQuery]);

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCompanies, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <p className="text-slate-500 mt-1 uppercase tracking-[0.2em] text-[12px] font-black">Infraestrutura Multi-Tenant AI</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFormOpenFor('new')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)]"
          >
            Nova Empresa
          </motion.button>
        </motion.header>

        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Buscar empresa pelo nome..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        <AnimatePresence>
          {formOpenFor === 'new' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 mb-10 backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <h2 className="text-lg font-bold text-white mb-6">Cadastrar Novo Ambiente</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">Nome da Organização</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Global Logistics Inc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-4">Pipeline de Entrada (CRM)</label>
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
                        <span className="text-[12px] font-black uppercase text-slate-400">{crm.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave} 
                    className="flex-1 bg-blue-600 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all text-white"
                  >
                    Ativar Ambiente
                  </motion.button>
                  <button onClick={() => setFormOpenFor(null)} className="px-8 bg-slate-800 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Cancelar</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="grid gap-6 items-start"
        >
          {paginatedCompanies.map((comp) => (
            <motion.div layout="position" key={comp.id}>
              <motion.button
                onClick={() => setActiveCompanyById(comp.id)}
                className={`group w-full bg-slate-900/30 border ${comp.id === activeCompany?.id ? 'border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'border-slate-800/60'} rounded-[1.5rem] p-6 flex items-center justify-between transition-all text-left`}
                whileHover={{ x: 5, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
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
                      <span className="text-[12px] text-slate-600 font-black uppercase tracking-widest">TENANT-ID: {comp.id.substring(0,8)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                      <div className="flex items-center space-x-1">
                         <span className="text-[12px] text-blue-500/80 font-black uppercase tracking-widest">CORE:</span>
                         <span className="text-[12px] text-slate-400 font-bold uppercase">{comp.crmType}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); setFormOpenFor(comp); }}
                        className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-800/50 hover:text-blue-400 transition-colors"
                        aria-label={`Editar ${comp.name}`}
                    >
                        <Icons.Edit />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setDeletingCompany(comp); }}
                        className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-800/50 hover:text-rose-400 transition-colors"
                        aria-label={`Excluir ${comp.name}`}
                    >
                        <Icons.Trash />
                    </button>
                </div>
              </motion.button>
              
              <AnimatePresence>
                {formOpenFor && typeof formOpenFor === 'object' && formOpenFor.id === comp.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <EditForm 
                      onSave={handleSave} 
                      onCancel={() => setFormOpenFor(null)}
                      newName={newName}
                      setNewName={setNewName}
                      selectedCRM={selectedCRM}
                      setSelectedCRM={setSelectedCRM}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-20 min-h-[360px] flex flex-col justify-center">
            <p className="text-slate-500 font-bold">
              {searchQuery ? `Nenhuma empresa encontrada para "${searchQuery}"` : "Nenhuma empresa cadastrada."}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center space-x-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold disabled:opacity-30"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold disabled:opacity-30"
            >
              Próximo
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deletingCompany && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
              >
                  <h2 className="text-lg font-bold text-white">Confirmar Exclusão</h2>
                  <p className="text-slate-400 mt-2">
                    Tem certeza de que deseja excluir a empresa <strong className="font-bold text-white">{deletingCompany.name}</strong>? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex justify-end space-x-4 mt-8">
                      <button onClick={() => setDeletingCompany(null)} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">Cancelar</button>
                      <button onClick={handleConfirmDelete} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all">Excluir</button>
                  </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyManager;