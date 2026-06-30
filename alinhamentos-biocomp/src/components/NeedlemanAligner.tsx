import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dna } from 'lucide-react';
import type { NeedlemanRequest, NeedlemanResponse } from '../types';

export default function NeedlemanAligner() {
  const [reqData, setReqData] = useState<NeedlemanRequest>({
    sequencia1: { id: '', fasta: '', conteudo: '' },
    sequencia2: { id: '', fasta: '', conteudo: '' }
  });
  const [result, setResult] = useState<NeedlemanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateField = (
    target: 'sequencia1' | 'sequencia2', 
    field: keyof NeedlemanRequest['sequencia1'], 
    value: string
  ) => {
    setReqData(prev => ({
      ...prev,
      [target]: { ...prev[target], [field]: value }
    }));
  };

  const handleAlign = async () => {
    if (!reqData.sequencia1.conteudo || !reqData.sequencia2.conteudo) {
      alert("Certifique-se de preencher ao menos o Conteúdo de ambas as sequências.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/alinhamento/needleman-wunsch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData),
      });

      if (!response.ok) throw new Error("Erro na computação dinâmica da matriz.");
      
      const data: NeedlemanResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao computar Needleman-Wunsch.");
    } finally {
      setLoading(false);
    }
  };

  const carregarExemplo = () => {
    setReqData({
      sequencia1: {
        id: "seq1",
        fasta: ">seq1 exemplo_1\nATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA\nCGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC",
        conteudo: "ATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC"
      },
      sequencia2: {
        id: "seq2",
        fasta: ">seq2 exemplo_2\nTTGACGATCGATCGATCGATCGATCGATCGATCGATCGA\nGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCA",
        conteudo: "TTGACGATCGATCGATCGATCGATCGATCGATCGATCGAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCA"
      }
    });
  };

  // Renderiza os caracteres alinhados destacando os matches perfeitos e os gaps
  const renderVisualizadorSobreposto = (s1: string, s2: string) => {
    const chars1 = s1.split('');
    const chars2 = s2.split('');

    return (
      <div className="flex flex-col gap-1 font-mono text-base tracking-[0.2em] overflow-x-auto p-4 bg-slate-950 rounded border border-emerald-950 shadow-inner">
        {/* Linha da Sequência 1 */}
        <div className="flex whitespace-nowrap">
          <span className="w-24 text-xs font-bold text-emerald-600 uppercase font-mono mr-4 select-none sticky left-0 bg-slate-950">ALINHADA_1:</span>
          {chars1.map((c, i) => (
            <span key={i} className={c === '-' ? 'text-red-500 bg-red-500/10 font-bold px-[1px]' : 'text-emerald-400'}>
              {c}
            </span>
          ))}
        </div>
        
        {/* Linha de Conexão Química/Match */}
        <div className="flex whitespace-nowrap text-xs text-emerald-800 select-none">
          <span className="w-24 mr-4 sticky left-0 bg-slate-950"></span>
          {chars1.map((c, i) => (
            <span key={i} className="px-[1px]">
              {c === chars2[i] && c !== '-' ? '│' : ' '}
            </span>
          ))}
        </div>

        {/* Linha da Sequência 2 */}
        <div className="flex whitespace-nowrap">
          <span className="w-24 text-xs font-bold text-teal-600 uppercase font-mono mr-4 select-none sticky left-0 bg-slate-950">ALINHADA_2:</span>
          {chars2.map((c, i) => (
            <span key={i} className={c === '-' ? 'text-red-500 bg-red-500/10 font-bold px-[1px]' : 'text-teal-400'}>
              {c}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto p-6 bg-slate-950/70 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.08)]"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-emerald-900/40 pb-4">
        <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-green-500 flex items-center gap-3 uppercase">
          <Dna className="text-teal-400 animate-spin-slow" />
          Needleman-Wunsch (Global Par a Par)
        </h2>
        <button 
          onClick={carregarExemplo}
          className="px-3 py-1 text-xs border border-teal-500/40 hover:border-teal-400 text-teal-400 font-mono tracking-wider rounded uppercase transition-colors"
        >
          [ Carregar Exemplo Par ]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bloco Seq 1 */}
        <div className="p-4 bg-black/60 rounded-xl border border-emerald-950/80 space-y-3">
          <div className="text-emerald-500 text-xs tracking-widest font-mono uppercase font-bold">[ INPUT_NUCLEO_A ]</div>
          <input 
            type="text" 
            placeholder="ID da Sequência (Ex: seq1)" 
            value={reqData.sequencia1.id}
            onChange={(e) => updateField('sequencia1', 'id', e.target.value)}
            className="w-full bg-slate-950 text-emerald-300 border border-emerald-900/60 rounded p-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
          <input 
            type="text" 
            placeholder="Cabeçalho FASTA (Ex: >seq1 exemplo_1)" 
            value={reqData.sequencia1.fasta}
            onChange={(e) => updateField('sequencia1', 'fasta', e.target.value)}
            className="w-full bg-slate-950 text-emerald-300 border border-emerald-900/60 rounded p-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
          <textarea 
            placeholder="Cadeia de Conteúdo Bruto (Ex: ATGC...)" 
            value={reqData.sequencia1.conteudo}
            onChange={(e) => updateField('sequencia1', 'conteudo', e.target.value)}
            className="w-full h-24 bg-slate-950 text-emerald-300 border border-emerald-900/60 rounded p-2 text-xs font-mono focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Bloco Seq 2 */}
        <div className="p-4 bg-black/60 rounded-xl border border-emerald-950/80 space-y-3">
          <div className="text-teal-500 text-xs tracking-widest font-mono uppercase font-bold">[ INPUT_NUCLEO_B ]</div>
          <input 
            type="text" 
            placeholder="ID da Sequência (Ex: seq2)" 
            value={reqData.sequencia2.id}
            onChange={(e) => updateField('sequencia2', 'id', e.target.value)}
            className="w-full bg-slate-950 text-teal-300 border border-teal-900/60 rounded p-2 text-xs font-mono focus:outline-none focus:border-teal-500"
          />
          <input 
            type="text" 
            placeholder="Cabeçalho FASTA (Ex: >seq2 exemplo_2)" 
            value={reqData.sequencia2.fasta}
            onChange={(e) => updateField('sequencia2', 'fasta', e.target.value)}
            className="w-full bg-slate-950 text-teal-300 border border-teal-900/60 rounded p-2 text-xs font-mono focus:outline-none focus:border-teal-500"
          />
          <textarea 
            placeholder="Cadeia de Conteúdo Bruto (Ex: TTGA...)" 
            value={reqData.sequencia2.conteudo}
            onChange={(e) => updateField('sequencia2', 'conteudo', e.target.value)}
            className="w-full h-24 bg-slate-950 text-teal-300 border border-teal-900/60 rounded p-2 text-xs font-mono focus:outline-none focus:border-teal-500 resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleAlign}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-teal-950 via-cyan-900 to-emerald-950 hover:from-teal-900 hover:to-emerald-800 text-teal-200 font-bold font-mono tracking-[0.25em] uppercase rounded-xl transition-all duration-300 border border-teal-500/40 shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:shadow-[0_0_35px_rgba(20,184,166,0.4)] disabled:opacity-40"
      >
        {loading ? 'Calculando Alinhamento Dinâmico...' : 'Computar Alinhamento Par-a-Par'}
      </button>

      {/* PAINEL DE RESULTADOS */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Matriz Score Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-black/80 border border-teal-500/30 p-5 rounded-xl">
            <div className="sm:col-span-1 text-center sm:text-left">
              <div className="text-xs text-emerald-500/60 font-mono uppercase tracking-widest">Score de Alinhamento</div>
              <div className="text-5xl font-black font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]">
                {result.score}
              </div>
            </div>
            <div className="sm:col-span-2 text-xs font-mono text-emerald-500/40 space-y-1 border-t sm:border-t-0 sm:border-l border-emerald-900/60 pt-3 sm:pt-0 sm:pl-4">
              <div>S1 Mapeado: <span className="text-emerald-400">{result.S1.id}</span></div>
              <div>S2 Mapeado: <span className="text-teal-400">{result.S2.id}</span></div>
            </div>
          </div>

          {/* Visualizador Avançado */}
          <div className="p-5 bg-black/90 border border-teal-500/20 rounded-xl relative">
            <div className="absolute top-0 left-0 bg-teal-500 px-3 py-0.5 text-[10px] font-mono font-bold text-black uppercase tracking-wider rounded-br">
              Mapa Comparativo Genômico
            </div>
            <div className="mt-4">
              {renderVisualizadorSobreposto(result.sequenciaAlinhada1, result.sequenciaAlinhada2)}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}