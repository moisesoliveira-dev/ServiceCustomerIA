
import React from 'react';

const StatCard: React.FC<{ label: string; value: string; trend: string; color: string }> = ({ label, value, trend, color }) => (
  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
    </div>
    <div className={`h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden`}>
      <div className={`h-full ${color} rounded-full`} style={{ width: '65%' }}></div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-8 bg-[#0b1120] overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Nexus Command Center</h1>
            <p className="text-slate-400">Monitoring real-time AI orchestration throughput.</p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-300">All Systems Operational</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Orchestrations" value="2.4k" trend="+12%" color="bg-blue-500" />
          <StatCard label="Avg. Latency" value="142ms" trend="-4%" color="bg-indigo-500" />
          <StatCard label="Active Workers" value="12" trend="+2" color="bg-emerald-500" />
          <StatCard label="Error Rate" value="0.04%" trend="-2%" color="bg-rose-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Events */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white">Live Execution Stream</h3>
                <button className="text-xs text-blue-400 font-bold hover:underline">View All Logs</button>
             </div>
             <div className="divide-y divide-slate-800">
               {[
                 { id: '1', event: 'Google Drive Sync', status: 'SUCCESS', time: '2m ago', color: 'text-green-500' },
                 { id: '2', event: 'Input Transformation', status: 'SUCCESS', time: '5m ago', color: 'text-green-500' },
                 { id: '3', event: 'CRM State Update', status: 'FAILURE', time: '8m ago', color: 'text-rose-500' },
                 { id: '4', event: 'AI Routing decision', status: 'PENDING', time: 'Just now', color: 'text-amber-500' }
               ].map(log => (
                 <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center space-x-4">
                       <div className={`w-2 h-2 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-500' : log.status === 'FAILURE' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                       <div>
                         <p className="text-sm font-medium text-slate-200">{log.event}</p>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest">{log.id} • Nexus Core Cluster-A</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-xs font-bold ${log.color}`}>{log.status}</p>
                       <p className="text-[10px] text-slate-500">{log.time}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Quick Config */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl">
             <h3 className="font-bold text-white mb-6">Agent Resource Usage</h3>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">LLM Core (GPT-4o)</span>
                      <span className="text-indigo-400 font-bold">82%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[82%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Worker Node A-1</span>
                      <span className="text-emerald-400 font-bold">45%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[45%]"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Database Cluster</span>
                      <span className="text-blue-400 font-bold">12%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[12%]"></div>
                   </div>
                </div>
             </div>
             
             <div className="mt-10 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-xs text-indigo-200 leading-relaxed italic">
                  "Nexus Intelligence optimized your routing logic automatically 14 minutes ago, reducing latency by 4.2%."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
