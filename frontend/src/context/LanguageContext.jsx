import React, { createContext, useState, useContext, useEffect } from 'react'
import i18n from '../i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(i18n.language || 'en')

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguageContext() {
  return useContext(LanguageContext)
}
