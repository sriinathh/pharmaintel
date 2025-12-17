import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDrug, getSubstitutes, checkInteractions } from '../services/drug.service'

export default function DrugProfile(){
  const { id } = useParams()
  const [drug, setDrug] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subs, setSubs] = useState(null)
  const [otherDrugs, setOtherDrugs] = useState('')
  const [interactRes, setInteractRes] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      setLoading(true)
      const d = await getDrug(id)
      if (!mounted) return
      setDrug(d)
      setLoading(false)
    }
    load()
    return ()=> mounted = false
  }, [id])

  const loadSubs = async () => {
    if (!drug) return
    const r = await getSubstitutes(drug._id)
    setSubs(r)
  }

  const doInteractions = async () => {
    const parts = otherDrugs.split(',').map(s=>s.trim()).filter(Boolean)
    if (parts.length < 1) return alert('Enter drugs to check')
    const r = await checkInteractions([...(drug ? [drug.genericName] : []), ...parts])
    setInteractRes(r)
  }

  if (loading) return <div>Loading…</div>
  if (!drug) return <div>Not found</div>

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{drug.genericName}</h2>
          <div className="text-sm text-slate-600">{drug.drugClass} • {drug.schedule}</div>
        </div>
        {drug.highRisk && <div className="px-3 py-1 rounded-full bg-red-50 text-red-700">High-risk</div>}
      </div>

      <div className="mt-4 card">
        <h3 className="font-semibold">Brand Names & Price</h3>
        <table className="w-full mt-2">
          <tbody>
            {drug.brandNames.map((b,i)=>(
              <tr key={i}>
                <td className="py-2">{b.name}</td>
                <td className="py-2 text-right">{b.manufacturer}</td>
                <td className="py-2 text-right">₹{b.price}</td>
                <td className="py-2 text-right">{b.availability ? 'In stock' : 'Out of stock'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="card">
          <h3 className="font-semibold">Indications</h3>
          <ul>{drug.indications.map((i,idx)=>(<li key={idx}>{i}</li>))}</ul>
        </div>

        <div className="card">
          <h3 className="font-semibold">Dosage forms & strengths</h3>
          <div>{drug.dosageForms.join(', ')} • {drug.strengths.join(', ')}</div>
        </div>

        <div className="card">
          <h3 className="font-semibold">Safety & Storage</h3>
          <div>Storage: {drug.storage}</div>
          <div className="mt-2">Pregnancy: {drug.pregnancy}</div>
          <div className="mt-2">Side effects: {drug.sideEffects.join(', ')}</div>
        </div>
      </div>

      <div className="mt-4 card">
        <h3 className="font-semibold">Substitutes & Alternatives</h3>
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={loadSubs}>Load substitutes</button>
        </div>
        {subs && (
          <div className="mt-3">
            <div><strong>Same generic (other brands)</strong></div>
            {subs.sameGeneric?.map(sg=>(<div key={sg._id}>{sg.genericName} — Brands: {sg.brandNames.map(b=>b.name).join(', ')}</div>))}
            <div className="mt-2"><strong>Same class alternatives</strong></div>
            {subs.sameClass?.map(sc=>(<div key={sc._id}>{sc.genericName} — {sc.drugClass}</div>))}
          </div>
        )}
      </div>

      <div className="mt-4 card">
        <h3 className="font-semibold">Interaction checker</h3>
        <div className="mt-2">Enter comma-separated drug names to check against this drug (e.g., aspirin, metformin)</div>
        <div style={{ marginTop: 8 }}>
          <input className="input" placeholder="Other drugs" value={otherDrugs} onChange={(e)=>setOtherDrugs(e.target.value)} />
          <div style={{ marginTop: 8 }}>
            <button className="btn" onClick={doInteractions}>Check interactions</button>
          </div>
        </div>

        {interactRes && (
          <div className="mt-3">
            {interactRes.interactions?.length ? (
              interactRes.interactions.map((it,idx)=>(
                <div key={idx} className={`p-3 rounded mb-2 ${it.severity==='Severe' ? 'bg-red-50 text-red-700' : it.severity==='Moderate' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                  <div className="font-semibold">{it.severity} — {it.interaction}</div>
                  <div className="mt-1">{it.advice}</div>
                </div>
              ))
            ) : (
              <div className="text-slate-600">{interactRes.message || 'No interactions found'}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
