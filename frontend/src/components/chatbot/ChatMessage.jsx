import React, { useState } from 'react'
import AIModelBadge from './AIModelBadge'

/**
 * message = {
 *   id,
 *   role: 'user' | 'ai',
 *   text: string,
 *   model?: 'gemini' | 'mistral' | 'gpt' | 'hybrid',
 *   createdAt?: ISOString,
 *   status?: 'thinking' | 'done'
 * }
 */
export default function ChatMessage({ message }) {
  const isAI = message.role === 'ai'
  const [copied, setCopied] = useState(false)

  /* ---------- TIME FORMAT ---------- */
  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /* ---------- COPY ---------- */
  const copyText = () => {
    navigator.clipboard.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  /* ---------- SIMPLE MARKDOWN ---------- */
  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <p key={i} style={{ marginBottom: '0.35rem' }}>
        {line}
      </p>
    ))
  }

  /* ---------- INLINE CSS ---------- */
  const styles = `
    .msg-row {
      display: flex;
      margin-bottom: 0.9rem;
      align-items: flex-end;
      gap: 0.75rem;
      font-family: Inter, system-ui, sans-serif;
    }

    .msg-row.user { justify-content: flex-end; }
    .msg-row.ai { justify-content: flex-start; }

    .avatar {
      flex-shrink: 0;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      box-shadow: 0 4px 10px rgba(2,6,23,0.08);
    }

    .avatar.ai { background: linear-gradient(135deg,#06b6d4,#0ea5e9); }
    .avatar.user { background: linear-gradient(135deg,#334155,#1f2937); }

    .bubble {
      max-width: 78%;
      border-radius: 14px;
      padding: 0.75rem 0.95rem;
      font-size: 0.95rem;
      line-height: 1.4;
      position: relative;
      white-space: pre-wrap;
      box-shadow: 0 6px 18px rgba(14,20,28,0.06);
    }

    .bubble.user {
      background: linear-gradient(180deg,#2563eb,#1e40af);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.06);
      border-bottom-right-radius: 6px;
    }

    .bubble.ai {
      background: linear-gradient(180deg,#ffffff,#f8fafc);
      color: #0f172a;
      border: 1px solid #eef2ff;
    }

    .meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.45rem;
      font-size: 0.72rem;
      color: #6b7280;
      gap: 0.5rem;
    }

    .actions { display: flex; gap: 0.45rem; align-items: center; }

    .copy-btn { border: none; background: transparent; font-size: 0.75rem; cursor: pointer; color: #2563EB; padding: 0; }
    .copy-btn:hover { text-decoration: underline; }

    .thinking { font-style: italic; opacity: 0.7; }

    .disclaimer { margin-top: 0.45rem; font-size: 0.68rem; color: #9aa3b2; }
  `

  return (
    <div className={`msg-row ${isAI ? 'ai' : 'user'}`}>
      <style>{styles}</style>

      {/* AVATAR */}
      <div className={`avatar ${isAI ? 'ai' : 'user'}`} aria-hidden>
        {isAI ? 'AI' : 'U'}
      </div>

      <div className={`bubble ${isAI ? 'ai' : 'user'}`}>
        {/* MESSAGE TEXT */}
        <div className={message.status === 'thinking' ? 'thinking' : ''}>
          {renderText(message.text)}
        </div>

        {/* META */}
        <div className="meta">
          <div className="actions">
            {isAI && message.model && <AIModelBadge model={message.model} />}
            {message.createdAt && <span>{formatTime(message.createdAt)}</span>}
          </div>

          {isAI && (
            <button className="copy-btn" onClick={copyText}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        {/* DISCLAIMER */}
        {isAI && (
          <div className="disclaimer">
            ⚠️ Educational use only. Not medical advice.
          </div>
        )}
      </div>
    </div>
  )
}
