
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  NodeProps,
  BackgroundVariant,
  Node,
  Edge
} from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeType } from '../types';
import { INTEGRATIONS_LIST } from '../constants';
import { Icons } from './Icons';

const getNodeIcon = (type: NodeType, integrationIcon?: string) => {
  if (type === NodeType.INPUT_TRANSFORMER) return <Icons.Input />;
  if (type === NodeType.STATE_MANAGER) return <Icons.StateManager />;
  if (type === NodeType.STATE_ROUTER) return <Icons.StateRouter />;
  if (type === NodeType.OUTPUT_GENERATOR) return <Icons.Output />;
  return <span className="text-xl">{integrationIcon || '🤖'}</span>;
};

const NexusNode: React.FC<NodeProps> = ({ id, data, isConnectable }) => {
  const nodeType = data.nodeType as NodeType;
  const isCore = [
    NodeType.INPUT_TRANSFORMER, 
    NodeType.STATE_MANAGER, 
    NodeType.STATE_ROUTER, 
    NodeType.OUTPUT_GENERATOR
  ].includes(nodeType);
  const isWorker = nodeType === NodeType.AGENT_WORKER;
  const isConnected = data.connected || isCore;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative p-5 rounded-3xl border-2 transition-all duration-500 w-60 shadow-2xl backdrop-blur-md
        ${isCore ? 'bg-slate-950 border-slate-800/60' : isConnected ? 'bg-slate-900 border-indigo-500/40' : 'bg-slate-900/40 border-slate-800/40 opacity-40 grayscale'}
        ${isConnected && isWorker ? 'ring-4 ring-indigo-500/10' : ''}
      `}
    >
      {nodeType !== NodeType.INPUT_TRANSFORMER && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className={`!w-3 !h-3 !border-2 !border-slate-950 transition-colors ${isConnected ? '!bg-blue-500' : '!bg-slate-700'}`}
        />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all ${
          nodeType === NodeType.STATE_MANAGER ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
          nodeType === NodeType.STATE_ROUTER ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
          isWorker ? (isConnected ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500') :
          'bg-blue-500/10 border-blue-500/20 text-blue-400'
        }`}>
          {getNodeIcon(nodeType, data.icon)}
        </div>
        <div className="flex flex-col items-end">
          <motion.div 
            animate={{ opacity: isConnected ? [1, 0.5, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' : 'bg-slate-700'}`} 
          />
          <span className={`text-[9px] font-black mt-1.5 uppercase tracking-tighter ${isConnected ? 'text-green-500' : 'text-slate-600'}`}>
            {isConnected ? 'LIVE' : 'IDLE'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className={`text-sm font-bold truncate tracking-tight ${isConnected ? 'text-slate-100' : 'text-slate-500'}`}>
          {data.label}
        </h4>
        <p className={`text-[10px] uppercase tracking-[0.1em] font-black ${isConnected ? 'text-slate-600' : 'text-slate-800'}`}>
          {nodeType?.replace('_', ' ')}
        </p>
      </div>

      {nodeType !== NodeType.OUTPUT_GENERATOR && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className={`!w-3 !h-3 !border-2 !border-slate-950 transition-colors ${isConnected ? '!bg-blue-500' : '!bg-slate-700'}`}
        />
      )}
    </motion.div>
  );
};

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initialNodes: Node[] = [
      { id: 'core-input', type: 'nexusNode', data: { label: 'CRM Master Ingest', nodeType: NodeType.INPUT_TRANSFORMER, connected: true }, position: { x: 250, y: 0 } },
      { id: 'core-manager', type: 'nexusNode', data: { label: 'IA State Controller', nodeType: NodeType.STATE_MANAGER, connected: true }, position: { x: 250, y: 200 } },
      { id: 'core-router', type: 'nexusNode', data: { label: 'IA Global Router', nodeType: NodeType.STATE_ROUTER, connected: true }, position: { x: 250, y: 400 } },
      { id: 'core-output', type: 'nexusNode', data: { label: 'Response Egress', nodeType: NodeType.OUTPUT_GENERATOR, connected: true }, position: { x: 250, y: 650 } }
    ];

    const initialEdges: Edge[] = [
      { 
        id: 'e-core-1', 
        source: 'core-input', 
        target: 'core-manager', 
        className: 'edge-core-dashed',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } 
      },
      { 
        id: 'e-core-2', 
        source: 'core-manager', 
        target: 'core-router', 
        className: 'edge-core-dashed',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } 
      },
      { 
        id: 'e-core-3', 
        source: 'core-router', 
        target: 'core-output', 
        className: 'edge-core-dashed',
        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } 
      }
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  const onConnect = useCallback((params: Connection) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);

    if (!sourceNode || !targetNode) return;

    const sourceIsRouter = sourceNode.data.nodeType === NodeType.STATE_ROUTER;
    const targetIsRouter = targetNode.data.nodeType === NodeType.STATE_ROUTER;
    const sourceIsWorker = sourceNode.data.nodeType === NodeType.AGENT_WORKER;
    const targetIsWorker = targetNode.data.nodeType === NodeType.AGENT_WORKER;

    // Regra: Nós dinâmicos (Worker) só podem se conectar ao Router
    if (sourceIsWorker && !targetIsRouter) {
      console.warn("Workers can only return to the State Router");
      return;
    }
    if (targetIsWorker && !sourceIsRouter) {
      console.warn("Workers can only receive connections from the State Router");
      return;
    }

    setEdges((eds) => {
      // Determina o estilo baseado se é uma conexão de agente
      const isAgentEdge = sourceIsWorker || targetIsWorker;
      
      const newEdge = addEdge({ 
        ...params, 
        className: isAgentEdge ? 'edge-agent-glow' : 'edge-core-dashed',
        markerEnd: { 
          type: MarkerType.ArrowClosed, 
          color: isAgentEdge ? '#6366f1' : '#3b82f6' 
        }
      }, eds);
      
      // Marcar nó worker como conectado se estiver ligado ao router
      if (targetIsWorker && sourceIsRouter) {
        setNodes(nds => nds.map(n => n.id === targetNode.id ? { ...n, data: { ...n.data, connected: true } } : n));
      }

      return newEdge;
    });
  }, [nodes, setNodes, setEdges]);

  const addAgentNode = (integration: any) => {
    const id = `agent-${integration.id}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'nexusNode',
      data: { label: integration.name, icon: integration.icon, nodeType: NodeType.AGENT_WORKER, connected: false },
      position: { x: 650, y: 400 + (nodes.length * 20) },
    };
    setNodes((nds) => nds.concat(newNode));
    setShowLibrary(false);
  };

  const nodeTypes = useMemo(() => ({ nexusNode: NexusNode }), []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#02040a] relative overflow-hidden">
      <header className="h-20 border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl px-8 flex items-center justify-between z-10">
        <div className="flex items-center space-x-6">
          <motion.div whileHover={{ rotate: 15 }} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-500 shadow-inner">
             <Icons.Workflow />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-none">Flow Orchestrator</h2>
            <div className="flex items-center mt-1.5 space-x-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></span>
               <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Pipeline Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-slate-900/50 border border-slate-800/60 rounded-2xl p-1.5">
             <button className="px-5 py-2 text-[11px] font-black bg-slate-800 text-blue-400 rounded-xl shadow-lg uppercase tracking-wider">Designer</button>
             <button onClick={() => navigate('/monitor')} className="px-5 py-2 text-[11px] font-black text-slate-600 hover:text-white transition-all uppercase tracking-wider">Monitor</button>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 text-xs font-black bg-blue-600 text-white rounded-xl shadow-xl shadow-blue-600/20 uppercase tracking-widest"
          >
            Deploy Protocol
          </motion.button>
        </div>
      </header>

      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
        >
          <Background color="#1e293b" gap={40} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-500 !rounded-xl" />
        </ReactFlow>
      </div>

      <div className="absolute top-28 right-8 z-10 flex flex-col space-y-4">
         <motion.div 
          layout
          className="bg-slate-950/90 border border-slate-800/60 rounded-[1.5rem] p-3 flex flex-col items-center shadow-2xl backdrop-blur-3xl"
         >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowLibrary(!showLibrary)}
              className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-xl ${showLibrary ? 'bg-indigo-600 text-white rotate-45' : 'bg-slate-900 text-indigo-400'}`} 
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            </motion.button>
         </motion.div>

         <AnimatePresence>
           {showLibrary && (
             <motion.div 
               initial={{ opacity: 0, x: 50, scale: 0.9 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: 50, scale: 0.9 }}
               className="bg-slate-950/95 border border-slate-800/60 rounded-[2rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] w-80 backdrop-blur-3xl ring-1 ring-white/5"
             >
               <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8">Agent Library</h4>
               <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {INTEGRATIONS_LIST.map(item => (
                   <motion.button 
                    key={item.id}
                    whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    onClick={() => addAgentNode(item)}
                    className="w-full group flex items-center p-4 rounded-2xl border border-slate-800/60 transition-all text-left"
                   >
                     <div className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl text-xl mr-4 border border-slate-800">{item.icon}</div>
                     <div className="flex-1">
                       <p className="text-xs font-bold text-slate-100">{item.name}</p>
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{item.type.split('_')[0]}</p>
                     </div>
                   </motion.button>
                 ))}
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-8 z-10">
         <div className="bg-slate-900/80 border border-white/5 rounded-2xl p-4 backdrop-blur-xl max-w-xs shadow-2xl">
            <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Regras de Protocolo</h5>
            <ul className="text-[10px] text-slate-400 space-y-1.5 font-medium">
               <li className="flex items-center"><span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>Cadeia Core é auto-gerenciada.</li>
               <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>Workers ligam-se apenas ao Router.</li>
               <li className="flex items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>Fluxo bidirecional permitido no Router.</li>
            </ul>
         </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
