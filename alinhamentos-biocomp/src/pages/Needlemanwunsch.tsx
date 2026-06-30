import { useState, type FormEvent } from 'react'
import { alinharNeedlemanWunsch } from '../api/client'
import type { NeedlemanWunschResponse, Sequencia } from '../api/client'

const emptySeq = (): Sequencia => ({ id: '', fasta: '', conteudo: '' })

function SequenciaFields({
  label,
  value,
  onChange,
}: {
  label: string
  value: Sequencia
  onChange: (v: Sequencia) => void
}) {
  return (
    <div className="panel">
      <h3 style={{ marginBottom: 14 }}>{label}</h3>
      <div className="field">
        <label htmlFor={`${label}-id`}>id</label>
        <input
          id={`${label}-id`}
          value={value.id}
          onChange={(e) => onChange({ ...value, id: e.target.value })}
          placeholder="seq1"
        />
      </div>
      <div className="field">
        <label htmlFor={`${label}-fasta`}>fasta</label>
        <input
          id={`${label}-fasta`}
          value={value.fasta}
          onChange={(e) => onChange({ ...value, fasta: e.target.value })}
          placeholder=">seq1 descrição"
        />
      </div>
      <div className="field">
        <label htmlFor={`${label}-conteudo`}>conteúdo</label>
        <textarea
          id={`${label}-conteudo`}
          value={value.conteudo}
          onChange={(e) => onChange({ ...value, conteudo: e.target.value })}
          placeholder="ACGGTACGAT"
        />
      </div>
    </div>
  )
}

function AlignedRow({ a, b }: { a: string; b: string }) {
  return (
    <div className="align-track">
      <div className="row">
        <span className="tag">S1</span>
        {a.split('').map((ch, i) => {
          const isGap = ch === '-' || b[i] === '-'
          const isMatch = !isGap && ch === b[i]
          return (
            <span key={i} className={'base' + (isGap ? ' gap' : isMatch ? ' match' : ' mismatch')}>
              {ch}
            </span>
          )
        })}
      </div>
      <div className="row">
        <span className="tag">S2</span>
        {b.split('').map((ch, i) => {
          const isGap = ch === '-' || a[i] === '-'
          const isMatch = !isGap && ch === a[i]
          return (
            <span key={i} className={'base' + (isGap ? ' gap' : isMatch ? ' match' : ' mismatch')}>
              {ch}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function exemplo(): [Sequencia, Sequencia] {
  return [
    {
      id: 'seq1',
      fasta: '>seq1 exemplo_1\nATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA\nCGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC',
      conteudo: 'ATGCGTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTACGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC',
    },
    {
      id: 'seq2',
      fasta: '>seq2 exemplo_2\nTTGACGATCGATCGATCGATCGATCGATCGATCGATCGA\nGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCA',
      conteudo: 'TTGACGATCGATCGATCGATCGATCGATCGATCGATCGAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCA',
    },
  ]
}

function NeedlemanWunsch() {
  const [seq1, setSeq1] = useState<Sequencia>(emptySeq())
  const [seq2, setSeq2] = useState<Sequencia>(emptySeq())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<NeedlemanWunschResponse | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await alinharNeedlemanWunsch({ sequencia1: seq1, sequencia2: seq2 })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado ao alinhar.')
    } finally {
      setLoading(false)
    }
  }

  function carregarExemplo() {
    const [s1, s2] = exemplo()
    setSeq1(s1)
    setSeq2(s2)
  }

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">01 · Alinhamento par a par</span>
        <h1 style={{ fontSize: 30 }}>Needleman-Wunsch</h1>
        <p className="lede">
          Preenche os dados das duas sequências e{' '}
          <code className="mono">realiza o alinhamento</code>.
        </p>
        <button type="button" className="btn btn-ghost" style={{ width: 'fit-content' }} onClick={carregarExemplo}>
          Carregar exemplo
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="seq-grid">
          <SequenciaFields label="Sequência 1" value={seq1} onChange={setSeq1} />
          <SequenciaFields label="Sequência 2" value={seq2} onChange={setSeq2} />
        </div>

        <button
          className="btn"
          type="submit"
          disabled={loading || !seq1.conteudo.trim() || !seq2.conteudo.trim()}
          style={{ marginTop: 20 }}
        >
          {loading ? 'Alinhando…' : 'Alinhar sequências'}
        </button>

        {loading && (
          <div className="status loading">
            <span className="dot" /> aguardando resposta do backend (pode levar alguns segundos no Render)
          </div>
        )}
        {error && <div className="error-box">{error}</div>}
      </form>

      {result && (
        <div className="result">
          <div className="score-card">
            <span>score</span>
            <strong>{result.score}</strong>
          </div>
          <AlignedRow a={result.sequenciaAlinhada1} b={result.sequenciaAlinhada2} />
        </div>
      )}
    </>
  )
}

export default NeedlemanWunsch