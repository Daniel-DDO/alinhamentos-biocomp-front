import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/needleman-wunsch', label: 'Needleman-Wunsch', end: false },
  { to: '/msa', label: 'MSA por texto', end: false },
]

function App() {
  return (
    <div id="shell">
      <aside id="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span>A</span>
            <span>T</span>
            <span>C</span>
            <span>G</span>
          </div>
          <div className="brand-text">
            <strong>BioComp</strong>
            <span>Alinhamentos Múltiplos de Sequências</span>
          </div>
        </div>

        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }: { isActive: boolean }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="dim">Biologia Computacional</span>
          <span className="mono dim">Daniel Dionísio de Oliveira</span>
          <span className="mono dim">Pedro Henrique Apolinário da Silva</span>
        </div>
      </aside>

      <main id="content">
        <Outlet />
      </main>
    </div>
  )
}

export default App