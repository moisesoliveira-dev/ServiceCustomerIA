
import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from 'reactflow';
import { NodeType } from '../types';

// Custom Node Components
const NexusNode: React.FC<{ data: any; type: NodeType; isConnectable: boolean }> = ({ data, type, isConnectable }) => {
  const isInput = type === NodeType.INPUT_TRANSFORMER;
  const isOutput = type === NodeType.OUTPUT_GENERATOR;

  return (
    <div className={`p-4 rounded-xl border-2 transition-all w-48 shadow-lg bg-slate-900/90 border-slate-800 group hover:border-blue-500/50`}>
      {!isInput && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-blue-500"
        />
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{data.icon}</span>
        <div className={`w-2 h-2 rounded-full bg-green-500 group-hover:animate-pulse`} />
      </div>
      <h4 className="text-sm font-semibold text-slate-200 truncate">{data.label}</h4>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">
        {type.replace('_', ' ')}
      </p>

      {!isOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!bg-blue-400"
        />
      )}
    </div>
  );
};

const initialNodes = [
  {
    id: '1',
    type: 'nexusNode',
    data: { label: 'CRM Webhook', icon: '📥', nodeType: NodeType.INPUT_TRANSFORMER },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'nexusNode',
    data: { label: 'Agent Router', icon: '🧠', nodeType: NodeType.STATE_ROUTER },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'nexusNode',
    data: { label: 'G-Drive Worker', icon: '📂', nodeType: NodeType.AGENT_WORKER },
    position: { x: 450, y: 300 },
  },
  {
    id: '4',
    type: 'nexusNode',
    data: { label: 'CRM Final Response', icon: '📤', nodeType: NodeType.OUTPUT_GENERATOR },
    position: { x: 250, y: 450 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
];

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({
    nexusNode: (props: any) => <NexusNode {...props} type={props.data.nodeType} />,
  }), []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b1120] relative overflow-hidden">
      {/* Header Toolbar */}
      <div className="h-16 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md px-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold">Orchestration Canvas</h2>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-900 rounded border border-slate-800">Live Engine v2.0</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">Test Run</button>
          <button className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-600/20">
            Deploy Changes
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
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
          snapGrid={[15, 15]}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls className="!fill-slate-400" />
          <MiniMap 
            style={{ background: '#0f172a', border: '1px solid #1e293b' }} 
            maskColor="rgba(0, 0, 0, 0.1)"
            nodeColor="#334155"
          />
          
          <Panel position="top-right" className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl backdrop-blur-sm shadow-xl m-4">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Canvas Tips</div>
             <ul className="text-xs text-slate-400 space-y-1">
                <li>• Drag to move nodes</li>
                <li>• Connect handles to route logic</li>
                <li>• Right-click to add metadata</li>
             </ul>
          </Panel>
        </ReactFlow>
      </div>

      {/* Node Catalog Sidebar (Internal Component Feel) */}
      <div className="absolute top-20 left-6 z-10 w-14 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex flex-col items-center space-y-4 shadow-2xl backdrop-blur">
          <div className="w-10 h-10 bg-blue-500/10 text-blue-400 flex items-center justify-center rounded-xl cursor-grab hover:bg-blue-500 hover:text-white transition-all shadow-inner" title="Add Transformer">📥</div>
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-xl cursor-grab hover:bg-indigo-500 hover:text-white transition-all shadow-inner" title="Add Router">🧠</div>
          <div className="w-10 h-10 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-xl cursor-grab hover:bg-amber-500 hover:text-white transition-all shadow-inner" title="Add Worker">⚙️</div>
          <div className="h-[1px] w-6 bg-slate-800"></div>
          <button className="w-10 h-10 text-slate-500 hover:text-white transition-colors">🛠️</button>
      </div>
    </div>
  );
};

export default FlowBuilder;
