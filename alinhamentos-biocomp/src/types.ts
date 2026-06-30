export interface SequenciaInput {
  id: string;
  fasta: string;
  conteudo: string;
}

// POST /alinhamento/needleman-wunsch
export interface NeedlemanRequest {
  sequencia1: SequenciaInput;
  sequencia2: SequenciaInput;
}

export interface NeedlemanResponse {
  S1: SequenciaInput;
  S2: SequenciaInput;
  score: number;
  sequenciaAlinhada1: string;
  sequenciaAlinhada2: string;
}

// POST /api/msa/alinhar-texto
export interface MsaResponse {
  arvoreNewick: string;
  alinhamentos: Record<string, string>;
}