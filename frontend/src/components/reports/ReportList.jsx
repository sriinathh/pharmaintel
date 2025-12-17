import React, { useState } from 'react'
import ReportViewer from './ReportViewer'
import ExportPDF from './ExportPDF'

export default function ReportList({ reports=[] }){
  const [active, setActive] = useState(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="space-y-3">
          {reports.map(r => (
            <div key={r.id} onClick={()=>setActive(r)} className={`bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md cursor-pointer`}> 
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{r.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{r.date} • {r.category}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">{r.language?.toUpperCase() || 'EN'}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="btn-secondary text-sm">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2">
        {active ? (
          <div>
            <ReportViewer report={active} />
            <div className="mt-4"><ExportPDF report={active} /></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E2E8F0] text-[#475569]">Select a report to view details.</div>
        )}
      </div>
    </div>
  )
}
