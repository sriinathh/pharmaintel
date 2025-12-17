import React from 'react'

export default function Footer() {
  return (
    <footer className="footer-root">
      {/* ============ INLINE CSS ============ */}
      <style>{`
        .footer-root {
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
          margin-top: 4rem;
          font-family: Inter, system-ui, sans-serif;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .footer-brand h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0F172A;
        }

        .footer-brand p {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #475569;
          max-width: 22rem;
          line-height: 1.6;
        }

        .footer-section h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 0.75rem;
        }

        .footer-link {
          display: block;
          font-size: 0.85rem;
          color: #475569;
          text-decoration: none;
          margin-bottom: 0.5rem;
          transition: color 0.15s ease;
        }

        .footer-link:hover {
          color: #2563EB;
        }

        .footer-bottom {
          border-top: 1px solid #E2E8F0;
          margin-top: 2rem;
          padding-top: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }

        .footer-copy {
          font-size: 0.85rem;
          color: #475569;
        }

        .footer-note {
          font-size: 0.75rem;
          color: #64748B;
        }
      `}</style>

      {/* ============ FOOTER CONTENT ============ */}
      <div className="footer-container">

        {/* TOP GRID */}
        <div className="footer-grid">

          {/* BRAND */}
          <div className="footer-brand">
            <h3>PharmaIntel AI</h3>
            <p>
              An AI-powered pharmaceutical intelligence platform designed to
              support pharmacy students and healthcare professionals with
              clinical-grade insights.
            </p>
          </div>

          {/* PLATFORM */}
          <div className="footer-section">
            <h4>Platform</h4>
            <a href="/dashboard" className="footer-link">Dashboard</a>
            <a href="/chat" className="footer-link">AI Chatbot</a>
            <a href="/reports" className="footer-link">Clinical Reports</a>
            <a href="/profile" className="footer-link">Profile</a>
          </div>

          {/* RESOURCES */}
          <div className="footer-section">
            <h4>Resources</h4>
            <a href="#" className="footer-link">Documentation</a>
            <a href="#" className="footer-link">API Reference</a>
            <a href="#" className="footer-link">FAQs</a>
            <a href="#" className="footer-link">Support</a>
          </div>

          {/* LEGAL */}
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Disclaimer</a>
            <a href="#" className="footer-link">Compliance</a>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} PharmaIntel AI. All rights reserved.
          </div>
          <div className="footer-note">
            For educational purposes only. Not a substitute for professional
            medical advice.
          </div>
        </div>

      </div>
    </footer>
  )
}
