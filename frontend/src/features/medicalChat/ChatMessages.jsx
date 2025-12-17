import React from 'react'

function Avatar({ role }){
  if (role === 'user') return <div className="avatar user">U</div>
  return <div className="avatar ai">IP</div>
}

export default function ChatMessages({ messages = [], isTyping }){
  return (
    <div className="chat-messages" role="log" aria-live="polite">
      {messages.map(m=> (
        <div key={m.id} className={`msg ${m.role==='user' ? 'user' : 'ai'}`}>
          <Avatar role={m.role} />
          <div className="bubble-wrap">
            <div className="bubble">
              {m.text && <div className="plain-text">{m.text}</div>}
              {m.overview && (
                <div className="structured">
                  <div className="section"><strong>Overview</strong><div>{m.overview}</div></div>
                  <div className="section"><strong>Key Points</strong><div>{m.keyPoints}</div></div>
                  <div className="section"><strong>Safety Notes</strong><div>{m.safety}</div></div>
                  <div className="section"><strong>Pharmacist Counseling Tips</strong><div>{m.counseling}</div></div>
                  <div className="section"><strong>When to Refer to a Doctor</strong><div>{m.refer}</div></div>
                </div>
              )}
            </div>
            <div className="meta">{m.time ? new Date(m.time).toLocaleString() : ''}</div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="msg ai typing">
          <Avatar role="ai" />
          <div className="bubble-wrap"><div className="bubble typing-dot">InterPharma is typing…</div></div>
        </div>
      )}
    </div>
  )
}
