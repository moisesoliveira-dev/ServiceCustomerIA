
import React, { useState } from 'react';
import { MOCK_INPUT_JSON, MOCK_INTERNAL_SCHEMA } from '../constants';

const JsonMapperView: React.FC = () => {
  const [mappings, setMappings] = useState<Record<string, string>>({});

  const flattenJson = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).reduce((acc: string[], k) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        acc.push(...flattenJson(obj[k], pre + k));
      } else {
        acc.push(pre + k);
      }
      return acc;
    }, []);
  };

  const inputFields = flattenJson(MOCK_INPUT_JSON);

  const toggleMapping = (input: string, target: string) => {
    setMappings(prev => ({
      ...prev,
      [target]: prev[target] === input ? '' : input
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b1120]">
      <header className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
        <div>
          <h2 className="text-xl font-bold">Input Transformer</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Map CRM JSON to Core Nexus Schema</p>
        </div>
        <div className="flex space-x-2">
            <button className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold hover:bg-indigo-600/30 transition-all">✨ AI Auto-Map</button>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">Import Template</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-8 gap-8">
        {/* Source JSON Structure */}
        <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-300">Source JSON (CRM)</span>
            <span className="text-[10px] text-slate-500 font-mono">sample_input.json</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {inputFields.map(field => (
              <div key={field} className="flex items-center justify-between group p-2 hover:bg-slate-800/50 rounded-lg transition-all border border-transparent hover:border-slate-700">
                <span className="text-sm font-mono text-blue-400">{field}</span>
                <div className="w-4 h-[2px] bg-slate-800 group-hover:bg-blue-500 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Link Layer (Simulated Center) */}
        <div className="w-12 flex flex-col items-center justify-center opacity-30">
            <div className="space-y-4">
                {[1,2,3,4,5,6].map(i => <div key={i} className="w-8 h-[1px] bg-slate-700"></div>)}
            </div>
        </div>

        {/* Target Schema */}
        <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-300">Nexus Internal Schema</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">DYNAMIC</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {MOCK_INTERNAL_SCHEMA.map(target => (
              <div key={target} className="space-y-1">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{target}</label>
                   <span className="text-[10px] text-slate-600 font-mono italic">Required</span>
                </div>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
                  value={mappings[target] || ''}
                  onChange={(e) => toggleMapping(e.target.value, target)}
                >
                  <option value="">-- Unmapped --</option>
                  {inputFields.map(input => (
                    <option key={input} value={input}>{input}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-end space-x-4">
        <p className="mr-auto text-xs text-slate-500">
          Mapped <span className="text-blue-400 font-bold">{Object.values(mappings).filter(v => !!v).length}</span> of <span className="text-slate-300 font-bold">{MOCK_INTERNAL_SCHEMA.length}</span> required fields.
        </p>
        <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-600/20 text-sm">
          Validate & Save Mapping
        </button>
      </footer>
    </div>
  );
};

export default JsonMapperView;
