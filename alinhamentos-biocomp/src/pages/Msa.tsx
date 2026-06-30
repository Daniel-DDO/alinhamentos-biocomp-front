import { useState, type FormEvent } from 'react'
import { alinharTextoMsa } from '../api/client'
import type { MsaResponse } from '../api/client'

const placeholder = `>seq1 exemplo_1
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
CGCGCGCGATATATATCGCGCGCGATATATATCGCGCGC`

function AlignedBlock({ alinhamentos }: { alinhamentos: Record<string, string> }) {
  const entries = Object.entries(alinhamentos)
  return (
    <div className="align-track">
      {entries.map(([id, seq]) => (
        <div className="row" key={id}>
          <span className="tag" style={{ width: 140 }} title={id}>
            {id}
          </span>
          {seq.split('').map((ch, j) => (
            <span key={j} className={'base' + (ch === '-' ? ' gap' : '')}>
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function Msa() {
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MsaResponse | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await alinharTextoMsa(texto)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao alinhar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">02 · Alinhamento múltiplo</span>
        <h1 style={{ fontSize: 30 }}>MSA por texto</h1>
        <p className="lede">
          Cole um bloco de texto em formato FASTA com várias sequências e tenha o{' '}
          <code className="mono">alinhamento múltiplo</code>.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: 'fit-content' }}
          onClick={() => setTexto(placeholder)}
        >
          Carregar exemplo
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="panel">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="texto-msa">texto</label>
            <textarea
              id="texto-msa"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={placeholder}
              style={{ minHeight: 220 }}
            />
          </div>
        </div>

        <button className="btn" type="submit" disabled={loading || !texto.trim()} style={{ marginTop: 20 }}>
          {loading ? 'Alinhando…' : 'Alinhar texto'}
        </button>

        {loading && (
          <div className="status loading">
            <span className="dot" /> aguardando resposta do servidor
          </div>
        )}
        {error && <div className="error-box">{error}</div>}
      </form>

      {result && (
        <div className="result">
          <div className="panel" style={{ marginBottom: 18 }}>
            <h3 style={{ marginBottom: 10 }}>árvore-guia (Newick)</h3>
            <pre className="raw-json" style={{ marginBottom: 0 }}>{result.arvoreNewick}</pre>
          </div>
          <AlignedBlock alinhamentos={result.alinhamentos} />
        </div>
      )}
    </>
  )
}

export default Msa