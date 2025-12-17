import React from 'react'

export default function ChatHeader(){
  return (
    <div className="medical-chat-header">
      <div className="header-left">
        <div className="brand">InterPharma Medical Assistant</div>
        <div className="subtitle">Clinical & pharmacy-focused assistant — educational use only</div>
      </div>
      <div className="header-right">
        <div className="status-dot" title="Live">●</div>
      </div>
    </div>
  )
}
