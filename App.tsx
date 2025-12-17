
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import FlowBuilder from './components/FlowBuilder';
import IntegrationHub from './components/IntegrationHub';
import JsonMapperView from './components/JsonMapperView';
import Dashboard from './components/Dashboard';

const SidebarItem: React.FC<{ to: string; icon: string; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white italic">N</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              NexusAI
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem to="/" icon="📊" label="Dashboard" active={location.pathname === '/'} />
          <SidebarItem to="/flow" icon="🔄" label="Flow Orchestrator" active={location.pathname === '/flow'} />
          <SidebarItem to="/mapping" icon="🧩" label="Transformer" active={location.pathname === '/mapping'} />
          <SidebarItem to="/integrations" icon="🔌" label="Integration Hub" active={location.pathname === '/integrations'} />
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">Nexus Core v2.4</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flow" element={<FlowBuilder />} />
          <Route path="/mapping" element={<JsonMapperView />} />
          <Route path="/integrations" element={<IntegrationHub />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}
