
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FlowBuilder from './components/FlowBuilder';
import IntegrationHub from './components/IntegrationHub';
import JsonMapperView from './components/JsonMapperView';
import Dashboard from './components/Dashboard';
import StateMonitor from './components/StateMonitor';
import CompanyManager from './components/CompanyManager';
import { Icons } from './components/Icons';
import { Company } from './types';

// Default Global Schema Template (Utilizado como base para novas empresas)
const DEFAULT_GLOBAL_SCHEMA = {
  "internal_id": "string (UUID ou ID de Origem)",
  "customer_intent": "string (Categorização da IA)",
  "urgency_score": "number (0-10)",
  "formatted_summary": "string (Resumo limpo para o agente)",
  "metadata": {
    "source_system": "string",
    "processed_at": "timestamp"
  }
};

// Global Context
interface AppContextType {
  companies: Company[];
  activeCompany: Company | null;
  globalSchema: any; 
  setActiveCompanyById: (id: string) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  setGlobalSchema: (schema: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

const INITIAL_COMPANIES: Company[] = [
  { 
    id: '1', 
    name: 'Global Tech Corp', 
    color: 'bg-blue-600', 
    crmType: 'salesforce',
    internalSchema: { ...DEFAULT_GLOBAL_SCHEMA },
    crmConfig: {
      aiInstructions: "Extraia o 'customer.id' como 'internal_id' e o corpo da mensagem como 'normalized_body'.",
      sourceJson: JSON.stringify({ customer: { id: "SF-992" }, body: "Erro no login" }, null, 2)
    }
  },
  { 
    id: '2', 
    name: 'Retail Solutions Ltd', 
    color: 'bg-emerald-600', 
    crmType: 'hubspot',
    internalSchema: { ...DEFAULT_GLOBAL_SCHEMA, "retail_loyalty_id": "string" },
    crmConfig: {
      aiInstructions: "Mapeie o 'order_id' para o 'internal_id' e defina a urgência baseada no valor da compra.",
      sourceJson: JSON.stringify({ order_id: "ORD-55", value: 1200 }, null, 2)
    }
  },
];

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; delay?: number }> = ({ to, icon, label, active, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
        active 
          ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] border border-blue-500/20' 
          : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="sidebar-active-indicator"
          className="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_#3b82f6]"
        />
      )}
      <motion.span 
        whileHover={{ scale: 1.15 }}
        className={`transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
      >
        {icon}
      </motion.span>
      <span className={`font-bold text-[13px] tracking-tight ${active ? 'text-blue-50' : ''}`}>{label}</span>
    </Link>
  </motion.div>
);

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="px-4 mt-8 mb-3 flex items-center space-x-3"
  >
    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] whitespace-nowrap">{label}</span>
    <div className="h-[1px] w-full bg-slate-800/40"></div>
  </motion.div>
);

const CompanySwitcher: React.FC = () => {
  const { companies, activeCompany, setActiveCompanyById } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!activeCompany) return null;

  return (
    <div className="relative px-2">
      <motion.button 
        whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-slate-950/40 border border-white/[0.05] rounded-xl transition-all group"
      >
        <div className="flex items-center space-x-3 truncate">
          <motion.div 
            layoutId={`active-company-color-${activeCompany.id}`}
            className={`w-8 h-8 rounded-lg ${activeCompany.color} flex items-center justify-center text-xs font-black text-white shadow-xl flex-shrink-0`}
          >
            {activeCompany.name[0]}
          </motion.div>
          <div className="text-left truncate">
            <p className="text-[11px] font-black text-slate-100 truncate leading-tight">{activeCompany.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{activeCompany.crmType}</p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-slate-500 group-hover:text-slate-300"
        >
          <Icons.ChevronDown />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-2 right-2 mb-2 bg-[#0b1120] border border-slate-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 py-1.5 overflow-hidden"
            >
              <div className="px-3 py-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-800 mb-1">Alternar Organização</div>
              {companies.map(c => (
                <motion.button
                  key={c.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => { setActiveCompanyById(c.id); setIsOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left transition-colors ${activeCompany.id === c.id ? 'bg-blue-500/5' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-md ${c.color} flex items-center justify-center text-[10px] font-black text-white`}>{c.name[0]}</div>
                  <span className="text-[12px] font-bold text-slate-300 truncate">{c.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/companies" element={<CompanyManager />} />
          <Route path="/flow" element={<FlowBuilder />} />
          <Route path="/monitor" element={<StateMonitor />} />
          <Route path="/mapping" element={<JsonMapperView />} />
          <Route path="/integrations" element={<IntegrationHub />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { activeCompany } = useApp();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#02040a] text-slate-200">
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#050811] shrink-0">
        <div className="p-8 pb-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-white/10">
               <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              Nexus<span className="text-blue-500">AI</span>
            </h1>
          </motion.div>
        </div>
        
        <div className="flex-1 px-4 space-y-1 overflow-y-auto pb-8 custom-scrollbar">
          <SectionHeader label="Plataforma (ADM)" />
          <div className="space-y-1">
            <SidebarItem to="/" icon={<Icons.Dashboard />} label="Dashboard" active={location.pathname === '/'} delay={0.05} />
            <SidebarItem to="/companies" icon={<Icons.Integrations />} label="Gestão Empresas" active={location.pathname === '/companies'} delay={0.1} />
            <SidebarItem to="/integrations" icon={<Icons.Integrations />} label="Global Connectors" active={location.pathname === '/integrations'} delay={0.15} />
          </div>

          {activeCompany && (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <SectionHeader label="Ambiente de Operação" />
              <div className="p-1 rounded-2xl bg-white/[0.015] border border-white/[0.04] space-y-1">
                <div className="mb-2 p-1">
                   <CompanySwitcher />
                </div>
                <div className="px-1 pb-1 space-y-1">
                  <SidebarItem to="/flow" icon={<Icons.Workflow />} label="Fluxo Dinâmico" active={location.pathname === '/flow'} delay={0.2} />
                  <SidebarItem to="/monitor" icon={<Icons.Monitor />} label="Live Monitor" active={location.pathname === '/monitor'} delay={0.25} />
                  <SidebarItem to="/mapping" icon={<Icons.Transformer />} label="Transformer AI" active={location.pathname === '/mapping'} delay={0.3} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 mt-auto border-t border-white/5 bg-slate-950/20">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[10px] font-black border border-white/10 shadow-lg text-white">AD</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#050811] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-black text-slate-100 truncate tracking-tight group-hover:text-blue-400 transition-colors">Admin Root</p>
              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Master Node</p>
            </div>
          </motion.div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#02040a]">
        <AnimatedRoutes />
      </main>
    </div>
  );
};

export default function App() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [activeCompanyId, setActiveCompanyId] = useState<string>(INITIAL_COMPANIES[0].id);
  const [globalSchema, setGlobalSchema] = useState<any>(DEFAULT_GLOBAL_SCHEMA);

  const activeCompany = companies.find(c => c.id === activeCompanyId) || null;

  const setActiveCompanyById = (id: string) => setActiveCompanyId(id);
  
  const addCompany = (company: Company) => {
    const companyWithSchema = {
      ...company,
      internalSchema: company.internalSchema || { ...globalSchema }
    };
    setCompanies(prev => [...prev, companyWithSchema]);
    setActiveCompanyById(company.id);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { 
      ...c, 
      ...updates, 
      crmConfig: updates.crmConfig ? { ...c.crmConfig, ...updates.crmConfig } : c.crmConfig 
    } : c));
  };

  return (
    <AppContext.Provider value={{ 
      companies, 
      activeCompany, 
      globalSchema, 
      setActiveCompanyById, 
      addCompany, 
      updateCompany, 
      setGlobalSchema 
    }}>
      <HashRouter>
        <MainLayout />
      </HashRouter>
    </AppContext.Provider>
  );
}
