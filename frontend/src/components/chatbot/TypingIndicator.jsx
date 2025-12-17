import React from 'react'

/**
 * TypingIndicator
 * Shows AI typing animation while model is responding
 */
export default function TypingIndicator() {
  return (
    <div className="typing-row" aria-live="polite">
      {/* ============ INLINE CSS ============ */}
      <style>{`
        .typing-row {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 0.75rem;
          font-family: Inter, system-ui, sans-serif;
        }

        .typing-bubble {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 0.65rem 0.9rem;
          box-shadow: 0 2px 6px rgba(15,23,42,0.06);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .avatar {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563EB, #0EA5E9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .dots {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .dot {
          height: 6px;
          width: 6px;
          border-radius: 50%;
          background: #2563EB;
          animation: wave 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes wave {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .label {
          font-size: 0.7rem;
          color: #64748B;
          margin-left: 0.25rem;
          white-space: nowrap;
        }
      `}</style>

      {/* ============ BUBBLE ============ */}
      <div className="typing-bubble">
        <div className="avatar">AI</div>

        <div className="dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <span className="label">AI is typing…</span>
      </div>
    </div>
  )
}
