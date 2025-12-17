import React from 'react'

export default function ExportPDF({ report }){
  const handleExport = () => {
    // UI only: mock
    alert('Export PDF (mock) for: ' + (report?.title || 'report'))
  }

  return (
    <button onClick={handleExport} className="btn-primary">Export PDF</button>
  )
}
