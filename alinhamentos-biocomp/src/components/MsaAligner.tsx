import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Terminal, FileText, Cpu } from 'lucide-react';
import type { MsaResponse } from '../types';

export default function MsaAligner() {
  const [inputData, setInputData] = useState<string>('');
  const [result, setResult] = useState<MsaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAlign = async () => {
    if (!inputData.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/msa/alinhar-texto', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: inputData, // Enviado puramente como string (raw text body)
      });

      if (!response.ok) throw new Error('Erro na computação de alinhamento.');
      
      const data: MsaResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Falha ao conectar com a matriz computacional de MSA.');
    } finally {
      setLoading(false);
    }
  };

  const carregarExemplo = () => {
    setInputData(`>seq1 exemplo_1
ATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA
CGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC

>seq2 exemplo_2
TTGACGATCGATCGATCGATCGATCGATCGATCGATCGA
GCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCA

>seq3 exemplo_3
GGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCCGGG
CCCGGGAAATTTCCCGGGAAATTTCCCGGGAAATTTCCC

>seq4 exemplo_4
ATATATATCGCGCGCGATATATATCGCGCGCGATATATAT
CGCGCGCGATATATATCGCGCGCGATATATATCGCGCGC`);
  };

  // Função para colorir e renderizar nucleotídeos de forma futurista
  const renderSeqColorida = (sequencia: string) => {
    return sequencia.split('').map((char, index) => {
      if (char === '-') {
        return (
          <span key={index} className="bg-red-500/20 text-red-400 font-bold px-[1px] border-b border-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]">
            -
          </span>
        );
      }
      return <span key={index} className="text-emerald-400 font-mono">{char}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto p-6 bg-slate-950/70 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.08)]"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-emerald-900/40 pb-4">
        <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500 flex items-center gap-3 uppercase">
          <Network className="text-emerald-400 animate-pulse" />
          MSA / Alinhamento Múltiplo
        </h2>
        <button 
          onClick={carregarExemplo}
          className="px-3 py-1 text-xs border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 font-mono tracking-wider rounded uppercase transition-colors"
        >
          [ Carregar Dataset Exemplo ]
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-emerald-400/80 text-xs font-mono mb-2 uppercase tracking-widest">
            <Terminal size={14} /> Terminal de Entrada de Sequências (Múltiplos FASTAs)
          </label>
          <textarea
            className="w-full h-56 bg-black/80 border border-emerald-500/30 rounded-xl p-4 text-emerald-300 font-mono text-sm focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all resize-none leading-relaxed placeholder-emerald-900/50"
            placeholder="Cole seu agrupamento de sequências aqui..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
        </div>

        <button
          onClick={handleAlign}
          disabled={loading}
          className="relative w-full py-4 bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 hover:from-emerald-900 hover:to-emerald-700 text-emerald-200 font-bold font-mono tracking-[0.25em] uppercase rounded-xl transition-all duration-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] disabled:opacity-40 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Cpu className="animate-spin text-emerald-400" />
              <span>Processando Cadeias Filogenéticas...</span>
            </div>
          ) : (
            'Executar Alinhamento Heurístico'
          )}
        </button>

        {/* ÁREA DE RESULTADOS */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 space-y-6"
          >
            {/* Bloco da Árvore Newick */}
            <div className="p-5 bg-black/90 border border-emerald-500/30 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-emerald-500 px-3 py-0.5 text-[10px] font-mono font-bold text-black uppercase tracking-wider rounded-br">
                Árvore Guia (Formato Newick)
              </div>
              <div className="mt-4 text-emerald-400 font-mono text-xs overflow-x-auto bg-slate-950 p-3 rounded border border-emerald-900/50 leading-relaxed whitespace-pre shadow-inner">
                {result.arvoreNewick}
              </div>
            </div>

            {/* Bloco das Alinhadas */}
            <div className="p-5 bg-black/90 border border-emerald-500/30 rounded-xl relative">
              <div className="bg-emerald-500 px-3 py-0.5 text-[10px] font-mono font-bold text-black uppercase tracking-wider rounded-br absolute top-0 left-0">
                Sequências Alinhadas Resultantes
              </div>

              <div className="mt-6 space-y-4">
                {Object.entries(result.alinhamentos).map(([idSequencia, seqTexto]) => (
                  <div key={idSequencia} className="border-b border-emerald-950/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={12} className="text-emerald-500" />
                      <span className="text-xs font-mono font-bold text-emerald-500/90 tracking-wide">
                        {idSequencia}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded text-sm font-mono overflow-x-auto whitespace-nowrap tracking-wider shadow-inner leading-none border border-emerald-950">
                      {renderSeqColorida(seqTexto)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}