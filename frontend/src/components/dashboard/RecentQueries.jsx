import React, { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'

/**
 * RecentQueries Component
 * Shows recent AI / search queries made by the user
 */
export default function RecentQueries() {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const PAGE_SIZE = 4

  /* ---------------- BACKEND FETCH ---------------- */
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await api.get('/dashboard/activity')
        if (!mounted) return
        // map to expected fields
        setQueries(data.map(d => ({ id: d.id, text: d.text, type: d.type === 'report' ? 'report' : (d.type === 'search' ? 'search' : 'chat'), createdAt: d.time })))
      } catch (err) {
        console.error('RecentQueries load error', err)
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])

  /* ---------------- HELPERS ---------------- */
  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const badgeColor = (type) => {
    switch (type) {
      case 'chat':
        return 'bg-indigo-50 text-indigo-700'
      case 'report':
        return 'bg-emerald-50 text-emerald-700'
      case 'search':
        return 'bg-amber-50 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filtered = useMemo(() => {
    return queries.filter(q =>
      q.text.toLowerCase().includes(search.toLowerCase())
    )
  }, [queries, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-900">
          Recent Queries
        </h3>
        <input
          placeholder="Search queries…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="text-xs border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-sm text-slate-500 py-6 text-center">
          Loading recent activity…
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-sm text-slate-500 py-6 text-center">
          No queries found
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map(q => (
            <div
              key={q.id}
              className="border border-slate-100 rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm text-slate-700 flex-1">
                  {q.text}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${badgeColor(
                    q.type
                  )}`}
                >
                  {q.type}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-1">
                {formatTime(q.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-xs">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-slate-500">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
