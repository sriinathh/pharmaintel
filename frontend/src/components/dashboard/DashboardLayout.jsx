import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [stats, setStats] = useState(null)

  /* -------- SIMULATED BACKEND STATS -------- */
  useEffect(() => {
    setTimeout(() => {
      setStats({
        queries: 86,
        reports: 24,
        medicines: 170,
      })
    }, 600)
  }, [])

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/chat', label: 'Chatbot' },
    { path: '/reports', label: 'Reports' },
    { path: '/profile', label: 'Profile' },
    { path: '/admin', label: 'Admin' },
  ]

  return (
    <div className="dash-root">
      {/* ============ INLINE CSS ============ */}
      <style>{`
        .dash-root {
          padding-top: 5rem;
          background: #F8FAFC;
          min-height: 100vh;
          font-family: Inter, system-ui, sans-serif;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: ${collapsed ? '80px 1fr' : '240px 1fr'};
          }
        }

        /* ---------- SIDEBAR ---------- */
        .sidebar {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1rem;
          height: fit-content;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .sidebar-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0F172A;
        }

        .collapse-btn {
          font-size: 0.75rem;
          border: none;
          background: #EFF6FF;
          color: #2563EB;
          padding: 0.3rem 0.5rem;
          border-radius: 0.4rem;
          cursor: pointer;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .nav a {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          text-decoration: none;
          color: #475569;
        }

        .nav a.active {
          background: #EFF6FF;
          color: #2563EB;
          font-weight: 500;
        }

        .nav a:hover {
          background: #F1F5F9;
        }

        .nav span {
          display: ${collapsed ? 'none' : 'inline'};
        }

        /* ---------- MAIN ---------- */
        .main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .overview-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .overview-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #0F172A;
        }

        .overview-sub {
          font-size: 0.8rem;
          color: #64748B;
        }

        .stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1rem;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #64748B;
        }

        .stat-number {
          margin-top: 0.4rem;
          font-size: 1.6rem;
          font-weight: 700;
          color: #2563EB;
        }

        .content-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.25rem;
        }
      `}</style>

      <div className="container">
        <div className="grid">

          {/* ============ SIDEBAR ============ */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">Navigation</div>
              <button
                className="collapse-btn"
                onClick={() => setCollapsed(c => !c)}
              >
                {collapsed ? '>>' : '<<'}
              </button>
            </div>

            <nav className="nav">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  • <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* ============ MAIN CONTENT ============ */}
          <main className="main">
            <div className="overview-card">
              <div>
                <div className="overview-title">Dashboard Overview</div>
                <div className="overview-sub">
                  Welcome to PharmaIntel AI
                </div>
              </div>
              <div className="overview-sub">
                System status: <strong>Online</strong>
              </div>
            </div>

            {/* STATS */}
            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">Queries Asked</div>
                <div className="stat-number">
                  {stats ? stats.queries : '—'}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Reports Generated</div>
                <div className="stat-number" style={{ color: '#0D9488' }}>
                  {stats ? stats.reports : '—'}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Medicines Searched</div>
                <div className="stat-number" style={{ color: '#0F172A' }}>
                  {stats ? stats.medicines : '—'}
                </div>
              </div>
            </div>

            {/* CHILD CONTENT */}
            <div className="content-card">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
