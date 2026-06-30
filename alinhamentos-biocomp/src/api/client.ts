export const API_BASE = 'https://alinhamentos-biocomp-back.onrender.com'

export interface Sequencia {
  id: string
  fasta: string
  conteudo: string
}

export interface NeedlemanWunschRequest {
  sequencia1: Sequencia
  sequencia2: Sequencia
}

export interface NeedlemanWunschResponse {
  score: number
  sequenciaAlinhada1: string
  sequenciaAlinhada2: string
  S1: Sequencia
  S2: Sequencia
}

export interface MsaResponse {
  arvoreNewick: string
  alinhamentos: Record<string, string>
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text()
  let data: unknown = undefined
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    data = text
  }
  if (!res.ok) {
    const msg =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : `Erro ${res.status} ao chamar a API`
    throw new Error(msg)
  }
  return data as T
}

export async function alinharNeedlemanWunsch(
  body: NeedlemanWunschRequest,
): Promise<NeedlemanWunschResponse> {
  const res = await fetch(`${API_BASE}/alinhamento/needleman-wunsch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handle<NeedlemanWunschResponse>(res)
}

export async function alinharTextoMsa(texto: string): Promise<MsaResponse> {
  const res = await fetch(`${API_BASE}/api/msa/alinhar-texto`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: texto,
  })
  return handle<MsaResponse>(res)
}