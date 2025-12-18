
import React, { useState } from 'react';
import { Badge, Card, SectionHeader } from './ui/Core';
import { ExecutionLog, ExecutionStep } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
// Fix: Added missing Icons import
import { Icons } from './Icons';

const MOCK_EXECUTIONS: ExecutionLog[] = [
  {
    id: 'EXE-9001',
    sessionId: 'SES-88221',
    timestamp: '2024-05-14 14:30:11',
    duration: '1.2s',
    status: 'SUCCESS',
    steps: [
      { name: 'Ingest (Salesforce)', status: 'COMPLETED', timestamp: '14:30:11.002', payloadIn: { raw: 'body' }, payloadOut: { internal_id: '123', body: 'masked' } },
      { name: 'AI Transformer', status: 'COMPLETED', timestamp: '14:30:11.450', payloadIn: { internal_id: '123' }, payloadOut: { intent: 'support', priority: 5 } },
      { name: 'Global Router', status: 'COMPLETED', timestamp: '14:30:11.800', payloadIn: { intent: 'support' }, payloadOut: { next_hop: 'AGENT_DRIVE' } },
      { name: 'Output Webhook', status: 'COMPLETED', timestamp: '14:30:12.201', payloadIn: { msg: 'Hello' }, payloadOut: { status: 200 } }
    ]
  },
  {
    id: 'EXE-9002',
    sessionId: 'SES-88225',
    timestamp: '2024-05-14 14:35:05',
    duration: '0.8s',
    status: 'FAILURE',
    steps: [
      { name: 'Ingest (Hubspot)', status: 'COMPLETED', timestamp: '14:35:05.100', payloadIn: { raw: 'data' }, payloadOut: { id: '99' } },
      { name: 'AI Transformer', status: 'FAILED', timestamp: '14:35:05.900', payloadIn: { id: '99' }, payloadOut: { error: 'Invalid API Key mapping' } }
    ]
  }
];

const TimelineStep: React.FC<{ step: ExecutionStep; isLast: boolean }> = ({ step, isLast }) => {
  const [showPayload, setShowPayload] = useState(false);
  const isFailed = step.status === 'FAILED';

  return (
    <div className="relative flex gap-8">
      {!isLast && <div className="absolute top-8 left-4 w-0.5 h-full bg-slate-800 -z-0"></div>}
      <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 shrink-0 ${isFailed ? 'bg-rose-500 border-rose-950 shadow-[0_0_10px_#f43f5e]' : 'bg-slate-900 border-slate-950'}`}>
        {isFailed ? <span className="text-white text-[10px] font-black">!</span> : <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
      </div>
      <div className="flex-1 pb-10">
        <div className="flex justify-between items-center mb-2">
          <h4 className={`text-xs font-black uppercase tracking-widest ${isFailed ? 'text-rose-500' : 'text-white'}`}>{step.name}</h4>
          <span className="text-[12px] text-slate-600 font-mono">{step.timestamp}</span>
        </div>
        <div className={`p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 transition-all ${isFailed ? 'border-rose-500/20' : ''}`}>
           <div className="flex justify-between items-center mb-4">
             <Badge color={isFailed ? 'rose' : 'slate'}>{step.status}</Badge>
             <button onClick={() => setShowPayload(!showPayload)} className="text-[12px] font-bold text-blue-500 uppercase tracking-widest hover:underline">{showPayload ? 'Hide Trace' : 'Show Trace'}</button>
           </div>
           
           <AnimatePresence>
             {showPayload && (
               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1">Payload In</p>
                       <pre className="p-3 bg-slate-900 rounded-lg text-[12px] font-mono text-emerald-500 truncate">{JSON.stringify(step.payloadIn, null, 2)}</pre>
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1">Payload Out (Masked)</p>
                       <pre className="p-3 bg-slate-900 rounded-lg text-[12px] font-mono text-blue-400 truncate">
                         {JSON.stringify(step.payloadOut, (k, v) => (k.toLowerCase().includes('key') || k.toLowerCase().includes('token') || k.toLowerCase().includes('auth')) ? '••••••••' : v, 2)}
                       </pre>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ExecutionLogsView: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(MOCK_EXECUTIONS[0]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#02040a]">
      {/* List Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/20">
        <div className="p-6 border-b border-white/5">
           <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Execuções Recentes</h3>
           <div className="flex gap-2">
             <input type="text" placeholder="Trace ID..." className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none focus:ring-1 ring-blue-500/30" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_EXECUTIONS.map(log => (
            <button 
              key={log.id} 
              onClick={() => setSelectedLog(log)}
              className={`w-full p-6 text-left border-b border-white/5 transition-all relative ${selectedLog?.id === log.id ? 'bg-blue-600/5' : 'hover:bg-white/[0.02]'}`}
            >
              {selectedLog?.id === log.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
              <div className="flex justify-between items-start mb-2">
                <span className="text-[12px] font-mono font-bold text-slate-500">{log.id}</span>
                <Badge color={log.status === 'SUCCESS' ? 'emerald' : 'rose'}>{log.status}</Badge>
              </div>
              <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest truncate">{log.sessionId}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[12px] text-slate-600 font-bold italic">{log.duration}</span>
                <span className="text-[11px] text-slate-700 font-mono">{log.timestamp.split(' ')[1]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trace View */}
      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-[#0b1120]/40">
        {selectedLog ? (
          <div className="max-w-4xl mx-auto">
            <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">Execution Trace</h2>
                  <span className="px-3 py-1 bg-slate-800 rounded-lg text-[12px] font-mono text-slate-400 border border-white/5">{selectedLog.id}</span>
                </div>
                <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.2em]">Observabilidade Granular de Pipeline AI</p>
              </div>
              <div className="flex gap-4">
                 <div className="text-right">
                   <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Tempo Total</p>
                   <p className="text-lg font-black text-blue-500">{selectedLog.duration}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Sessão</p>
                   <p className="text-lg font-black text-slate-300 font-mono text-[13px] pt-1">{selectedLog.sessionId}</p>
                 </div>
              </div>
            </header>

            <div className="space-y-0">
               {selectedLog.steps.map((step, idx) => (
                 <TimelineStep key={idx} step={step} isLast={idx === selectedLog.steps.length - 1} />
               ))}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20">
               <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                     <Icons.Transformer />
                  </div>
                  <div>
                    <h5 className="text-[12px] font-black text-indigo-400 uppercase tracking-widest">Análise de Performance</h5>
                    <p className="text-xs text-indigo-200 mt-1 leading-relaxed italic opacity-80">
                      "O pipeline EXE-9001 processou 1.2k tokens em 1.2s. Nenhuma latência anômala detectada no Output Webhook."
                    </p>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center opacity-20">
             <p className="text-[12px] font-black uppercase tracking-[0.3em]">Selecione uma execução para ver o trace</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionLogsView;