import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please enter email and password')

    try {
      setLoading(true)
      const res = await api.post('/auth/login', { email, password })
      await login(res)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <style>{`
        /* ========== BACKGROUND ========== */
        .auth-root{
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:
            radial-gradient(600px 400px at 10% 10%, rgba(59,130,246,.18), transparent),
            radial-gradient(600px 400px at 90% 90%, rgba(16,185,129,.18), transparent),
            linear-gradient(180deg,#F8FAFC,#EEF2FF);
          font-family: 'Inter', system-ui, sans-serif;
          padding:2rem;
          position:relative;
          overflow:hidden;
        }

        /* floating blur orbs */
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

        /* ========== CARD ========== */
        .auth-card{
          width:100%;
          max-width:460px;
          background:rgba(255,255,255,.75);
          backdrop-filter: blur(14px);
          border-radius:22px;
          padding:2.4rem;
          border:1px solid rgba(255,255,255,.6);
          box-shadow:
            0 30px 70px rgba(15,23,42,.15),
            inset 0 1px 0 rgba(255,255,255,.6);
          position:relative;
          z-index:2;
        }

        /* ========== BRAND ========== */
        .brand{
          display:flex;
          gap:1rem;
          align-items:center;
        }

        .logo{
          width:52px;
          height:52px;
          border-radius:14px;
          background:linear-gradient(135deg,#2563EB,#10B981);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-weight:900;
          font-size:1.1rem;
          box-shadow:0 12px 30px rgba(37,99,235,.45);
        }

        .title{
          font-size:1.6rem;
          font-weight:900;
          color:#0F172A;
        }

        .subtitle{
          font-size:.95rem;
          color:#475569;
          margin-top:.15rem;
        }

        /* ========== FORM ========== */
        .form{
          margin-top:1.8rem;
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
          background:rgba(255,255,255,.85);
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

        .row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          font-size:.85rem;
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

        /* ========== BUTTON ========== */
        .btn{
          margin-top:.5rem;
          padding:1rem;
          border-radius:1rem;
          border:none;
          font-weight:800;
          font-size:.95rem;
          color:white;
          background:linear-gradient(90deg,#2563EB,#10B981);
          cursor:pointer;
          box-shadow:0 18px 40px rgba(16,185,129,.35);
          transition:.2s ease;
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

      {/* Decorative orbs */}
      <div className="orb blue" />
      <div className="orb green" />

      <div className="auth-card">
        <div className="brand">
          <div className="logo">PI</div>
          <div>
            <div className="title">PharmaIntel AI</div>
            <div className="subtitle">
              Secure access to intelligent pharma insights
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="form">
          {error && <div className="error">{error}</div>}

          <input
            className="input"
            type="email"
            placeholder="Work email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <div className="input-wrap">
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          <div className="row">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="link">
              Forgot password?
            </Link>
          </div>

          <button className="btn" disabled={loading}>
            {loading ? 'Authenticating…' : 'Sign in securely'}
          </button>
        </form>

        <div className="divider"></div>

        <div className="footer">
          New to PharmaIntel?{' '}
          <Link to="/register" className="link">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
