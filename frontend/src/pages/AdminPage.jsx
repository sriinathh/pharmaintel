import React, { useEffect, useState } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  /* -------- SIMULATED API FETCH (BACKEND READY) -------- */
  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: 1248,
        queries: 3912,
        reports: 842,
        pharmacies: 156,
      })

      setActivities([
        { id: 1, action: 'New user registered', time: '2 min ago' },
        { id: 2, action: 'AI report generated', time: '12 min ago' },
        { id: 3, action: 'Pharmacy directory updated', time: '1 hour ago' },
        { id: 4, action: 'Admin reviewed audit logs', time: 'Today' },
      ])

      setLoading(false)
    }, 800)
  }, [])

  return (
    <div className="admin-root">
      {/* ============ INLINE CSS ============ */}
      <style>{`
        .admin-root {
          max-width: 1280px;
          margin: 0 auto;
          padding: 7rem 1.5rem 4rem;
          font-family: Inter, system-ui, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
        }

        .admin-header {
          margin-bottom: 2rem;
        }

        .admin-title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #0F172A;
        }

        .admin-sub {
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .stats-grid {
          margin-top: 2rem;
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
        }

        .stat-number {
          font-size: 1.9rem;
          font-weight: 700;
          color: #2563EB;
        }

        .stat-label {
          margin-top: 0.25rem;
          font-size: 0.85rem;
          color: #475569;
        }

        .section {
          margin-top: 3rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 1rem;
        }

        .tool-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 0.9rem;
        }

        .tool-item:last-child {
          border-bottom: none;
        }

        .tool-btn {
          padding: 0.4rem 0.9rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background: #EFF6FF;
          color: #2563EB;
          border: none;
          cursor: pointer;
        }

        .tool-btn:hover {
          background: #DBEAFE;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          font-size: 0.85rem;
          color: #475569;
          border-bottom: 1px solid #F1F5F9;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #64748B;
        }

        .loading {
          text-align: center;
          padding: 3rem 0;
          font-size: 0.9rem;
          color: #64748B;
        }

        .warning-box {
          margin-top: 2rem;
          padding: 1rem;
          border-radius: 0.75rem;
          background: #FEFCE8;
          border: 1px solid #FACC15;
          font-size: 0.85rem;
          color: #713F12;
        }
      `}</style>

      {/* ============ HEADER ============ */}
      <header className="admin-header">
        <h2 className="admin-title">Admin Console</h2>
        <p className="admin-sub">
          Monitor platform usage, manage users, and ensure system integrity.
        </p>
      </header>

      {loading ? (
        <div className="loading">Loading admin dashboard...</div>
      ) : (
        <>
          {/* ============ STATS ============ */}
          <section className="stats-grid">
            <div className="card">
              <div className="stat-number">{stats.users}</div>
              <div className="stat-label">Registered Users</div>
            </div>
            <div className="card">
              <div className="stat-number">{stats.queries}</div>
              <div className="stat-label">AI Queries</div>
            </div>
            <div className="card">
              <div className="stat-number">{stats.reports}</div>
              <div className="stat-label">Reports Generated</div>
            </div>
            <div className="card">
              <div className="stat-number">{stats.pharmacies}</div>
              <div className="stat-label">Pharmacies Listed</div>
            </div>
          </section>

          {/* ============ TOOLS ============ */}
          <section className="section">
            <h3 className="section-title">Administration Tools</h3>
            <div className="card">
              <div className="tool-item">
                <span>User Management</span>
                <button className="tool-btn">Manage</button>
              </div>
              <div className="tool-item">
                <span>Query & Audit Logs</span>
                <button className="tool-btn">View</button>
              </div>
              <div className="tool-item">
                <span>Pharmacy Directory</span>
                <button className="tool-btn">Edit</button>
              </div>
              <div className="tool-item">
                <span>System Health</span>
                <button className="tool-btn">Monitor</button>
              </div>
            </div>
          </section>

          {/* ============ RECENT ACTIVITY ============ */}
          <section className="section">
            <h3 className="section-title">Recent Admin Activity</h3>
            <div className="card">
              {activities.map((a) => (
                <div key={a.id} className="activity-item">
                  <span>{a.action}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ============ DISCLAIMER ============ */}
      <div className="warning-box">
        ⚠️ Admin access is restricted. All administrative actions are logged
        and monitored for security, compliance, and auditing purposes.
      </div>
    </div>
  )
}
