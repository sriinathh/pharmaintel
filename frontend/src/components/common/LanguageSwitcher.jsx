import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Supported languages
 * You can safely extend this list later
 */
const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', native: 'English' },
  { code: 'hi', label: 'Hindi', short: 'HI', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', short: 'TE', native: 'తెలుగు' },
  { code: 'fr', label: 'French', short: 'FR', native: 'Français' },
]

const STORAGE_KEY = 'pharmaintel_language'

export default function LanguageSwitcher({
  variant = 'dropdown', // 'dropdown' | 'inline'
  showNative = true,
}) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  /* ---------- INITIAL LANGUAGE SETUP ---------- */
  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEY)
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang)
    } else if (!savedLang) {
      // Auto-detect browser language (fallback)
      const browserLang = navigator.language?.slice(0, 2)
      if (LANGUAGES.some(l => l.code === browserLang)) {
        i18n.changeLanguage(browserLang)
        localStorage.setItem(STORAGE_KEY, browserLang)
      }
    }
  }, [i18n])

  /* ---------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ---------- CHANGE LANGUAGE ---------- */
  const changeLang = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem(STORAGE_KEY, code)
    setOpen(false)

    // OPTIONAL: sync with backend later
    // profileService.updateProfile({ language: code })
  }

  const current =
    LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  /* ---------- INLINE STYLE (SELF CONTAINED) ---------- */
  const styles = `
    .lang-root {
      position: relative;
      font-family: Inter, system-ui, sans-serif;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.6rem;
      border-radius: 0.5rem;
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
      font-size: 0.75rem;
      cursor: pointer;
      color: #0F172A;
    }

    .lang-btn:hover {
      background: #F8FAFC;
    }

    .lang-badge {
      font-weight: 600;
      color: #2563EB;
    }

    .dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 0.4rem);
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 0.75rem;
      box-shadow: 0 8px 20px rgba(15,23,42,0.08);
      min-width: 180px;
      z-index: 50;
      overflow: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.6rem 0.8rem;
      font-size: 0.85rem;
      cursor: pointer;
      color: #0F172A;
    }

    .dropdown-item:hover {
      background: #F1F5F9;
    }

    .dropdown-item.active {
      background: #EFF6FF;
      color: #2563EB;
      font-weight: 500;
    }

    .native {
      font-size: 0.75rem;
      color: #64748B;
    }

    .inline {
      display: flex;
      gap: 0.4rem;
    }

    .inline-btn {
      padding: 0.3rem 0.55rem;
      font-size: 0.7rem;
      border-radius: 0.45rem;
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
      cursor: pointer;
      color: #475569;
    }

    .inline-btn.active {
      background: #EFF6FF;
      color: #2563EB;
      border-color: #BFDBFE;
      font-weight: 600;
    }
  `

  /* ---------- INLINE MODE ---------- */
  if (variant === 'inline') {
    return (
      <div className="lang-root inline">
        <style>{styles}</style>
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => changeLang(l.code)}
            className={`inline-btn ${
              i18n.language === l.code ? 'active' : ''
            }`}
          >
            {l.short}
          </button>
        ))}
      </div>
    )
  }

  /* ---------- DROPDOWN MODE ---------- */
  return (
    <div className="lang-root" ref={containerRef}>
      <style>{styles}</style>

      <button
        className="lang-btn"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        🌐
        <span className="lang-badge">{current.short}</span>
      </button>

      {open && (
        <div className="dropdown" role="listbox">
          {LANGUAGES.map(l => (
            <div
              key={l.code}
              role="option"
              onClick={() => changeLang(l.code)}
              className={`dropdown-item ${
                i18n.language === l.code ? 'active' : ''
              }`}
            >
              <div>
                {l.label}
                {showNative && (
                  <div className="native">{l.native}</div>
                )}
              </div>
              <div>{l.short}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
