import React, { useState, useEffect, useRef, useCallback } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import ModeSelector from './ModeSelector'
import './medicalChat.css'
import * as medicalApi from './medicalApi'

export default function MedicalChatPage(){
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState('Student')
  const endRef = useRef(null)

  const scrollToEnd = useCallback(() => {
    try { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) } catch(e){}
  }, [])

  useEffect(()=>{ scrollToEnd() }, [messages, isTyping, scrollToEnd])

  const send = async (text) => {
    const userMsg = { id: Date.now() + '-u', role: 'user', text, time: new Date().toISOString() }
    setMessages(m=>[...m,userMsg])
    setIsTyping(true)
    try{
      const resp = await medicalApi.postMedicalChat({ message: text, mode })
      // normalize backend response into message object
      const aiMsg = { id: Date.now()+'-ai', role: 'ai', time: new Date().toISOString() }
      if (resp && resp.structured) {
        aiMsg.overview = resp.overview || ''
        aiMsg.keyPoints = resp.keyPoints || resp.key_points || ''
        aiMsg.safety = resp.safety || resp.safetyNotes || ''
        aiMsg.counseling = resp.counseling || resp.counselingTips || ''
        aiMsg.refer = resp.refer || resp.referToDoctor || ''
      } else if (resp && resp.text) {
        aiMsg.text = resp.text
      } else {
        aiMsg.text = 'No response from AI.'
      }
      setMessages(m=>[...m, aiMsg])
    }catch(e){
      setMessages(m=>[...m, { id: Date.now()+'-ai', role: 'ai', text: 'Service unavailable. Try again later.', time: new Date().toISOString() }])
    }finally{
      setIsTyping(false)
    }
  }

  return (
    <div className="medical-chat-root">
      <ChatHeader />

      <div className="medical-chat-main">
        <aside className="medical-chat-side">
          <ModeSelector value={mode} onChange={setMode} />
          <div className="safety-badge">Educational Use Only — Not Medical Advice</div>
        </aside>

        <section className="medical-chat-area">
          <ChatMessages messages={messages} isTyping={isTyping} />
          <div ref={endRef} />
          <ChatInput onSend={send} disabled={isTyping} />
        </section>
      </div>
    </div>
  )
}
