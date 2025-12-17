import React, { useEffect, useMemo, useState } from 'react'

/**
 * ActivityHistory.jsx
 * --------------------------------------------------
 * Dynamic activity & audit timeline
 * PharmaIntel AI – production style
 */

const PAGE_SIZE = 5

export default function ActivityHistory({ items: externalItems }) {
  /* ================= STATE ================= */
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  /* ================= FETCH ACTIVITY ================= */
  useEffect(() => {
    let mounted = true

    async function fetchActivity() {
      try {
        setLoading(true)

        // 🔁 If parent passes activity, use it
        if (externalItems && externalItems.length) {
          setItems(externalItems)
          setLoading(false)
          return
        }

        // 🔁 Simulated backend API
        setTimeout(() => {
          if (!mounted) return

          setItems([
            { id: 1, type: 'report', text: 'Generated Drug Interaction Report: Atenolol', ts: Date.now() - 1000 * 60 * 10 },
            { id: 2, type: 'chat', text: 'Asked AI: Aspirin + Warfarin interaction', ts: Date.now() - 1000 * 60 * 30 },
            { id: 3, type: 'search', text: 'Searched medicine: Metformin', ts: Date.now() - 1000 * 60 * 60 },
            { id: 4, type: 'download', text: 'Downloaded clinical safety PDF', ts: Date.now() - 1000 * 60 * 60 * 5 },
            { id: 5, type: 'reminder', text: 'Created medicine reminder', ts: Date.now() - 1000 * 60 * 60 * 24 },
            { id: 6, type: 'profile', text: 'Updated profile preferences', ts: Date.now() - 1000 * 60 * 60 * 48 }
          ])

          setLoading(false)
        }, 800)
      } catch (err) {
        setError('Failed to load activity history')
        setLoading(false)
      }
    }

    fetchActivity()
    return () => (mounted = false)
  }, [externalItems])

  /* ================= HELPERS ================= */
  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - ts) / 60000)
    if (diff < 1) return 'just now'
    if (diff < 60) return `${diff} min ago`
    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`
    return `${Math.floor(diff / 1440)} days ago`
  }

  const iconFor = (type) => {
    switch (type) {
      case 'report': return '📄'
      case 'chat': return '🤖'
      case 'search': return '🔍'
      case 'download': return '⬇️'
      case 'reminder': return '⏰'
      case 'profile': return '👤'
      default: return '•'
    }
  }

  /* ================= FILTERING ================= */
  const filtered = useMemo(() => {
    let data = filter === 'all'
      ? items
      : items.filter(i => i.type === filter)

    if (search.trim()) {
      data = data.filter(i =>
        i.text.toLowerCase().includes(search.toLowerCase())
      )
    }

    return data
  }, [items, filter, search])

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  /* ================= RENDER ================= */
  return (
    <div className="activity-root">
      {/* ================= INLINE CSS ================= */}
      <style>{`
        .activity-root {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
          font-family: Inter, system-ui, sans-serif;
        }

        .title {
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 0.75rem;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .filter-btn {
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          cursor: pointer;
        }

        .filter-btn.active {
          background: #EFF6FF;
          border-color: #93C5FD;
          color: #2563EB;
        }

        .search {
          width: 100%;
          padding: 0.45rem 0.6rem;
          border-radius: 0.5rem;
          border: 1px solid #CBD5E1;
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
        }

        .item {
          display: flex;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid #F1F5F9;
        }

        .item:last-child {
          border-bottom: none;
        }

        .icon {
          font-size: 1rem;
          line-height: 1.2;
        }

        .text {
          font-size: 0.85rem;
          color: #334155;
        }

        .meta {
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 0.15rem;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          font-size: 0.75rem;
        }

        .btn {
          padding: 0.3rem 0.6rem;
          border-radius: 0.4rem;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading,
        .empty,
        .error {
          font-size: 0.85rem;
          color: #64748B;
          padding: 1rem 0;
          text-align: center;
        }

        .error {
          color: #DC2626;
        }
      `}</style>

      <h3 className="title">Activity History</h3>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search activity…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
      />

      {/* FILTERS */}
      <div className="filters">
        {['all', 'report', 'chat', 'search', 'download', 'reminder', 'profile'].map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1) }}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading && <div className="loading">Loading activity…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !paginated.length && (
        <div className="empty">No activity found</div>
      )}

      {!loading && paginated.map(item => (
        <div key={item.id} className="item">
          <div className="icon">{iconFor(item.type)}</div>
          <div>
            <div className="text">{item.text}</div>
            <div className="meta">
              {timeAgo(item.ts)} • {item.type}
            </div>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            className="btn"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
