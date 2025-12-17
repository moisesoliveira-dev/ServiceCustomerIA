
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { Icons } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

const JsonMapperView: React.FC = () => {
  const { activeCompany, updateCompany, globalSchema } = useApp();
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');
  const [aiOutputPreview, setAiOutputPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para edição do Schema (Modo Admin)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [tempSchema, setTempSchema] = useState("");
  const [schemaError, setSchemaError] = useState<string | null>(null);

  // Fallback for missing config
  const config = activeCompany?.crmConfig || {
    sourceJson: "{\n  \"error\": \"no_config\"\n}",
    aiInstructions: ""
  };

  const targetSchema = activeCompany?.internalSchema || globalSchema;

  // Atualiza o tempSchema quando o activeCompany ou o internalSchema mudam
  useEffect(() => {
    setTempSchema(JSON.stringify(targetSchema, null, 2));
  }, [activeCompany?.id, targetSchema]);

  const handleUpdate = (updates: any) => {
    if (!activeCompany) return;
    updateCompany(activeCompany.id, {
      crmConfig: { ...activeCompany.crmConfig, ...updates }
    });
  };

  const saveSchema = () => {
    if (!activeCompany) return;
    setSchemaError(null);
    try {
      const parsed = JSON.parse(tempSchema);
      updateCompany(activeCompany.id, { internalSchema: parsed });
      setIsAdminMode(false);
    } catch (e: any) {
      setSchemaError("JSON Inválido: " + e.message);
    }
  };

  const runAiTest = async () => {
    if (!process.env.API_KEY) {
      alert("API Key não encontrada.");
      return;
    }
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        VOCÊ É UM AGENTE TRANSFORMADOR DE DADOS DA PLATAFORMA NEXUS AI.
        OBJETIVO: Converter o JSON específico do sistema de origem (${activeCompany?.crmType}) para o SCHEMA PADRÃO da nossa plataforma.
        
        1. JSON DE ORIGEM:
        ${config.sourceJson}
        
        2. SCHEMA PADRÃO OBRIGATÓRIO (OUTPUT):
        ${JSON.stringify(targetSchema, null, 2)}
        
        3. INSTRUÇÕES ESPECÍFICAS:
        ${config.aiInstructions}
        
        REGRAS: 
        - Retorne APENAS o JSON preenchido.
        - Mantenha a tipagem rigorosa conforme o SCHEMA PADRÃO definido.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      setAiOutputPreview(response.text || "{}");
      setActiveTab('preview');
    } catch (error) {
      console.error("AI Error:", error);
      setAiOutputPreview(JSON.stringify({ error: "Erro na interpretação da IA. Verifique as instruções ou sua API Key." }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeCompany) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050811] overflow-hidden">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-950/20 backdrop-blur-xl shrink-0">
        <div>
          <div className="flex items-center space-x-3 mb-1">
             <div className={`w-8 h-8 rounded-xl ${activeCompany.color} flex items-center justify-center text-xs font-black text-white`}>
                {activeCompany.name[0]}
             </div>
             <h2 className="text-xl font-black text-white tracking-tight">{activeCompany.name}</h2>
             <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full">
               CRM: {activeCompany.crmType}
             </span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Transformer Inteligente & Protocol Management</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${isAdminMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
          >
            {isAdminMode ? '🔐 SAIR MODO ADMIN' : '🔓 CONFIGURAR PROTOCOLO (ADMIN)'}
          </button>
          <button 
            onClick={runAiTest}
            disabled={isLoading || isAdminMode}
            className={`px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 ${(isLoading || isAdminMode) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
          >
            {isLoading ? 'Interpretando...' : 'Testar Transformação'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-10 flex space-x-10 border-b border-white/5 bg-slate-900/10 shrink-0">
        <button 
          onClick={() => setActiveTab('config')} 
          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'config' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Lógica do Pipeline
          {activeTab === 'config' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('preview')} 
          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'preview' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Preview da IA
          {activeTab === 'preview' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />}
        </button>
      </div>

      <div className="flex-1 overflow-hidden p-10 flex gap-8 custom-scrollbar overflow-y-auto">
        {activeTab === 'config' ? (
          <>
            <div className="flex-1 flex flex-col space-y-6">
              <div className="flex-1 min-h-[400px] flex flex-col bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-5 bg-slate-800/30 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icons.Transformer />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload Exemplo ({activeCompany.crmType})</span>
                  </div>
                </div>
                <textarea 
                  className="flex-1 bg-slate-950/50 p-6 font-mono text-xs text-blue-300 outline-none resize-none custom-scrollbar"
                  value={config.sourceJson}
                  onChange={(e) => handleUpdate({ sourceJson: e.target.value })}
                  spellCheck={false}
                  readOnly={isAdminMode}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col space-y-6">
              <div className={`bg-slate-900 border transition-all duration-500 rounded-[2rem] p-8 shadow-2xl ${isAdminMode ? 'opacity-30 grayscale pointer-events-none' : 'border-slate-800'}`}>
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Prompt de Mapeamento (IA Logic)</h3>
                 <textarea 
                  className="w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all resize-none custom-scrollbar"
                  value={config.aiInstructions}
                  onChange={(e) => handleUpdate({ aiInstructions: e.target.value })}
                  placeholder="Instrua a IA sobre como tratar os dados deste CRM..."
                 />
              </div>
              
              <div className={`flex-1 flex flex-col border transition-all duration-500 rounded-[2rem] p-8 overflow-hidden ${isAdminMode ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.05)]' : 'bg-slate-900/40 border-slate-800'}`}>
                 <div className="flex justify-between items-center mb-6">
                   <h3 className={`text-[10px] font-black uppercase tracking-widest ${isAdminMode ? 'text-amber-500' : 'text-slate-500'}`}>
                     {isAdminMode ? 'EDITOR DE PROTOCOLO (ADMIN)' : 'Protocol Schema (Empresa)'}
                   </h3>
                   <div className="flex items-center space-x-3">
                     {isAdminMode ? (
                       <>
                         <button 
                          onClick={saveSchema}
                          className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                         >
                           SALVAR PROTOCOLO
                         </button>
                         <button 
                          onClick={() => setIsAdminMode(false)}
                          className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500"
                         >
                           CANCELAR
                         </button>
                       </>
                     ) : (
                       <div className="flex items-center space-x-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocolo Ativo</span>
                       </div>
                     )}
                   </div>
                 </div>
                 
                 <div className={`flex-1 overflow-auto rounded-2xl p-6 border transition-all custom-scrollbar ${isAdminMode ? 'bg-slate-950 border-amber-500/30 ring-1 ring-amber-500/10' : 'bg-slate-950 border-slate-800/50'}`}>
                    {isAdminMode ? (
                      <textarea 
                        className="w-full h-full bg-transparent font-mono text-[11px] text-amber-500 outline-none resize-none leading-relaxed"
                        value={tempSchema}
                        onChange={(e) => setTempSchema(e.target.value)}
                        spellCheck={false}
                      />
                    ) : (
                      <pre className="text-[10px] text-emerald-500/80 font-mono leading-loose">
                        {JSON.stringify(targetSchema, null, 2)}
                      </pre>
                    )}
                 </div>
                 
                 {schemaError && isAdminMode && (
                   <p className="mt-3 text-[10px] text-rose-500 font-bold">{schemaError}</p>
                 )}
                 
                 {!isAdminMode && (
                   <p className="mt-4 text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center opacity-50">
                     O JSON acima define o contrato de dados para esta empresa.
                   </p>
                 )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 bg-blue-600/5 border-b border-white/5 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">IA Transformation Response</span>
              <div className="flex items-center space-x-2">
                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                 <span className="text-[9px] font-bold text-slate-500">Live Gemini Engine</span>
              </div>
            </div>
            <div className="flex-1 p-10 overflow-auto font-mono text-xs text-slate-300 leading-relaxed custom-scrollbar">
              {aiOutputPreview ? (
                <pre className="p-8 bg-slate-900/30 rounded-3xl border border-white/5 whitespace-pre-wrap">{aiOutputPreview}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-700">
                  <div className="w-16 h-16 opacity-20 mb-4">
                    <Icons.Transformer />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest">Aguardando execução do teste...</p>
                  <p className="text-[10px] mt-2 opacity-50">Clique em 'Testar Transformação' no cabeçalho</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonMapperView;
