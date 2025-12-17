import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirm)
      return setError('All fields are required')

    if (password !== confirm)
      return setError('Passwords do not match')

    if (!agree)
      return setError('Please accept the terms to continue')

    try {
      setLoading(true)
      const res = await api.post('/auth/register', { name, email, password })
      await login(res)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <style>{`
        .auth-root{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            radial-gradient(600px 400px at 10% 10%, rgba(59,130,246,.18), transparent),
            radial-gradient(600px 400px at 90% 90%, rgba(16,185,129,.18), transparent),
            linear-gradient(180deg,#F8FAFC,#EEF2FF);
          font-family:Inter,system-ui,sans-serif;
          padding:2rem;
          position:relative;
          overflow:hidden;
        }

        .orb{
          position:absolute;
          width:260px;
          height:260px;
          border-radius:50%;
          filter:blur(80px);
          opacity:.4;
          animation: float 12s infinite ease-in-out;
        }
        .orb.blue{ background:#3B82F6; top:-80px; left:-80px }
        .orb.green{ background:#10B981; bottom:-80px; right:-80px }

        @keyframes float{
          0%,100%{ transform:translateY(0) }
          50%{ transform:translateY(30px) }
        }

        .auth-card{
          width:100%;
          max-width:560px;
          background:rgba(255,255,255,.78);
          backdrop-filter: blur(14px);
          border-radius:22px;
          padding:2.6rem;
          border:1px solid rgba(255,255,255,.6);
          box-shadow:
            0 30px 70px rgba(15,23,42,.15),
            inset 0 1px 0 rgba(255,255,255,.6);
          position:relative;
          z-index:2;
        }

        .brand{
          display:flex;
          align-items:center;
          gap:1rem;
        }

        .logo{
          width:54px;
          height:54px;
          border-radius:14px;
          background:linear-gradient(135deg,#2563EB,#10B981);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:900;
          font-size:1.1rem;
          box-shadow:0 12px 30px rgba(16,185,129,.45);
        }

        .title{
          font-size:1.7rem;
          font-weight:900;
          color:#0F172A;
        }

        .subtitle{
          font-size:.95rem;
          color:#475569;
          margin-top:.15rem;
        }

        .form{
          margin-top:2rem;
          display:flex;
          flex-direction:column;
          gap:1rem;
        }

        .input-wrap{ position:relative }

        .input{
          width:100%;
          padding:1rem;
          border-radius:.9rem;
          border:1px solid #E5E7EB;
          font-size:.95rem;
          background:rgba(255,255,255,.9);
          transition:.2s;
        }

        .input:focus{
          outline:none;
          border-color:#3B82F6;
          box-shadow:0 0 0 4px rgba(59,130,246,.18);
        }

        .toggle{
          position:absolute;
          right:14px;
          top:50%;
          transform:translateY(-50%);
          border:none;
          background:none;
          font-size:.75rem;
          font-weight:800;
          color:#2563EB;
          cursor:pointer;
        }

        .checkbox{
          display:flex;
          gap:.6rem;
          align-items:center;
          font-size:.88rem;
          color:#475569;
        }

        .error{
          background:rgba(239,68,68,.1);
          color:#991B1B;
          border:1px solid rgba(239,68,68,.25);
          padding:.7rem .9rem;
          border-radius:.7rem;
          font-size:.9rem;
        }

        .btn{
          margin-top:.6rem;
          padding:1rem;
          border-radius:1rem;
          border:none;
          font-weight:800;
          font-size:.95rem;
          color:#fff;
          background:linear-gradient(90deg,#2563EB,#10B981);
          cursor:pointer;
          box-shadow:0 18px 40px rgba(16,185,129,.35);
          transition:.2s;
        }

        .btn:hover{ transform:translateY(-2px) }
        .btn:disabled{ opacity:.6; cursor:not-allowed }

        .divider{
          margin:1.6rem 0;
          text-align:center;
          font-size:.75rem;
          letter-spacing:.08em;
          color:#94A3B8;
          text-transform:uppercase;
        }

        .footer{
          margin-top:1.2rem;
          text-align:center;
          font-size:.9rem;
          color:#475569;
        }

        .link{
          color:#2563EB;
          font-weight:700;
          text-decoration:none;
        }
      `}</style>

      <div className="orb blue" />
      <div className="orb green" />

      <div className="auth-card">
        <div className="brand">
          <div className="logo">PI</div>
          <div>
            <div className="title">Create your PharmaIntel account</div>
            <div className="subtitle">
              Start exploring AI-powered pharma intelligence
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="form">
          {error && <div className="error">{error}</div>}

          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={e=>setName(e.target.value)}
          />

          <input
            className="input"
            type="email"
            placeholder="Work email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <div className="input-wrap">
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
            <button type="button" className="toggle" onClick={()=>setShowPassword(!showPassword)}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          <div className="input-wrap">
            <input
              className="input"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirm}
              onChange={e=>setConfirm(e.target.value)}
            />
            <button type="button" className="toggle" onClick={()=>setShowConfirm(!showConfirm)}>
              {showConfirm ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={agree}
              onChange={e=>setAgree(e.target.checked)}
            />
            I agree to the <Link className="link">Terms</Link> & <Link className="link">Privacy</Link>
          </label>

          <button className="btn" disabled={loading}>
            {loading ? 'Creating secure account…' : 'Create account'}
          </button>
        </form>

        <div className="divider">Secure pharma onboarding</div>

        <div className="footer">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
