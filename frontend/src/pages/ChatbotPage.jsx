import React from 'react'
import ChatWindow from '../components/chatbot/ChatWindow'

export default function ChatbotPage() {
  return (
    <div className="chatbot-root">
      {/* ============ INLINE CSS ============ */}
      <style>{`
        .chatbot-root {
          max-width: 1280px;
          margin: 0 auto;
          padding: 7rem 1.5rem 4rem;
          font-family: Inter, system-ui, sans-serif;
          background: #F8FAFC;
          min-height: 100vh;
        }

        .chatbot-header {
          margin-bottom: 1.5rem;
        }

        .chatbot-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0F172A;
        }

        .chatbot-sub {
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: #475569;
          max-width: 46rem;
        }

        .chatbot-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
        }

        .chatbot-disclaimer {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: #FEFCE8;
          border: 1px solid #FACC15;
          font-size: 0.85rem;
          color: #713F12;
        }

        @media (max-width: 640px) {
          .chatbot-root {
            padding-top: 6rem;
          }
        }
      `}</style>

      {/* ============ HEADER ============ */}
      <div className="chatbot-header">
        <h2 className="chatbot-title">Medical Chatbot</h2>
        <p className="chatbot-sub">
          Ask questions related to medicines, dosage, side effects, interactions,
          and general pharmaceutical concepts. Responses are AI-generated for
          educational purposes.
        </p>
      </div>

      {/* ============ CHAT WINDOW ============ */}
      <div className="chatbot-card">
        <ChatWindow />
      </div>

      {/* ============ DISCLAIMER ============ */}
      <div className="chatbot-disclaimer">
        ⚠️ This AI chatbot is intended for educational and informational use only.
        It does not provide medical diagnosis or replace professional healthcare
        advice.
        <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>
          This information is for educational purposes only and is not medical advice. Please consult a qualified healthcare professional.
        </div>
      </div>
    </div>
  )
}
