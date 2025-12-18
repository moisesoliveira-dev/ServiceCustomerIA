import React, { useState, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Layout/Sidebar';
import FlowBuilder from './components/FlowBuilder';
import IntegrationHub from './components/IntegrationHub';
import JsonMapperView from './components/JsonMapperView';
import Dashboard from './components/Dashboard';
import ExecutionLogsView from './components/ExecutionLogsView';
import OutputGeneratorView from './components/OutputGeneratorView';
import GlobalSettingsView from './components/GlobalSettingsView';
import CompanyManager from './components/CompanyManager';
import StateMonitor from './components/StateMonitor';
import { Company, EnvVar, UserPermission } from './types';

const DEFAULT_GLOBAL_SCHEMA = {
  "internal_id": "string",
  "customer_intent": "string",
  "urgency_score": "number",
  "metadata": { "source": "string" }
};

const DEFAULT_OUTPUT_TEMPLATE = {
  "status": "success",
  "result": {
    "summary": "string",
    "action_taken": "string"
  }
};

interface AppContextType {
  companies: Company[];
  activeCompany: Company | null;
  globalVars: EnvVar[];
  permissions: UserPermission[];
  setActiveCompanyById: (id: string | null) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  addCompany: (company: Company) => void;
  deleteCompany: (id: string) => void;
  addGlobalVar: (variable: Omit<EnvVar, 'id'>) => void;
  updateGlobalVar: (id: string, updates: Partial<EnvVar>) => void;
  deleteGlobalVar: (id: string) => void;
  addPermission: (permission: Omit<UserPermission, 'id'>) => void;
  updatePermission: (id: string, updates: Partial<UserPermission>) => void;
  deletePermission: (id: string) => void;
  globalSchema: any;
  outputTemplate: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

const INITIAL_COMPANIES: Company[] = [
  { 
    id: '1', name: 'Nexus Core', color: 'bg-blue-600', crmType: 'salesforce',
    internalSchema: { ...DEFAULT_GLOBAL_SCHEMA },
    outputRoutes: [
      { id: 'out-1', name: 'Primary Webhook', url: 'https://api.nexus.io/v1/webhook', method: 'POST', headers: [{ id: 'h1', key: 'Authorization', value: 'Bearer demo_token' }], bodyTemplate: '{\n  "event": "customer_resolved",\n  "data": {{payload}}\n}' }
    ]
  }
];

const INITIAL_VARS: EnvVar[] = [
  { id: 'v1', key: 'GEMINI_API_VERSION', value: 'v2-preview', isSecret: false },
  { id: 'v2', key: 'ENCRYPTION_KEY', value: 'AKIA_NEXUS_8829', isSecret: true }
];

const INITIAL_PERMISSIONS: UserPermission[] = [
  { id: 'perm-1', user: 'admin@nexus.ai', role: 'MASTER_ADMIN', scope: 'GLOBAL' },
  { id: 'perm-2', user: 'operator@nexus.ai', role: 'FLOW_DESIGNER', scope: 'TENANT_A' },
  { id: 'perm-3', user: 'viewer@nexus.ai', role: 'AUDITOR', scope: 'GLOBAL_LOGS' }
];

export default function App() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(INITIAL_COMPANIES.length > 0 ? INITIAL_COMPANIES[0].id : null);
  const [globalVars, setGlobalVars] = useState<EnvVar[]>(INITIAL_VARS);
  const [permissions, setPermissions] = useState<UserPermission[]>(INITIAL_PERMISSIONS);

  const activeCompany = companies.find(c => c.id === activeCompanyId) || null;

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
    setActiveCompanyId(company.id);
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => {
      const remainingCompanies = prev.filter(c => c.id !== id);
      if (activeCompanyId === id) {
        setActiveCompanyId(remainingCompanies.length > 0 ? remainingCompanies[0].id : null);
      }
      return remainingCompanies;
    });
  };

  const addGlobalVar = (variable: Omit<EnvVar, 'id'>) => {
    setGlobalVars(prev => [...prev, { ...variable, id: `var-${Date.now()}` }]);
  };
  const updateGlobalVar = (id: string, updates: Partial<EnvVar>) => {
    setGlobalVars(prev => prev.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };
  const deleteGlobalVar = (id: string) => {
    setGlobalVars(prev => prev.filter(v => v.id !== id));
  };

  const addPermission = (permission: Omit<UserPermission, 'id'>) => {
    setPermissions(prev => [...prev, { ...permission, id: `perm-${Date.now()}` }]);
  };
  const updatePermission = (id: string, updates: Partial<UserPermission>) => {
    setPermissions(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deletePermission = (id: string) => {
    setPermissions(prev => prev.filter(p => p.id !== id));
  };


  return (
    <AppContext.Provider value={{ 
      companies, 
      activeCompany, 
      globalVars, 
      permissions,
      setActiveCompanyById: setActiveCompanyId, 
      updateCompany, 
      addCompany, 
      deleteCompany,
      addGlobalVar,
      updateGlobalVar,
      deleteGlobalVar,
      addPermission,
      updatePermission,
      deletePermission,
      globalSchema: DEFAULT_GLOBAL_SCHEMA,
      outputTemplate: DEFAULT_OUTPUT_TEMPLATE
    }}>
      <HashRouter>
        <div className="flex h-screen w-full overflow-hidden bg-[#02040a] text-slate-200">
          <Sidebar />
          <main className="flex-1 flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<CompanyManager />} />
                <Route path="/flow" element={<FlowBuilder />} />
                <Route path="/flow/monitor" element={<StateMonitor />} />
                <Route path="/logs" element={<ExecutionLogsView />} />
                <Route path="/mapping" element={<JsonMapperView />} />
                <Route path="/output" element={<OutputGeneratorView />} />
                <Route path="/integrations" element={<IntegrationHub />} />
                <Route path="/settings" element={<GlobalSettingsView />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}