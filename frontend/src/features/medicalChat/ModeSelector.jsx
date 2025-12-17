import React from 'react'

const MODES = [
  { key: 'Student', hint: 'Pharmacy student level explanations' },
  { key: 'Pharmacist', hint: 'Professional, concise guidance' },
  { key: 'Patient-Friendly', hint: 'Simple language for patients' }
]

export default function ModeSelector({ value, onChange }){
  return (
    <div className="mode-selector">
      <div className="label">Mode</div>
      {MODES.map(m=> (
        <div key={m.key} className={`mode-row ${m.key===value ? 'active':''}`} onClick={()=>onChange(m.key)}>
          <div className="mode-name">{m.key}</div>
          <div className="mode-hint">{m.hint}</div>
        </div>
      ))}
    </div>
  )
}
