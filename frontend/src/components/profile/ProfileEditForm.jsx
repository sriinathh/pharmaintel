import React, { useEffect, useMemo, useState } from 'react'

/**
 * ProfileEditForm.jsx
 * --------------------------------------------------
 * Dynamic profile edit form
 * PharmaIntel AI – production style
 */

export default function ProfileEditForm({ profile, onSave, saving }) {

  /* ===================== STATE ===================== */
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    language: 'en',
    interests: [],
    bio: ''
  })

  const [touched, setTouched] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  /* ===================== INIT FROM PROFILE ===================== */
  useEffect(() => {
    if (!profile) return

    setForm({
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role || '',
      language: profile.language || 'en',
      interests: profile.interests || [],
      bio: profile.bio || ''
    })

    setTouched({})
  }, [profile])

  /* ===================== INTEREST OPTIONS ===================== */
  const interestOptions = useMemo(() => ([
    'Cardiology',
    'Pharmacology',
    'Infectious Disease',
    'Pediatrics',
    'Oncology',
    'Neurology',
    'Clinical Research',
    'Regulatory Affairs'
  ]), [])

  /* ===================== VALIDATION ===================== */
  const errors = useMemo(() => {
    const e = {}

    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.role.trim()) e.role = 'Role is required'
    if (form.bio.length > 180) e.bio = 'Bio must be under 180 characters'

    return e
  }, [form])

  const isValid = Object.keys(errors).length === 0

  const isDirty = useMemo(() => {
    if (!profile) return false
    return (
      form.name !== profile.name ||
      form.role !== profile.role ||
      form.language !== profile.language ||
      form.bio !== profile.bio ||
      JSON.stringify(form.interests) !== JSON.stringify(profile.interests)
    )
  }, [form, profile])

  /* ===================== HANDLERS ===================== */
  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setTouched(t => ({ ...t, [field]: true }))
  }

  const toggleInterest = (i) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i)
        ? f.interests.filter(x => x !== i)
        : [...f.interests, i]
    }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!isValid || !isDirty || !onSave) return

    try {
      setError(null)
      setSuccess(false)

      await onSave(form)
      setSuccess(true)

      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError('Failed to save profile changes')
    }
  }

  /* ===================== RENDER ===================== */
  return (
    <form onSubmit={submit} className="profile-edit">

      {/* ================= INLINE CSS ================= */}
      <style>{`
        .profile-edit {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.5rem;
          font-family: Inter, system-ui, sans-serif;
        }

        .title {
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 0.75rem;
          color: #64748B;
          margin-bottom: 0.2rem;
        }

        .input,
        .select,
        .textarea {
          border: 1px solid #CBD5E1;
          border-radius: 0.5rem;
          padding: 0.45rem 0.6rem;
          font-size: 0.85rem;
        }

        .input:focus,
        .select:focus,
        .textarea:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }

        .input[disabled] {
          background: #F1F5F9;
          cursor: not-allowed;
        }

        .error {
          font-size: 0.7rem;
          color: #DC2626;
          margin-top: 0.15rem;
        }

        .hint {
          font-size: 0.7rem;
          color: #94A3B8;
          margin-top: 0.15rem;
        }

        .interests {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .interest {
          padding: 0.25rem 0.6rem;
          font-size: 0.7rem;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          cursor: pointer;
        }

        .interest.active {
          background: #ECFEFF;
          border-color: #67E8F9;
          color: #0F766E;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.25rem;
        }

        .status {
          font-size: 0.75rem;
        }

        .status.success {
          color: #16A34A;
        }

        .status.error {
          color: #DC2626;
        }

        .btn {
          padding: 0.45rem 1rem;
          border-radius: 0.6rem;
          font-size: 0.8rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          background: #2563EB;
          color: #FFFFFF;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="title">Edit Profile Details</div>

      {/* BASIC INFO */}
      <div className="grid">
        <div className="field">
          <label className="label">Full name</label>
          <input
            className="input"
            value={form.name}
            onChange={e => update('name', e.target.value)}
          />
          {touched.name && errors.name && (
            <div className="error">{errors.name}</div>
          )}
        </div>

        <div className="field">
          <label className="label">Email</label>
          <input
            className="input"
            value={form.email}
            disabled
          />
          <div className="hint">Email cannot be changed</div>
        </div>

        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <label className="label">Role</label>
          <input
            className="input"
            value={form.role}
            onChange={e => update('role', e.target.value)}
            placeholder="Student / Pharmacist"
          />
          {touched.role && errors.role && (
            <div className="error">{errors.role}</div>
          )}
        </div>
      </div>

      {/* LANGUAGE */}
      <div className="field" style={{ marginTop: '1rem' }}>
        <label className="label">Language</label>
        <select
          className="select"
          value={form.language}
          onChange={e => update('language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="te">తెలుగు</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {/* BIO */}
      <div className="field" style={{ marginTop: '1rem' }}>
        <label className="label">Short bio</label>
        <textarea
          rows={3}
          className="textarea"
          value={form.bio}
          onChange={e => update('bio', e.target.value)}
        />
        <div className="hint">
          {form.bio.length}/180 characters
        </div>
        {touched.bio && errors.bio && (
          <div className="error">{errors.bio}</div>
        )}
      </div>

      {/* INTERESTS */}
      <div className="field" style={{ marginTop: '1rem' }}>
        <label className="label">Medical interests</label>
        <div className="interests">
          {interestOptions.map(i => (
            <button
              key={i}
              type="button"
              className={`interest ${form.interests.includes(i) ? 'active' : ''}`}
              onClick={() => toggleInterest(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <div className="status">
          {error && <span className="status error">{error}</span>}
          {success && <span className="status success">Profile updated</span>}
          {!isDirty && <span className="hint">No changes</span>}
        </div>

        <button
          type="submit"
          className="btn"
          disabled={!isValid || !isDirty || saving}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
