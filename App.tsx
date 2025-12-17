
import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Layout/Sidebar';
import FlowBuilder from './components/FlowBuilder';
import IntegrationHub from './components/IntegrationHub';
import JsonMapperView from './components/JsonMapperView';
import Dashboard from './components/Dashboard';
import StateMonitor from './components/StateMonitor';
import CompanyManager from './components/CompanyManager';
import { Company } from './types';

const DEFAULT_GLOBAL_SCHEMA = {
  "internal_id": "string (UUID ou ID de Origem)",
  "customer_intent": "string (Categorização da IA)",
  "urgency_score": "number (0-10)",
  "formatted_summary": "string (Resumo limpo para o agente)",
  "metadata": { "source_system": "string", "processed_at": "timestamp" }
};

const DEFAULT_OUTPUT_TEMPLATE = {
  "response_id": "string (UUID)",
  "action_type": "string (MESSAGE | HANDOVER | API_CALL)",
  "final_response": {
    "text": "string (Texto final gerado para o cliente)",
    "suggestions": ["string (Opções de quick-reply)"]
  },
  "context_preservation": {
    "session_locked": "boolean",
    "next_expected_input": "string"
  }
};

interface AppContextType {
  companies: Company[];
  activeCompany: Company | null;
  globalSchema: any; 
  outputTemplate: any;
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
    id: '1', name: 'Global Tech Corp', color: 'bg-blue-600', crmType: 'salesforce',
    internalSchema: { ...DEFAULT_GLOBAL_SCHEMA },
    outputTemplate: { ...DEFAULT_OUTPUT_TEMPLATE },
    crmConfig: {
      aiInstructions: "Extraia o 'customer.id' como 'internal_id' e o corpo da mensagem como 'normalized_body'.",
      sourceJson: JSON.stringify({ customer: { id: "SF-992" }, body: "Erro no login" }, null, 2)
    }
  },
  { 
    id: '2', name: 'Retail Solutions Ltd', color: 'bg-emerald-600', crmType: 'hubspot',
    internalSchema: { ...DEFAULT_GLOBAL_SCHEMA, "retail_loyalty_id": "string" },
    outputTemplate: { ...DEFAULT_OUTPUT_TEMPLATE, "retail_promo_code": "string" },
    crmConfig: {
      aiInstructions: "Mapeie o 'order_id' para o 'internal_id' e defina a urgência baseada no valor da compra.",
      sourceJson: JSON.stringify({ order_id: "ORD-55", value: 1200 }, null, 2)
    }
  },
];

const PageContainer: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
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

export default function App() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [activeCompanyId, setActiveCompanyId] = useState<string>(INITIAL_COMPANIES[0].id);
  const [globalSchema, setGlobalSchema] = useState<any>(DEFAULT_GLOBAL_SCHEMA);
  const [outputTemplate, setOutputTemplate] = useState<any>(DEFAULT_OUTPUT_TEMPLATE);

  const activeCompany = companies.find(c => c.id === activeCompanyId) || null;
  
  const addCompany = (company: Company) => {
    const companyWithSchema = { 
      ...company, 
      internalSchema: company.internalSchema || { ...globalSchema },
      outputTemplate: company.outputTemplate || { ...outputTemplate }
    };
    setCompanies(prev => [...prev, companyWithSchema]);
    setActiveCompanyId(company.id);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates, crmConfig: updates.crmConfig ? { ...c.crmConfig, ...updates.crmConfig } : c.crmConfig } : c));
  };

  return (
    <AppContext.Provider value={{ 
      companies, 
      activeCompany, 
      globalSchema, 
      outputTemplate,
      setActiveCompanyById: setActiveCompanyId, 
      addCompany, 
      updateCompany, 
      setGlobalSchema 
    }}>
      <HashRouter>
        <div className="flex h-screen w-full overflow-hidden bg-[#02040a] text-slate-200">
          <Sidebar />
          <main className="flex-1 flex flex-col relative overflow-hidden bg-[#02040a]">
            <PageContainer />
          </main>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}
