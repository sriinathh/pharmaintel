import React from 'react'

/**
 * AIModelBadge
 *
 * Props:
 *  - model: string ("gemini" | "mistral" | "gpt" | "hybrid")
 *  - size: "sm" | "md"
 */
export default function AIModelBadge({ model = 'unknown', size = 'sm' }) {
  const MODELS = {
    gemini: {
      label: 'Gemini AI',
      color: '#2563EB',
      bg: '#EFF6FF',
      desc: 'Google Gemini – fast & multimodal',
      icon: '✨',
    },
    mistral: {
      label: 'Mistral AI',
      color: '#0D9488',
      bg: '#ECFEFF',
      desc: 'Mistral – open & efficient LLM',
      icon: '🌪️',
    },
    gpt: {
      label: 'GPT',
      color: '#9333EA',
      bg: '#F5F3FF',
      desc: 'OpenAI GPT model',
      icon: '🧠',
    },
    hybrid: {
      label: 'Hybrid AI',
      color: '#F59E0B',
      bg: '#FFFBEB',
      desc: 'Multiple AI models combined',
      icon: '⚡',
    },
    unknown: {
      label: 'AI Model',
      color: '#475569',
      bg: '#F8FAFC',
      desc: 'Generic AI engine',
      icon: '🤖',
    },
  }

  const cfg = MODELS[model?.toLowerCase()] || MODELS.unknown

  return (
    <span
      title={cfg.desc}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'md' ? '0.45rem' : '0.35rem',
        padding: size === 'md' ? '0.35rem 0.75rem' : '0.25rem 0.55rem',
        fontSize: size === 'md' ? '0.75rem' : '0.65rem',
        borderRadius: '999px',
        background: cfg.bg,
        color: cfg.color,
        fontWeight: 600,
        border: `1px solid ${cfg.color}22`,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  )
}
