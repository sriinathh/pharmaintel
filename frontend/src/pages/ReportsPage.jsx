import React, { useEffect, useMemo, useState } from 'react'
import { listReports, generateReport } from '../services/report.service'
import ReportList from '../components/reports/ReportList'

const PAGE_SIZE = 6

export default function ReportsPage() {
  /* ================= STATE ================= */
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)

  // generate form state
  const [generating, setGenerating] = useState(false)
  const [topic, setTopic] = useState('')
  const [disease, setDisease] = useState('')
  const [regionInput, setRegionInput] = useState('')
  const [timeRangeInput, setTimeRangeInput] = useState('')

  /* ================= FETCH REPORTS ================= */
  useEffect(() => {
    let mounted = true

    async function fetchReports() {
      try {
        setLoading(true)
        setError(null)

        const data = await listReports()

        if (!mounted) return

        setReports(data || [])
      } catch (err) {
        setError('Failed to load reports')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
    return () => (mounted = false)
  }, [])

  /* ================= FILTER / SEARCH / SORT ================= */
  const processedReports = useMemo(() => {
    let data = [...reports]

    // filter
    if (filter !== 'all') {
      data = data.filter(r => r.type === filter)
    }

    // search
    if (search.trim()) {
      data = data.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    // sort
    if (sort === 'latest') {
      data.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    if (sort === 'oldest') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date))
    }

    return data
  }, [reports, search, filter, sort])

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(1, Math.ceil(processedReports.length / PAGE_SIZE))

  const paginatedReports = processedReports.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  /* =============== GENERATE REPORT =============== */
  const onGenerate = async (e) => {
    e && e.preventDefault()
    if (!topic.trim() || !disease.trim()) return alert('Please enter topic and disease')
    setGenerating(true)
    try {
      const payload = { topic: topic.trim(), disease: disease.trim(), region: regionInput.trim(), timeRange: timeRangeInput.trim() }
      await generateReport(payload)
      // refresh list
      setPage(1)
      const fresh = await listReports()
      setReports(fresh || [])
      // clear inputs
      setTopic('')
      setDisease('')
      setRegionInput('')
      setTimeRangeInput('')
    } catch (err) {
      setError('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="reports-root">
      {/* ================= INLINE CSS ================= */}
      <style>{`
        .reports-root {
          max-width: 1280px;
          margin: 0 auto;
          padding: 7rem 1.5rem 4rem;
          background: #F8FAFC;
          min-height: 100vh;
          font-family: Inter, system-ui, sans-serif;
        }

        .header {
          margin-bottom: 2rem;
        }

        .title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #0F172A;
        }

        .subtitle {
          margin-top: 0.3rem;
          font-size: 0.9rem;
          color: #475569;
          max-width: 42rem;
        }

        .card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
        }

        .toolbar {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .toolbar {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }

        .input,
        .select {
          padding: 0.45rem 0.6rem;
          border-radius: 0.5rem;
          border: 1px solid #CBD5E1;
          font-size: 0.85rem;
        }

        .loading,
        .error,
        .empty {
          text-align: center;
          padding: 3rem 1rem;
          font-size: 0.9rem;
          color: #64748B;
        }

        .error {
          color: #DC2626;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          font-size: 0.8rem;
        }

        .btn {
          padding: 0.35rem 0.8rem;
          border-radius: 0.4rem;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .note {
          margin-top: 2rem;
          padding: 1rem;
          background: #FEFCE8;
          border: 1px solid #FACC15;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          color: #713F12;
        }

        .gen-form {
          display: grid;
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        @media(min-width: 640px){ .gen-form { grid-template-columns: 1fr 1fr; } }

        .gen-actions { display:flex; gap:0.6rem; align-items:center }

      `}</style>

      {/* ================= HEADER ================= */}
      <div className="header">
        <h2 className="title">AI Reports</h2>
        <p className="subtitle">
          View, search, and create PharmaIntel AI reports. Use the generator to produce
          structured pharmaceutical intelligence based on topic, indication, region and time window.
        </p>
      </div>

      {/* ================= CARD ================= */}
      <div className="card">

        {/* GENERATOR FORM */}
        <form className="gen-form" onSubmit={onGenerate}>
          <input className="input" placeholder="Drug / Topic" value={topic} onChange={(e)=>setTopic(e.target.value)} />
          <input className="input" placeholder="Disease / Use case" value={disease} onChange={(e)=>setDisease(e.target.value)} />
          <input className="input" placeholder="Region (optional)" value={regionInput} onChange={(e)=>setRegionInput(e.target.value)} />
          <input className="input" placeholder="Time Range (optional)" value={timeRangeInput} onChange={(e)=>setTimeRangeInput(e.target.value)} />
          <div className="gen-actions">
            <button type="submit" className="btn" disabled={generating}>{generating ? 'Generating…' : 'Generate Report'}</button>
            <button type="button" className="btn" onClick={()=>{ setTopic(''); setDisease(''); setRegionInput(''); setTimeRangeInput('') }}>Clear</button>
          </div>
        </form>

        {/* TOOLBAR */}
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search reports…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />

          <select
            className="select"
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1) }}
          >
            <option value="all">All types</option>
            <option value="interaction">Drug Interaction</option>
            <option value="dosage">Dosage</option>
            <option value="summary">Clinical Summary</option>
          </select>

          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* CONTENT */}
        {loading && <div className="loading">Loading reports…</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && paginatedReports.length === 0 && (
          <div className="empty">
            <strong>No reports found</strong>
            <p style={{ marginTop: '0.5rem' }}>
              Generate reports using the form above or import existing analyses.
            </p>
          </div>
        )}

        {!loading && !error && paginatedReports.length > 0 && (
          <ReportList reports={paginatedReports} />
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              className="btn"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ================= DISCLAIMER ================= */}
      <div className="note">
        ⚠️ AI-generated reports are intended for educational and research
        assistance only. They must not be used as a substitute for professional
        medical judgment or diagnosis.
      </div>
    </div>
  )
}