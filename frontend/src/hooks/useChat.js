import { useState } from 'react'
import * as aiService from '../services/ai.service'

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeModel, setActiveModel] = useState('mistral')

  const sendMessage = async (text) => {
    const userMsg = { id: Date.now() + '-u', role: 'user', text }
    setMessages((m) => [...m, userMsg])

    setIsTyping(true)
    const aiResp = await aiService.queryAI(text, activeModel)
    setMessages((m) => [...m, { id: Date.now() + '-ai', role: 'ai', text: aiResp.text, model: aiResp.model }])
    setIsTyping(false)
  }

  return { messages, sendMessage, isTyping, activeModel, setActiveModel }
}
