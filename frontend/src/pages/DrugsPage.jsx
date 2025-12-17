import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchDrugs } from '../services/drug.service'

export default function DrugsPage() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const timer = setTimeout(async () => {
      if (!q.trim()) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        const res = await searchDrugs(q)
        if (!mounted) return
        setResults(res || [])
      } catch (e) {
        setResults([])
      } finally {
        if (mounted) setLoading(false)
      }
    }, 300)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [q])

  return (
    <div className="drug-root">
      <style>{`
        .drug-root {
          max-width: 1200px;
          margin: 0 auto;
          padding: 7rem 1.5rem 4rem;
          background: #F8FAFC;
          min-height: 100vh;
          font-family: Inter, system-ui, sans-serif;
        }

        .drug-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0F172A;
        }

        .drug-header p {
          margin-top: 4px;
          color: #64748B;
          font-size: 0.9rem;
        }

        .search-box {
          margin-top: 1.5rem;
          margin-bottom: 2rem;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #CBD5E1;
          font-size: 0.9rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .drug-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1rem;
          text-decoration: none;
          color: inherit;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .drug-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(15,23,42,0.08);
        }

        .drug-name {
          font-size: 1rem;
          font-weight: 700;
          color: #0F172A;
        }

        .drug-class {
          font-size: 0.8rem;
          color: #475569;
          margin-top: 2px;
        }

        .badges {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.45rem;
          border-radius: 999px;
          background: #EFF6FF;
          color: #1D4ED8;
          border: 1px solid #BFDBFE;
        }

        .schedule {
          background: #FEFCE8;
          color: #92400E;
          border: 1px solid #FACC15;
        }

        .brands {
          margin-top: 0.6rem;
          font-size: 0.8rem;
          color: #475569;
        }

        .loading,
        .empty {
          text-align: center;
          padding: 3rem 1rem;
          color: #64748B;
          font-size: 0.9rem;
        }

        .skeleton {
          height: 90px;
          border-radius: 1rem;
          background: linear-gradient(
            90deg,
            #F1F5F9,
            #E2E8F0,
            #F1F5F9
          );
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
      `}</style>

      {/* HEADER */}
      <div className="drug-header">
        <h2>Drug Encyclopedia</h2>
        <p>Search pharmaceutical drugs, brands, classes, and schedules</p>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          className="search-input"
          placeholder="Search by generic name, brand, or class…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton" />
          ))}
        </div>
      )}

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <div className="grid">
          {results.map((r) => (
            <Link key={r._id} to={`/drugs/${r._id}`} className="drug-card">
              <div className="drug-name">{r.genericName}</div>
              <div className="drug-class">{r.drugClass}</div>

              <div className="badges">
                {r.schedule && (
                  <span className="badge schedule">
                    Schedule {r.schedule}
                  </span>
                )}
                {r.route && <span className="badge">{r.route}</span>}
              </div>

              {r.brandNames?.length > 0 && (
                <div className="brands">
                  Brands: {r.brandNames.slice(0, 3).map(b => b.name).join(', ')}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && q && results.length === 0 && (
        <div className="empty">
          No drugs found for <strong>{q}</strong>
        </div>
      )}
    </div>
  )
}
