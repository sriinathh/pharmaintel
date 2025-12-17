import React from 'react'
import { Link } from 'react-router-dom'
import aiGif from '../assets/ai.gif'

export default function LandingPage() {

  const stats = [
    { value: '120K+', label: 'AI Queries Processed' },
    { value: '18,000+', label: 'Medicines & Compounds' },
    { value: '12+', label: 'Languages Supported' },
    { value: '98.4%', label: 'Clinical Accuracy Score' }
  ]

  const problems = [
    'Medical information is scattered and hard to verify',
    'Drug interaction risks are often missed',
    'Students struggle to understand complex pharmacology',
    'Language barriers limit healthcare access'
  ]

  const solutions = [
    'AI-powered, structured medical intelligence',
    'Real-time drug interaction & safety analysis',
    'Simple explanations for complex pharma concepts',
    'Multilingual, accessible healthcare guidance'
  ]

  const agents = [
    { icon: '🧠', title: 'Clinical Reasoning Agent', desc: 'Understands symptoms, drug classes, and patient context.' },
    { icon: '🧪', title: 'Drug Interaction Agent', desc: 'Detects interactions, contraindications, and safety risks.' },
    { icon: '📊', title: 'Report Generator Agent', desc: 'Generates structured, readable, clinical-safe reports.' },
    { icon: '🌍', title: 'Language Intelligence Agent', desc: 'Explains medicines in regional and global languages.' }
  ]

  const features = [
    { icon: '📄', title: 'AI Medical Reports', desc: 'Generate clinical-safe reports for drugs, dosage, and interactions.' },
    { icon: '🤖', title: 'Pharma AI Chatbot', desc: 'Ask pharmacy-related questions with educational AI responses.' },
    { icon: '💊', title: 'Nearby Pharmacy Intelligence', desc: 'Find medicine availability and alternatives nearby.' },
    { icon: '🔒', title: 'Privacy & Security', desc: 'Built with privacy-first, healthcare-safe design principles.' },
    { icon: '🌐', title: 'Multilingual Support', desc: 'Understand medicines in local and international languages.' },
    { icon: '⚡', title: 'Fast & Reliable', desc: 'Optimized AI pipelines for quick, accurate responses.' }
  ]

  const audience = [
    { icon: '🎓', title: 'Pharmacy Students', desc: 'Learn medicines faster with simplified AI explanations.' },
    { icon: '🏥', title: 'Healthcare Professionals', desc: 'Quick reference & clinical decision support.' },
    { icon: '💊', title: 'Retail Pharmacies', desc: 'Check availability, alternatives, and drug details.' },
    { icon: '📚', title: 'Researchers', desc: 'Summarized insights from medical and clinical data.' }
  ]

  return (
    <div className="landing-root">
      <style>{`
        .landing-root{
          background:
            radial-gradient(900px 500px at 10% -10%, rgba(37,99,235,.15), transparent),
            radial-gradient(900px 500px at 90% 20%, rgba(16,185,129,.15), transparent),
            linear-gradient(180deg,#F8FAFC,#FFFFFF);
          font-family: Inter, system-ui, sans-serif;
          color:#0F172A;
          padding:1.5rem 1.25rem 5rem;
        }

        .container{ max-width:1200px; margin:0 auto; }

        h1,h2,h3{ margin:0; font-weight:900; }
        p{ color:#475569; line-height:1.7; }

        /* HERO */
        .hero{
          display:grid;
          grid-template-columns:1fr;
          gap:3rem;
          align-items:center;
          padding:3rem 0;
        }
        @media(min-width:992px){
          .hero{ grid-template-columns:1.1fr .9fr; }
        }

        .hero-title{
          font-size:2.8rem;
          line-height:1.05;
        }
        @media(min-width:768px){
          .hero-title{ font-size:3.6rem; }
        }

        .hero-sub{
          margin-top:1.4rem;
          max-width:45rem;
          font-size:1.1rem;
        }

        .badges{
          margin-top:1.6rem;
          display:flex;
          gap:.6rem;
          flex-wrap:wrap;
        }

        .badge{
          background:rgba(37,99,235,.1);
          color:#1E3A8A;
          padding:.45rem .75rem;
          border-radius:999px;
          font-size:.85rem;
          font-weight:700;
        }

        .cta-group{
          margin-top:2rem;
          display:flex;
          gap:1rem;
          flex-wrap:wrap;
        }

        .btn{
          padding:.85rem 1.6rem;
          border-radius:1rem;
          font-weight:800;
          text-decoration:none;
          font-size:.95rem;
          transition:.2s;
        }

        .btn-primary{
          background:linear-gradient(90deg,#2563EB,#10B981);
          color:#fff;
          box-shadow:0 18px 40px rgba(16,185,129,.3);
        }
        .btn-primary:hover{ transform:translateY(-3px); }

        .btn-secondary{
          background:#fff;
          color:#2563EB;
          border:1px solid rgba(37,99,235,.2);
        }

        .hero-visual{
          background:#fff;
          border-radius:1.4rem;
          padding:1.2rem;
          box-shadow:0 28px 70px rgba(2,6,23,.1);
        }

        .hero-visual img{
          width:100%;
          height:420px;
          object-fit:cover;
          border-radius:1rem;
        }

        /* STATS */
        .stats{
          margin-top:4rem;
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:1.2rem;
          text-align:center;
        }
        @media(min-width:768px){
          .stats{ grid-template-columns:repeat(4,1fr); }
        }

        .stat-card{
          background:#fff;
          border-radius:1.2rem;
          padding:1.6rem;
          box-shadow:0 14px 36px rgba(2,6,23,.05);
        }

        .stat-value{
          font-size:2rem;
          font-weight:900;
          color:#2563EB;
        }

        /* SECTIONS */
        .section{ margin-top:6rem; }
        .section-title{
          text-align:center;
          font-size:2.3rem;
          margin-bottom:2.4rem;
        }

        .grid{
          display:grid;
          grid-template-columns:1fr;
          gap:1.4rem;
        }
        @media(min-width:768px){
          .grid{ grid-template-columns:repeat(4,1fr); }
        }

        .card{
          background:#fff;
          border-radius:1.2rem;
          padding:1.8rem;
          box-shadow:0 16px 40px rgba(2,6,23,.06);
          transition:.2s;
        }

        .card:hover{ transform:translateY(-8px); }

        .icon{
          font-size:2.2rem;
          margin-bottom:.8rem;
        }

        /* PROBLEM / SOLUTION */
        .split{
          display:grid;
          grid-template-columns:1fr;
          gap:2rem;
        }
        @media(min-width:768px){
          .split{ grid-template-columns:1fr 1fr; }
        }

        .list-item{
          display:flex;
          gap:.6rem;
          margin-bottom:.8rem;
        }

        /* FINAL CTA */
        .final-cta{
          margin-top:7rem;
          background:linear-gradient(135deg,#2563EB,#10B981);
          border-radius:2rem;
          padding:3.5rem 2rem;
          text-align:center;
          color:#fff;
        }

        .final-cta p{
          color:#E0F2FE;
          max-width:680px;
          margin:1.2rem auto 0;
          font-size:1.05rem;
        }
      `}</style>

      <div className="container">

        {/* HERO */}
        <section className="hero">
          <div>
            <h1 className="hero-title">
              PharmaIntel AI  
              <br />Clinical Intelligence for the Future of Pharmacy
            </h1>

            <p className="hero-sub">
              PharmaIntel AI is an advanced healthcare intelligence platform designed to help
              pharmacy students, professionals, and researchers understand medicines, analyze
              drug safety, and generate clinical-grade insights using AI.
            </p>

            <div className="badges">
              <span className="badge">Clinical-Safe AI</span>
              <span className="badge">Multi-Agent System</span>
              <span className="badge">Healthcare Focused</span>
              <span className="badge">Privacy-First</span>
            </div>

            <div className="cta-group">
              <Link to="/register" className="btn btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn btn-secondary">Explore Dashboard</Link>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src={aiGif}
              alt="PharmaIntel AI animated illustration"
            />
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          {stats.map((s,i)=>(
            <div key={i} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <p>{s.label}</p>
            </div>
          ))}
        </section>

        {/* PROBLEM & SOLUTION */}
        <section className="section">
          <h2 className="section-title">Why PharmaIntel AI?</h2>
          <div className="split">
            <div className="card">
              <h3>❌ The Problem</h3>
              {problems.map((p,i)=>(
                <div key={i} className="list-item">• {p}</div>
              ))}
            </div>
            <div className="card">
              <h3>✅ Our Solution</h3>
              {solutions.map((s,i)=>(
                <div key={i} className="list-item">• {s}</div>
              ))}
            </div>
          </div>
        </section>

        {/* AGENTS */}
        <section className="section">
          <h2 className="section-title">Multi-Agent AI Architecture</h2>
          <div className="grid">
            {agents.map((a,i)=>(
              <div key={i} className="card">
                <div className="icon">{a.icon}</div>
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <h2 className="section-title">Platform Capabilities</h2>
          <div className="grid">
            {features.map((f,i)=>(
              <div key={i} className="card">
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="section">
          <h2 className="section-title">Built For Everyone in Pharmacy</h2>
          <div className="grid">
            {audience.map((u,i)=>(
              <div key={i} className="card">
                <div className="icon">{u.icon}</div>
                <h3>{u.title}</h3>
                <p>{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <h2>Start Your Pharma Intelligence Journey Today</h2>
          <p>
            PharmaIntel AI empowers learning, supports safer decisions,
            and brings intelligence to pharmaceutical education and practice.
          </p>
          <div style={{marginTop:'2rem'}}>
            <Link to="/register" className="btn btn-secondary">Create Free Account</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
