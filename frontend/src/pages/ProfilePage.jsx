import React, { useEffect, useMemo, useState } from 'react'
import ProfileCard from '../components/profile/ProfileCard'
import ProfileEditForm from '../components/profile/ProfileEditForm'
import ActivityHistory from '../components/profile/ActivityHistory'
import * as profileService from '../services/profile.service'

/**
 * ProfilePage.jsx
 * --------------------------------------------------
 * Dynamic profile management page
 * PharmaIntel AI – production style
 */

export default function ProfilePage() {

  /* ===================== STATE ===================== */
  const [profile, setProfile] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  /* ===================== FETCH PROFILE ===================== */
  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        setLoading(true)
        const data = await profileService.getProfile()

        if (!mounted) return

        setProfile(data)

        /* ---- fetch activity related to profile ---- */
        const activityData = await profileService.getProfileActivity()
        setActivities(activityData || [])

      } catch (err) {
        setError('Failed to load profile information')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
    return () => (mounted = false)
  }, [])

  /* ===================== UPDATE PROFILE ===================== */
  const handleUpdate = async (patch) => {
    try {
      setSaving(true)
      setError(null)
      setSuccessMsg('')

      // optimistic UI update
      setProfile((prev) => ({ ...prev, ...patch }))

      const updated = await profileService.updateProfile(patch)
      setProfile(updated)

      setSuccessMsg('Profile updated successfully')

      setTimeout(() => setSuccessMsg(''), 2500)
    } catch (err) {
      setError('Failed to save profile changes')
    } finally {
      setSaving(false)
    }
  }

  /* ===================== DERIVED METRICS ===================== */
  const profileStats = useMemo(() => {
    if (!profile) return null

    return [
      { label: 'Role', value: profile.role || '—' },
      { label: 'Language', value: profile.language?.toUpperCase() || 'EN' },
      { label: 'Interests', value: profile.interests?.length || 0 },
      { label: 'Account Type', value: profile.plan || 'Free' }
    ]
  }, [profile])

  /* ===================== RENDER ===================== */
  return (
    <div className="profile-root">

      {/* ================= INLINE CSS ================= */}
      <style>{`
        .profile-root {
          max-width: 1280px;
          margin: 0 auto;
          padding: 7rem 1.5rem 4rem;
          background: #F8FAFC;
          min-height: 100vh;
          font-family: Inter, system-ui, sans-serif;
        }

        .header {
          margin-bottom: 2rem;
        }

        .title {
          font-size: 1.9rem;
          font-weight: 700;
          color: #0F172A;
        }

        .subtitle {
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: 1fr 2fr;
          }
        }

        .card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 10px rgba(15,23,42,0.05);
        }

        .section-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 1rem;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .stat {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 0.75rem;
          padding: 0.75rem;
          font-size: 0.85rem;
        }

        .stat span {
          display: block;
          color: #64748B;
        }

        .stat strong {
          color: #0F172A;
          font-size: 0.95rem;
        }

        .loading,
        .error {
          text-align: center;
          padding: 3rem 0;
          font-size: 0.9rem;
        }

        .error {
          color: #DC2626;
        }

        .success {
          background: #ECFDF5;
          border: 1px solid #6EE7B7;
          color: #065F46;
          padding: 0.6rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .note {
          margin-top: 2.5rem;
          padding: 1rem;
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 0.75rem;
          font-size: 0.85rem;
          color: #1E3A8A;
        }
      `}</style>

      {/* ================= HEADER ================= */}
      <div className="header">
        <h2 className="title">My Profile</h2>
        <p className="subtitle">
          Manage your personal details, preferences, and activity
        </p>
      </div>

      {/* ================= LOADING / ERROR ================= */}
      {loading && <div className="loading">Loading profile…</div>}
      {error && <div className="error">{error}</div>}

      {/* ================= CONTENT ================= */}
      {!loading && profile && (
        <div className="grid">

          {/* LEFT COLUMN */}
          <div className="card">
            <div className="section-title">Profile Overview</div>

            <ProfileCard profile={profile} />

            {/* PROFILE STATS */}
            <div className="stats">
              {profileStats.map((s) => (
                <div key={s.label} className="stat">
                  <span>{s.label}</span>
                  <strong>{s.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* EDIT FORM */}
            <div className="card">
              <div className="section-title">Edit Profile</div>

              {successMsg && <div className="success">{successMsg}</div>}

              <ProfileEditForm
                profile={profile}
                onSave={handleUpdate}
                saving={saving}
              />
            </div>

            {/* ACTIVITY */}
            <div className="card">
              <div className="section-title">Recent Activity</div>

              <ActivityHistory items={activities} />
            </div>

          </div>
        </div>
      )}

      {/* ================= NOTE ================= */}
      <div className="note">
        ℹ️ Your profile data is used only for personalization, analytics, and
        improving AI responses. We never share your information with third
        parties.
      </div>
    </div>
  )
}
