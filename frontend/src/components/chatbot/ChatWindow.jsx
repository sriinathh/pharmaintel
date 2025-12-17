import React, { useEffect, useRef } from 'react'
import useChat from '../../hooks/useChat'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import AIModelBadge from './AIModelBadge'

export default function ChatWindow() {
  const { messages, sendMessage, isTyping, activeModel, setActiveModel } = useChat()
  const scrollRef = useRef(null)

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  /* ---------- INLINE CSS ---------- */
  const styles = `
    .chat-root {
      display: flex;
      flex-direction: column;
      height: 65vh;
      max-width: 860px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 1rem;
      border: 1px solid #E2E8F0;
      box-shadow: 0 4px 12px rgba(15,23,42,0.06);
      overflow: hidden;
      font-family: Inter, system-ui, sans-serif;
    }

    .chat-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
    }

    .chat-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #0F172A;
    }

    .chat-sub {
      font-size: 0.7rem;
      color: #64748B;
    }

    .chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background: #FBFDFF;
      scroll-behavior: smooth;
    }

    .empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #64748B;
      font-size: 0.85rem;
      padding: 2rem;
    }

    .chat-footer {
      border-top: 1px solid #E2E8F0;
      background: #FFFFFF;
      padding: 0;
    }
  `

  return (
    <div className="chat-root">
      <style>{styles}</style>

      {/* ============ HEADER ============ */}
      <div className="chat-header">
        <div>
          <div className="chat-title">PharmaIntel AI Chat</div>
          <div className="chat-sub">
            Ask about medicines, dosage, interactions & safety
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AIModelBadge model={activeModel || 'hybrid'} size="md" />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <label style={{ fontSize: 12, color: '#64748B' }}>Model</label>
            <select value={activeModel} onChange={(e) => setActiveModel(e.target.value)} style={{ padding: '4px 8px', borderRadius: 6 }}>
              <option value="mistral">Mistral</option>
              <option value="provider">Provider</option>
              <option value="mock">Mock</option>
            </select>
          </div>
          <span className="text-xs text-slate-500">
            {isTyping ? 'Responding…' : 'Online'}
          </span>
        </div>
      </div>

      {/* ============ MESSAGES ============ */}
      <div ref={scrollRef} className="chat-body">
        {messages.length === 0 ? (
          <div className="empty">
            👋 Ask your first question about medicines or clinical guidance.
            <br />
            <br />
            Example:
            <br />
            <strong>“What are the side effects of metformin?”</strong>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))
        )}

        {isTyping && <TypingIndicator />}
      </div>

      {/* ============ INPUT ============ */}
      <div className="chat-footer">
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}
