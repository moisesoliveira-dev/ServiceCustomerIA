
import React, { useState } from 'react';
import { INTEGRATIONS_LIST } from '../constants';
import { IntegrationStatus, Integration } from '../types';

const IntegrationHub: React.FC = () => {
  const [selected, setSelected] = useState<Integration | null>(null);
  const [status, setStatus] = useState<IntegrationStatus>(IntegrationStatus.DISCONNECTED);

  const handleConnect = () => {
    setStatus(IntegrationStatus.CONNECTING);
    setTimeout(() => setStatus(IntegrationStatus.CONNECTED), 2000);
  };

  return (
    <div className="flex-1 p-8 bg-[#0b1120] overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Integration Hub</h1>
          <p className="text-slate-400">Manage connections between your AI core and external workforce agents.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Available Agents</h3>
            {INTEGRATIONS_LIST.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSelected(item as any); setStatus(IntegrationStatus.DISCONNECTED); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === item.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-200">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.type}</p>
                    </div>
                  </div>
                  {item.id === 'google-drive' && (
                    <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Config Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{selected.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selected.name} Configuration</h2>
                      <p className="text-sm text-slate-500">Setup secure authentication for this worker agent.</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    status === IntegrationStatus.CONNECTED ? 'bg-green-500/10 text-green-500' :
                    status === IntegrationStatus.CONNECTING ? 'bg-amber-500/10 text-amber-500' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {status}
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {selected.configFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">{field.label}</label>
                      <input
                        type={field.type === 'password' ? 'password' : 'text'}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                      />
                    </div>
                  ))}

                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-500">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                      Credentials are encrypted (AES-256)
                    </div>
                    <div className="flex space-x-3">
                       <button className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white transition-colors text-sm font-semibold">Cancel</button>
                       <button 
                        onClick={handleConnect}
                        disabled={status === IntegrationStatus.CONNECTING}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-sm font-bold flex items-center"
                       >
                         {status === IntegrationStatus.CONNECTING && (
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                         )}
                         {status === IntegrationStatus.CONNECTED ? 'Test Connection' : 'Save & Connect'}
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-slate-500">
                <span className="text-4xl mb-4">⬅️</span>
                <p>Select an agent from the list to configure</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
