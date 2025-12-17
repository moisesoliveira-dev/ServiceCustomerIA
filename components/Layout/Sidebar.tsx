
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
      {active && <motion.div layoutId="sidebar-active-indicator" className="absolute left-0 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_#3b82f6]" />}
      <span className={`transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>{icon}</span>
      <span className={`font-bold text-[13px] tracking-tight ${active ? 'text-blue-50' : ''}`}>{label}</span>
    </Link>
  </motion.div>
);

const NavSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <div className="px-4 mt-8 mb-3 flex items-center space-x-3">
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] whitespace-nowrap">{label}</span>
      <div className="h-[1px] w-full bg-slate-800/40"></div>
    </div>
    {children}
  </div>
);

const CompanySwitcher: React.FC = () => {
  const { companies, activeCompany, setActiveCompanyById } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!activeCompany) return null;

  return (
    <div className="relative px-2">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-2.5 bg-slate-950/40 border border-white/[0.05] rounded-xl transition-all group">
        <div className="flex items-center space-x-3 truncate">
          <div className={`w-8 h-8 rounded-lg ${activeCompany.color} flex items-center justify-center text-xs font-black text-white`}>{activeCompany.name[0]}</div>
          <div className="text-left truncate">
            <p className="text-[11px] font-black text-slate-100 truncate leading-tight">{activeCompany.name}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{activeCompany.crmType}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-500 group-hover:text-slate-300">
          <Icons.ChevronDown />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-2 right-2 mb-2 bg-[#0b1120] border border-slate-800 rounded-xl shadow-2xl z-20 py-1.5">
              {companies.map(c => (
                <button key={c.id} onClick={() => { setActiveCompanyById(c.id); setIsOpen(false); }} className={`w-full flex items-center space-x-3 px-3 py-2 text-left ${activeCompany.id === c.id ? 'bg-blue-500/5 text-blue-400' : 'text-slate-400 hover:bg-white/5'}`}>
                  <div className={`w-6 h-6 rounded-md ${c.color} flex items-center justify-center text-[10px] font-black text-white`}>{c.name[0]}</div>
                  <span className="text-[12px] font-bold truncate">{c.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { activeCompany } = useApp();

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col bg-[#050811] shrink-0">
      <div className="p-8 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg border border-white/10 text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">Nexus<span className="text-blue-500">AI</span></h1>
        </div>
      </div>
      
      <div className="flex-1 px-4 overflow-y-auto pb-8 custom-scrollbar">
        <NavSection label="Plataforma (ADM)">
          <SidebarItem to="/" icon={<Icons.Dashboard />} label="Dashboard" active={location.pathname === '/'} delay={0.05} />
          <SidebarItem to="/companies" icon={<Icons.Integrations />} label="Gestão Empresas" active={location.pathname === '/companies'} delay={0.1} />
          <SidebarItem to="/integrations" icon={<Icons.Integrations />} label="Global Connectors" active={location.pathname === '/integrations'} delay={0.15} />
        </NavSection>

        {activeCompany && (
          <NavSection label="Operação">
            <div className="p-1 rounded-2xl bg-white/[0.015] border border-white/[0.04] space-y-1">
              <CompanySwitcher />
              <SidebarItem to="/flow" icon={<Icons.Workflow />} label="Fluxo Dinâmico" active={location.pathname === '/flow'} delay={0.2} />
              <SidebarItem to="/monitor" icon={<Icons.Monitor />} label="Live Monitor" active={location.pathname === '/monitor'} delay={0.25} />
              <SidebarItem to="/mapping" icon={<Icons.Transformer />} label="Transformer AI" active={location.pathname === '/mapping'} delay={0.3} />
            </div>
          </NavSection>
        )}
      </div>

      <div className="p-4 mt-auto border-t border-white/5 bg-slate-950/20">
        <div className="flex items-center space-x-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-[10px] font-black text-white">AD</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#050811] rounded-full"></div>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-black text-slate-100 truncate">Admin Root</p>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Master Node</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
