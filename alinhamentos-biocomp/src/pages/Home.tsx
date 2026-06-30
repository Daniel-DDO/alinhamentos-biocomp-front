import { Link } from 'react-router-dom'

const top = ['A', 'C', 'G', 'G', 'T', 'A', '-', 'C', 'G', 'A', 'T']
const bottom = ['A', 'C', 'G', '-', 'T', 'A', 'T', 'C', 'G', 'A', 'T']

function Strand({ bases, variant }: { bases: string[]; variant: 'top' | 'bottom' }) {
  return (
    <div className={`strand ${variant}`}>
      {bases.map((b, i) => {
        const isGap = b === '-'
        const isMatch = !isGap && top[i] === bottom[i]
        return (
          <span
            key={i}
            className={'base' + (isGap ? ' gap' : isMatch ? ' match' : ' mismatch')}
          >
            {b}
          </span>
        )
      })}
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="hero">
        <span className="hero-tag">Biologia Computacional</span>
        <h1>Alinhamentos Múltiplos de Sequência</h1>
        <p className="lede">
          Ferramenta para alinhar sequências biológicas, comparando bases par a par com o
          algoritmo de Needleman-Wunsch ou processando múltiplas sequências.
        </p>

        <div className="hero-actions">
          <Link to="/needleman-wunsch" className="btn">Needleman-Wunsch →</Link>
          <Link to="/msa" className="btn btn-ghost">MSA por texto →</Link>
        </div>

        <div className="strand-block">
          <div className="strand-row">
            <span className="strand-label">seq. 1</span>
            <Strand bases={top} variant="top" />
          </div>
          <div className="strand-row">
            <span className="strand-label">seq. 2</span>
            <Strand bases={bottom} variant="bottom" />
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <Link to="/needleman-wunsch" className="feature-card">
          <span className="num">01 — alinhamento par a par</span>
          <h2>Needleman-Wunsch</h2>
          <p>
            Informe duas sequências (id, fasta e conteúdo) e receba o alinhamento ótimo global,
            com pontuação e bases pareadas destacadas.
          </p>
          <span className="go">Abrir ferramenta →</span>
        </Link>

        <Link to="/msa" className="feature-card">
          <span className="num">02 — alinhamento múltiplo</span>
          <h2>MSA por texto</h2>
          <p>
            Cole um bloco de texto com várias sequências e envie diretamente para o endpoint
            de alinhamento múltiplo do backend.
          </p>
          <span className="go">Abrir ferramenta →</span>
        </Link>
      </section>
    </>
  )
}

export default Home