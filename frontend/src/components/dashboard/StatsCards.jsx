import React, { useEffect, useState } from 'react'

/**
 * StatsCards Component
 * Shows KPI cards with trends and animated counters
 */
export default function StatsCards({ stats }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  /* ---------------- DEFAULT FALLBACK DATA ---------------- */
  const fallback = [
    {
      id: 1,
      key: 'queries',
      label: 'Queries Asked',
      value: 1254,
      change: +12.4,
      color: '#4F46E5',
      bg: '#EEF2FF',
    },
    {
      id: 2,
      key: 'reports',
      label: 'Reports Generated',
      value: 312,
      change: +6.8,
      color: '#0D9488',
      bg: '#ECFEFF',
    },
    {
      id: 3,
      key: 'medicines',
      label: 'Medicines Searched',
      value: 5870,
      change: -2.1,
      color: '#0F172A',
      bg: '#F8FAFC',
    },
  ]

  /* ---------------- FETCH / INIT ---------------- */
  useEffect(() => {
    // Simulate backend call
    setTimeout(() => {
      setData(stats && stats.length ? stats : fallback)
      setLoading(false)
    }, 600)
  }, [stats])

  /* ---------------- ANIMATED COUNTER ---------------- */
  const AnimatedNumber = ({ value }) => {
    const [display, setDisplay] = useState(0)

    useEffect(() => {
      let start = 0
      const duration = 800
      const step = Math.max(1, Math.floor(value / (duration / 16)))

      const timer = setInterval(() => {
        start += step
        if (start >= value) {
          start = value
          clearInterval(timer)
        }
        setDisplay(start)
      }, 16)

      return () => clearInterval(timer)
    }, [value])

    return <span>{display.toLocaleString()}</span>
  }

  /* ---------------- ICONS ---------------- */
  const Icon = ({ color }) => (
    <svg
      className="h-6 w-6"
      style={{ color }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13h2l2 3 4-8 3 6 4-6 3 4v3H3v-2z"
      />
    </svg>
  )

  /* ---------------- RENDER ---------------- */
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-8 bg-slate-200 rounded w-1/3 mt-3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map(item => (
        <div
          key={item.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div>
              <div className="text-sm text-slate-600">
                {item.label}
              </div>

              <div
                className="mt-2 text-2xl font-semibold"
                style={{ color: item.color }}
              >
                <AnimatedNumber value={item.value} />
              </div>

              {/* TREND */}
              <div className="mt-1 text-xs flex items-center gap-1">
                {item.change >= 0 ? (
                  <span className="text-emerald-600">▲</span>
                ) : (
                  <span className="text-rose-600">▼</span>
                )}
                <span
                  className={
                    item.change >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }
                >
                  {Math.abs(item.change)}%
                </span>
                <span className="text-slate-400">
                  vs last week
                </span>
              </div>
            </div>

            {/* RIGHT ICON */}
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ background: item.bg }}
            >
              <Icon color={item.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
