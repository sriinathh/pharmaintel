import React, { useEffect, useMemo, useState } from 'react'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import RecentQueries from '../components/dashboard/RecentQueries'
import HealthInsights from '../components/dashboard/HealthInsights'
import api from '../services/api'

/**
 * DashboardPage.jsx
 * ----------------------------------------------------
 * Large, dynamic, backend-ready dashboard
 * PharmaIntel AI – Production-style implementation
 */

export default function DashboardPage() {

  /* =====================================================
     1. GLOBAL STATE
  ===================================================== */
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    queries: 0,
    reports: 0,
    medicines: 0,
    reminders: 0,
    pharmacies: 0
  })

  const [usageTrends, setUsageTrends] = useState({
    queries: [],
    reports: [],
    medicines: []
  })

  const [activities, setActivities] = useState([])
  const [alerts, setAlerts] = useState([])
  const [insights, setInsights] = useState([])

  const [filters, setFilters] = useState({
    range: '7d',
    category: 'all'
  })

  /* =====================================================
     2. SIMULATED BACKEND FETCH (REPLACE WITH API)
  ===================================================== */
  useEffect(() => {
    let mounted = true
    setLoading(true)
    async function load() {
      try {
        const [statsRes, trendsRes, activityRes, alertsRes, insightsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/trends'),
          api.get('/dashboard/activity'),
          api.get('/dashboard/alerts'),
          api.get('/dashboard/insights')
        ])
        if (!mounted) return
        setStats(statsRes)
        setUsageTrends(trendsRes)
        setActivities(activityRes)
        setAlerts(alertsRes)
        setInsights(insightsRes)
      } catch (err) {
        console.error('Dashboard load error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  /* =====================================================
     3. DERIVED DATA (COMPUTED, NOT STATIC)
  ===================================================== */
  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const trendPercent = (arr) => {
    if (arr.length < 2) return 0
    const prev = arr[arr.length - 2]
    const curr = arr[arr.length - 1]
    return (((curr - prev) / prev) * 100).toFixed(1)
  }

  const statCards = useMemo(() => ([
    { label: 'AI Queries', value: stats.queries, trend: trendPercent(usageTrends.queries), color: '#4F46E5' },
    { label: 'Reports Generated', value: stats.reports, trend: trendPercent(usageTrends.reports), color: '#0D9488' },
    { label: 'Medicines Viewed', value: stats.medicines, trend: trendPercent(usageTrends.medicines), color: '#0F172A' },
    { label: 'Active Reminders', value: stats.reminders, trend: '+12.5', color: '#F59E0B' },
    { label: 'Nearby Pharmacies', value: stats.pharmacies, trend: '+8.1', color: '#2563EB' }
  ]), [stats, usageTrends])

  /* =====================================================
     4. LOADING STATE
  ===================================================== */
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          Loading your intelligent dashboard…
        </div>
      </DashboardLayout>
    )
  }

  /* =====================================================
     5. RENDER
  ===================================================== */
  return (
    <div className="dashboard-root">
      <style>{`
        .dashboard-root {
          background: #F8FAFC;
          min-height: 100vh;
          font-family: Inter, system-ui, sans-serif;
        }

        .section {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
        }

        .section-title {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #0F172A;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.25rem;
        }

        .stat-card {
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.25rem;
          background: #FFFFFF;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748B;
        }

        .trend {
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .activity {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 0.9rem;
        }

        .activity:last-child {
          border-bottom: none;
        }

        .alert {
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .alert.warning {
          background: #FEFCE8;
          border: 1px solid #FACC15;
          color: #713F12;
        }

        .alert.info {
          background: #EFF6FF;
          border: 1px solid #93C5FD;
          color: #1E40AF;
        }
      `}</style>

      <DashboardLayout>

        {/* HEADER */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 700 }}>
            {greeting} 👋
          </h2>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>
            Your pharmaceutical intelligence overview
          </p>
        </div>

        {/* STATS */}
        <div className="stat-grid">
          {statCards.map(card => (
            <div key={card.label} className="stat-card">
              <div className="stat-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="stat-label">{card.label}</div>
              <div className="trend" style={{ color: card.trend >= 0 ? '#16A34A' : '#DC2626' }}>
                {card.trend}% this period
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

          {/* LEFT */}
          <div className="section">
            <div className="section-title">Recent Queries</div>
            <RecentQueries />

            <div className="section-title" style={{ marginTop: '2rem' }}>
              Activity Timeline
            </div>

            {activities.map(a => (
              <div key={a.id} className="activity">
                <span>{a.text}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{a.time}</span>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ALERTS */}
            <div className="section">
              <div className="section-title">Alerts</div>
              {alerts.map(a => (
                <div key={a.id} className={`alert ${a.level}`}>
                  {a.text}
                </div>
              ))}
            </div>

            {/* INSIGHTS */}
            <div className="section">
              <div className="section-title">AI Health Insights</div>
              <HealthInsights insights={insights} />
              {insights.map(i => (
                <div key={i.id} style={{ marginTop: '0.75rem' }}>
                  <strong>{i.title}</strong>
                  <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                    {i.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1rem',
          background: '#FEFCE8',
          border: '1px solid #FACC15',
          borderRadius: '0.75rem',
          fontSize: '0.85rem',
          color: '#713F12'
        }}>
          ⚠️ All AI insights are for educational purposes only and must not be used
          as medical diagnosis or treatment advice.
        </div>

      </DashboardLayout>
    </div>
  )
}
