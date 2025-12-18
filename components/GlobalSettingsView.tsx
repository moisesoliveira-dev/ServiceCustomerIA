import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { Badge, Card, SectionHeader } from './ui/Core';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvVar, UserPermission } from '../types';
import { Icons } from './Icons';

// --- MODAL COMPONENTS ---

const ConfirmationModal: React.FC<{ itemType: string; itemName: string; onConfirm: () => void; onCancel: () => void; }> = ({ itemType, itemName, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
      <h2 className="text-lg font-bold text-white">Confirmar Exclusão</h2>
      <p className="text-slate-400 mt-2">
        Tem certeza que deseja excluir o {itemType} <strong className="font-bold text-white">{itemName}</strong>? Esta ação não pode ser desfeita.
      </p>
      <div className="flex justify-end space-x-4 mt-8">
        <button onClick={onCancel} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">Cancelar</button>
        <button onClick={onConfirm} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all">Excluir</button>
      </div>
    </motion.div>
  </div>
);

const EnvVarModal: React.FC<{ mode: 'new' | 'edit', initialData?: EnvVar, onSave: (data: Omit<EnvVar, 'id'>) => void, onClose: () => void }> = ({ mode, initialData, onSave, onClose }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setKey(initialData.key);
      setValue(initialData.value);
      setIsSecret(initialData.isSecret);
    }
  }, [mode, initialData]);

  const handleSave = () => onSave({ key, value, isSecret });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 max-w-lg w-full shadow-2xl backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6">{mode === 'new' ? 'Add Variable' : 'Edit Variable'}</h2>
        <div className="space-y-6">
          <div>
            <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">Key Name</label>
            <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="Ex: GEMINI_API_KEY" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-blue-400 font-mono outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div>
            <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">Value</label>
            <input type={isSecret ? 'password' : 'text'} value={value} onChange={e => setValue(e.target.value)} placeholder="Cole o valor aqui" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 font-mono outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <input id="isSecret" type="checkbox" checked={isSecret} onChange={e => setIsSecret(e.target.checked)} className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="isSecret" className="text-sm font-bold text-slate-300">Marcar como Secret</label>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all">Salvar</button>
        </div>
      </motion.div>
    </div>
  );
};

const PermissionModal: React.FC<{ mode: 'new' | 'edit', initialData?: UserPermission, onSave: (data: Omit<UserPermission, 'id'>) => void, onClose: () => void }> = ({ mode, initialData, onSave, onClose }) => {
  const [user, setUser] = useState('');
  const [role, setRole] = useState('AUDITOR');
  const [scope, setScope] = useState('GLOBAL_LOGS');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setUser(initialData.user);
      setRole(initialData.role);
      setScope(initialData.scope);
    }
  }, [mode, initialData]);

  const handleSave = () => onSave({ user, role, scope });

  const ROLES = ['MASTER_ADMIN', 'FLOW_DESIGNER', 'OPERATOR', 'AUDITOR'];
  const SCOPES = ['GLOBAL', 'GLOBAL_LOGS', 'TENANT_A', 'TENANT_B'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 max-w-lg w-full shadow-2xl backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6">{mode === 'new' ? 'Add User Permission' : 'Edit User Permission'}</h2>
        <div className="space-y-6">
          <div>
            <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">User Email</label>
            <input type="email" value={user} onChange={e => setUser(e.target.value)} placeholder="user@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/30">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest block mb-2">Scope</label>
              <select value={scope} onChange={e => setScope(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/30">
                {SCOPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all">Salvar</button>
        </div>
      </motion.div>
    </div>
  );
};


// --- MAIN COMPONENT ---

const GlobalSettingsView: React.FC = () => {
  const { globalVars, addGlobalVar, updateGlobalVar, deleteGlobalVar, permissions, addPermission, updatePermission, deletePermission } = useApp();
  const [activeTab, setActiveTab] = useState<'env' | 'rbac' | 'system'>('env');
  
  const [envModal, setEnvModal] = useState<{ open: boolean; mode: 'new' | 'edit'; data?: EnvVar }>({ open: false, mode: 'new' });
  const [permModal, setPermModal] = useState<{ open: boolean; mode: 'new' | 'edit'; data?: UserPermission }>({ open: false, mode: 'new' });
  const [deletingItem, setDeletingItem] = useState<{ type: 'env' | 'perm'; data: any } | null>(null);

  const handleSaveEnv = (data: Omit<EnvVar, 'id'>) => {
    if (envModal.mode === 'new') {
      addGlobalVar(data);
    } else if (envModal.data) {
      updateGlobalVar(envModal.data.id, data);
    }
    setEnvModal({ open: false, mode: 'new' });
  };

  const handleSavePerm = (data: Omit<UserPermission, 'id'>) => {
    if (permModal.mode === 'new') {
      addPermission(data);
    } else if (permModal.data) {
      updatePermission(permModal.data.id, data);
    }
    setPermModal({ open: false, mode: 'new' });
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'env') deleteGlobalVar(deletingItem.data.id);
    if (deletingItem.type === 'perm') deletePermission(deletingItem.data.id);
    setDeletingItem(null);
  };

  return (
    <>
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
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-4 text-[12px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}>
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
                   <p className="text-[12px] text-slate-500 uppercase tracking-widest mt-1">Disponíveis em todos os stages de orquestração</p>
                 </div>
                 <button onClick={() => setEnvModal({ open: true, mode: 'new' })} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-black uppercase tracking-widest text-blue-500 hover:bg-slate-800 transition-all">+ Add Variable</button>
              </div>
              
              <Card noPadding>
                <div className="divide-y divide-white/5">
                  {globalVars.map(v => (
                    <div key={v.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                      <div className="flex items-center space-x-8">
                        <div className="w-48">
                          <p className="text-[12px] font-black text-slate-600 uppercase tracking-widest mb-1">Key Name</p>
                          <p className="text-xs font-mono text-blue-400">{v.key}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] font-black text-slate-600 uppercase tracking-widest mb-1">Value</p>
                          <p className={`text-xs font-mono ${v.isSecret ? 'text-slate-700' : 'text-slate-300'}`}>{v.isSecret ? '••••••••••••••••' : v.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {v.isSecret && <Badge color="amber">SECRET</Badge>}
                        <button onClick={() => setEnvModal({ open: true, mode: 'edit', data: v })} className="p-2 text-slate-500 hover:text-blue-400"><Icons.Edit/></button>
                        <button onClick={() => setDeletingItem({ type: 'env', data: v })} className="p-2 text-slate-500 hover:text-rose-400"><Icons.Trash/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20">
                 <h4 className="text-[12px] font-black text-amber-500 uppercase tracking-widest mb-2 flex items-center"><span className="mr-2">⚠️</span> Security Warning</h4>
                 <p className="text-xs text-amber-200/60 leading-relaxed italic">Variáveis marcadas como "Secret" são criptografadas em repouso e nunca exibidas em logs de execução ou previews da IA.</p>
              </div>
            </div>
          )}

          {activeTab === 'rbac' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                 <div>
                   <h3 className="text-sm font-bold text-white">User Roles & Scopes</h3>
                   <p className="text-[12px] text-slate-500 uppercase tracking-widest mt-1">Controle de Acesso Baseado em Função (RBAC)</p>
                 </div>
                 <button onClick={() => setPermModal({ open: true, mode: 'new' })} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-black uppercase tracking-widest text-blue-500 hover:bg-slate-800 transition-all">+ Add User</button>
              </div>
               <Card noPadding>
                 <div className="divide-y divide-white/5">
                   {permissions.map(p => (
                     <div key={p.id} className="p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                       <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[12px] font-bold text-slate-400"><Icons.User /></div>
                          <div>
                             <p className="text-xs font-bold text-slate-200">{p.user}</p>
                             <p className="text-[11px] text-slate-600 uppercase tracking-widest font-black">{p.scope}</p>
                          </div>
                       </div>
                       <div className="flex items-center space-x-3">
                         <Badge color={p.role.includes('ADMIN') ? 'blue' : 'slate'}>{p.role}</Badge>
                         <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setPermModal({ open: true, mode: 'edit', data: p })} className="p-2 text-slate-500 hover:text-blue-400"><Icons.Edit/></button>
                            <button onClick={() => setDeletingItem({ type: 'perm', data: p })} className="p-2 text-slate-500 hover:text-rose-400"><Icons.Trash/></button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </Card>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="grid grid-cols-2 gap-6">
               <Card className="border-emerald-500/20">
                 <h4 className="text-[12px] font-black text-emerald-500 uppercase tracking-widest mb-4">Core Orchestrator</h4>
                 <div className="flex items-end justify-between">
                   <span className="text-3xl font-black text-white">UP</span>
                   <span className="text-[12px] text-slate-600 font-mono">v2.4.1-stable</span>
                 </div>
               </Card>
               <Card className="border-blue-500/20">
                 <h4 className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4">Gemini API Connectivity</h4>
                 <div className="flex items-end justify-between">
                   <span className="text-3xl font-black text-white">LATENCY: 42ms</span>
                   <span className="text-[12px] text-slate-600 font-mono">100% Uptime</span>
                 </div>
               </Card>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {envModal.open && <EnvVarModal mode={envModal.mode} initialData={envModal.data} onSave={handleSaveEnv} onClose={() => setEnvModal({ ...envModal, open: false })} />}
        {permModal.open && <PermissionModal mode={permModal.mode} initialData={permModal.data} onSave={handleSavePerm} onClose={() => setPermModal({ ...permModal, open: false })} />}
        {deletingItem && <ConfirmationModal itemType={deletingItem.type === 'env' ? 'variável' : 'permissão'} itemName={deletingItem.data.key || deletingItem.data.user} onConfirm={confirmDelete} onCancel={() => setDeletingItem(null)} />}
      </AnimatePresence>
    </>
  );
};

export default GlobalSettingsView;