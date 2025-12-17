import React, { useEffect, useRef, useState } from 'react'

/**
 * ChatInput
 *
 * Props:
 *  - onSend(message)
 *  - disabled (boolean) → when AI is responding
 */
export default function ChatInput({ onSend, disabled = false }) {
  const [text, setText] = useState('')
  const [chars, setChars] = useState(0)
  const textareaRef = useRef(null)

  const MAX_CHARS = 1000

  /* ---------- AUTO RESIZE ---------- */
  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 160) + 'px'
  }, [text])

  /* ---------- SUBMIT ---------- */
  const submit = (e) => {
    e && e.preventDefault()
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
    setChars(0)
  }

  /* ---------- KEY HANDLING ---------- */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  /* ---------- QUICK PROMPTS ---------- */
  const suggestions = [
    'What are the side effects of metformin?',
    'Drug interaction between aspirin and warfarin',
    'Pediatric dosage for amoxicillin',
    'Can this medicine be taken during pregnancy?',
  ]

  /* ---------- INLINE CSS ---------- */
  const styles = `
    .chat-input-root {
      border-top: 1px solid #E2E8F0;
      padding: 0.75rem;
      background: #FFFFFF;
      font-family: Inter, system-ui, sans-serif;
    }

    .input-box {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .textarea {
      flex: 1;
      resize: none;
      border-radius: 0.75rem;
      border: 1px solid #CBD5E1;
      padding: 0.6rem 0.75rem;
      font-size: 0.9rem;
      line-height: 1.4;
      outline: none;
    }

    .textarea:focus {
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
    }

    .send-btn {
      background: #2563EB;
      color: #FFFFFF;
      border: none;
      border-radius: 0.75rem;
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
      height: fit-content;
    }

    .send-btn:disabled {
      background: #94A3B8;
      cursor: not-allowed;
    }

    .send-btn:hover:not(:disabled) {
      background: #1E40AF;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      margin-top: 0.35rem;
      font-size: 0.7rem;
      color: #64748B;
    }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.5rem;
    }

    .suggestion {
      background: #F1F5F9;
      border: 1px solid #E2E8F0;
      padding: 0.25rem 0.6rem;
      font-size: 0.7rem;
      border-radius: 999px;
      cursor: pointer;
    }

    .suggestion:hover {
      background: #E0E7FF;
      border-color: #C7D2FE;
      color: #2563EB;
    }

    .disclaimer {
      margin-top: 0.4rem;
      font-size: 0.65rem;
      color: #94A3B8;
    }
  `

  return (
    <div className="chat-input-root">
      <style>{styles}</style>

      {/* QUICK PROMPTS */}
      {text.length === 0 && !disabled && (
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="suggestion"
              onClick={() => {
                setText(s)
                setChars(s.length)
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <form onSubmit={submit}>
        <div className="input-box">
          <textarea
            ref={textareaRef}
            className="textarea"
            placeholder="Ask PharmaIntel AI about medicines, interactions, dosage, or clinical guidance…"
            value={text}
            maxLength={MAX_CHARS}
            disabled={disabled}
            onChange={(e) => {
              setText(e.target.value)
              setChars(e.target.value.length)
            }}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <button
            type="submit"
            className="send-btn"
            disabled={disabled || !text.trim()}
          >
            {disabled ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </form>

      {/* META */}
      <div className="meta">
        <span>
          Press <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for new line
        </span>
        <span>
          {chars}/{MAX_CHARS}
        </span>
      </div>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        ⚠️ AI responses are for educational purposes only and not a substitute for professional medical advice.
      </div>
    </div>
  )
}
