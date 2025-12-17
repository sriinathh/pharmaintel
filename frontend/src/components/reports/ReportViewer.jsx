import React from 'react'

export default function ReportViewer({ report }){
  if(!report) return null
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 report-print">
      <h3 className="text-2xl font-semibold text-slate-900">{report.title}</h3>
      <div className="text-sm text-slate-600 mb-4">{report.date} • {report.category} • <span className="uppercase">{report.language}</span></div>

      <section className="prose lg:prose-lg prose-slate">
        <h4 className="mt-4">Summary</h4>
        <p className="leading-relaxed text-slate-900">{report.content || 'No content available.'}</p>
        <h4 className="mt-4">Findings</h4>
        <ul>
          <li>Check interactions with concurrent therapies.</li>
          <li>Assess dosing adjustments for renal impairment.</li>
        </ul>
        <h4 className="mt-4">Recommendations</h4>
        <ol>
          <li>Use with caution in elderly patients.</li>
          <li>Monitor relevant labs where applicable.</li>
        </ol>
      </section>

      <div className="mt-6 p-4 bg-yellow-50 rounded-md text-sm text-slate-600">Medical-safe disclaimer: This information is for educational purposes only and does not replace clinical judgment.</div>
    </div>
  )
}
