import React, { useMemo } from 'react'

/**
 * ProfileCard.jsx
 * --------------------------------------------------
 * Dynamic user profile overview card
 * PharmaIntel AI – production style
 */

export default function ProfileCard({ profile, stats }) {
  /* ================= LOADING STATE ================= */
  if (!profile) {
    return (
      <div className="profile-card loading">
        <style>{baseCSS}</style>
        Loading profile…
      </div>
    )
  }

  /* ================= DERIVED DATA ================= */
  const derivedStats = useMemo(() => {
    return {
      reports: stats?.reports ?? profile.reportsCount ?? 0,
      queries: stats?.queries ?? profile.queriesCount ?? 0,
      reminders: stats?.reminders ?? profile.remindersCount ?? 0
    }
  }, [stats, profile])

  const lastActive = useMemo(() => {
    if (!profile.lastActive) return '—'
    const mins = Math.floor((Date.now() - profile.lastActive) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins} min ago`
    if (mins < 1440) return `${Math.floor(mins / 60)} hrs ago`
    return `${Math.floor(mins / 1440)} days ago`
  }, [profile.lastActive])

  /* ================= RENDER ================= */
  return (
    <div className="profile-card">
      <style>{baseCSS}</style>

      {/* HEADER */}
      <div className="header">
        <img
          src={profile.avatar || '/logo.png'}
          alt="avatar"
          className="avatar"
        />

        <div className="identity">
          <div className="name">{profile.name}</div>
          <div className="email">{profile.email}</div>

          <div className="badges">
            <span className="badge role">
              {profile.role || 'User'}
            </span>

            {profile.plan && (
              <span className="badge plan">
                {profile.plan}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <Stat label="Reports" value={derivedStats.reports} />
        <Stat label="Queries" value={derivedStats.queries} />
        <Stat label="Reminders" value={derivedStats.reminders} />
      </div>

      {/* DETAILS */}
      <div className="details">
        <Row label="Preferred language" value={profile.language || 'English'} />
        <Row label="Last active" value={lastActive} />
      </div>

      {/* INTERESTS */}
      <div className="interests">
        <div className="label">Medical interests</div>

        {profile.interests?.length ? (
          <div className="tags">
            {profile.interests.map((i) => (
              <span key={i} className="tag">
                {i}
              </span>
            ))}
          </div>
        ) : (
          <div className="empty">
            No interests selected
          </div>
        )}
      </div>
    </div>
  )
}

/* ================= SUB COMPONENTS ================= */
function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <strong className="row-value">{value}</strong>
    </div>
  )
}

/* ================= STYLES ================= */
const baseCSS = `
.profile-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(15,23,42,0.05);
  font-family: Inter, system-ui, sans-serif;
}

.profile-card.loading {
  font-size: 0.9rem;
  color: #64748B;
  text-align: center;
}

.header {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.avatar {
  height: 64px;
  width: 64px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid #E2E8F0;
}

.identity {
  flex: 1;
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0F172A;
}

.email {
  font-size: 0.85rem;
  color: #64748B;
}

.badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.badge {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
}

.badge.role {
  background: #EFF6FF;
  color: #2563EB;
}

.badge.plan {
  background: #ECFDF5;
  color: #065F46;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1.25rem;
  text-align: center;
}

.stat {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 0.75rem;
  padding: 0.6rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2563EB;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748B;
}

.details {
  margin-top: 1.25rem;
  font-size: 0.85rem;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.row-label {
  color: #64748B;
}

.row-value {
  color: #0F172A;
}

.interests {
  margin-top: 1.25rem;
}

.label {
  font-size: 0.8rem;
  color: #64748B;
  margin-bottom: 0.4rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #ECFEFF;
  color: #0F766E;
}

.empty {
  font-size: 0.75rem;
  color: #94A3B8;
}
`
