import React, { useState, useEffect, useRef } from 'react'

export default function ChatInput({ onSend, disabled }){
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(()=>{ if (!disabled) inputRef.current?.focus() }, [disabled])

  const submit = (e) => {
    if (e) e.preventDefault()
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      submit(e)
    }
  }

  return (
    <form className="chat-input" onSubmit={submit}>
      <textarea ref={inputRef} value={text} onChange={e=>setText(e.target.value)} onKeyDown={onKey} placeholder="Ask about drugs, interactions, counseling… (Press Enter to send)" disabled={disabled} rows={1} />
      <button type="submit" disabled={disabled || !text.trim()} className={`send-btn ${disabled ? 'disabled' : ''}`}>
        {disabled ? 'Waiting…' : 'Send'}
      </button>
    </form>
  )
}
