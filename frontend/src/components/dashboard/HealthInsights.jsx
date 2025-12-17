import React from 'react'

export default function HealthInsights({ insights = [] }) {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-lg font-semibold text-slate-900">Key AI Insights</h4>
        <p className="text-sm text-slate-600">Automated health insights based on recent activity.</p>
      </div>

      <div className="grid gap-3">
        {insights.length === 0 ? (
          <div className="text-sm text-slate-500">No insights yet</div>
        ) : (
          insights.map(i => (
            <div key={i.id} className="p-3 bg-white border rounded-lg shadow-sm">
              <div className="font-medium text-slate-900">{i.title}</div>
              <div className="text-sm text-slate-600 mt-1">{i.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
