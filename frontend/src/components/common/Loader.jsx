import React from 'react'

/**
 * Loader Component
 *
 * Props:
 *  - variant: "page" | "inline" | "fullscreen"
 *  - label: string (optional)
 */
export default function Loader({
  variant = 'page',
  label = 'Loading, please wait…',
}) {
  return (
    <div className={`loader-root ${variant}`}>
      {/* ============ INLINE CSS ============ */}
      <style>{`
        .loader-root {
          font-family: Inter, system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F172A;
        }

        /* ---------- VARIANTS ---------- */
        .loader-root.page {
          padding: 4rem 0;
        }

        .loader-root.inline {
          padding: 1rem 0;
        }

        .loader-root.fullscreen {
          position: fixed;
          inset: 0;
          background: rgba(248, 250, 252, 0.95);
          z-index: 9999;
        }

        /* ---------- CARD ---------- */
        .loader-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 2rem 2.5rem;
          box-shadow: 0 10px 30px rgba(15,23,42,0.08);
          text-align: center;
          min-width: 220px;
        }

        /* ---------- SPINNER ---------- */
        .spinner {
          width: 56px;
          height: 56px;
          margin: 0 auto;
          border-radius: 50%;
          border: 4px solid #E2E8F0;
          border-top-color: #2563EB;
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ---------- PULSE DOTS ---------- */
        .dots {
          display: flex;
          justify-content: center;
          gap: 0.35rem;
          margin-top: 1rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2563EB;
          animation: pulse 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes pulse {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }

        /* ---------- TEXT ---------- */
        .label {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .hint {
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #94A3B8;
        }
      `}</style>

      {/* ============ LOADER CARD ============ */}
      <div className="loader-card" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true"></div>

        <div className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="label">{label}</div>
        <div className="hint">PharmaIntel AI is processing securely</div>
      </div>
    </div>
  )
}
