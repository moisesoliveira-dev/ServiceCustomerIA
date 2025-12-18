
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../Icons';
import { useApp } from '../../App';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; delay?: number }> = ({ to, icon, label, active, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}>
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative group overflow-hidden ${
        active 
          ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] border border-blue-500/20' 
          : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
      }`}
    >
      {active && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />}
      <span className={`transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{icon}</span>
      <span className={`font-bold text-[12px] tracking-tight ${active ? 'text-blue-50' : ''}`}>{label}</span>
    </Link>
  </motion.div>
);

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { activeCompany } = useApp();

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col bg-[#050811] shrink-0">
      <div className="p-8 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /></svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">Nexus<span className="text-blue-500">AI</span></h1>
        </div>
      </div>
      
      <div className="flex-1 px-4 overflow-y-auto pb-8 custom-scrollbar">
        <div className="mt-8 mb-3 px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Plataforma (ADM)</div>
        <SidebarItem to="/" icon={<Icons.Dashboard />} label="Dashboard" active={location.pathname === '/'} />
        <SidebarItem to="/companies" icon={<Icons.Integrations />} label="Tenants" active={location.pathname === '/companies'} />
        <SidebarItem to="/settings" icon={<Icons.Monitor />} label="Global Config" active={location.pathname === '/settings'} />
        
        {activeCompany && (
          <>
            <div className="mt-8 mb-3 px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Operação: {activeCompany.name}</div>
            <SidebarItem to="/flow" icon={<Icons.Workflow />} label="Design Flow" active={location.pathname === '/flow'} />
            <SidebarItem to="/logs" icon={<Icons.Monitor />} label="Execuções & Logs" active={location.pathname === '/logs'} />
            <SidebarItem to="/mapping" icon={<Icons.Transformer />} label="Transformer AI" active={location.pathname === '/mapping'} />
            <SidebarItem to="/output" icon={<Icons.Output />} label="Output Generator" active={location.pathname === '/output'} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/[0.02]">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black">AD</div>
          <div>
            <p className="text-[11px] font-bold text-white">Root Admin</p>
            <p className="text-[9px] text-slate-600 uppercase font-black">Cluster-Alpha</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
