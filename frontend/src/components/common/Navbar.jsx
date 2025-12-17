import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="navbar-root">
      <style>{`
/* ================= ROOT ================= */
.navbar-root {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.85),
    rgba(255,255,255,0.75)
  );
  border-bottom: 1px solid rgba(226,232,240,0.8);
  box-shadow: 0 10px 30px rgba(15,23,42,0.06);
  font-family: Inter, system-ui, sans-serif;
}

/* ================= CONTAINER ================= */
.navbar-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
}

.navbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ================= BRAND ================= */
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.brand-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563EB, #22D3EE);
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(37,99,235,0.35);
}

.brand-text {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0F172A;
}

/* ================= NAV LINKS ================= */
.nav-links {
  display: none;
  gap: 0.3rem;
}

@media (min-width: 1024px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  position: relative;
  padding: 0.45rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
  border-radius: 0.6rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(37,99,235,0.08);
  color: #2563EB;
}

.nav-link.active {
  color: #2563EB;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 20%;
  right: 20%;
  bottom: -6px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2563EB, #22D3EE);
}

/* ================= RIGHT ================= */
.nav-right {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

/* ================= USER CHIP ================= */
.user-chip {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(248,250,252,0.9);
  border: 1px solid #E2E8F0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #0F172A;
}

.user-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 0 4px rgba(34,197,94,0.15);
}

/* ================= LOGOUT ================= */
.btn-logout {
  padding: 0.4rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 0.55rem;
  border: 1px solid #FCA5A5;
  background: linear-gradient(180deg, #FFF, #FEF2F2);
  color: #DC2626;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: #FEE2E2;
  transform: translateY(-1px);
}

/* ================= MENU BTN ================= */
.menu-btn {
  border: none;
  background: rgba(15,23,42,0.04);
  padding: 0.4rem 0.55rem;
  border-radius: 0.6rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.menu-btn:hover {
  background: rgba(15,23,42,0.08);
}

/* ================= MOBILE MENU ================= */
.mobile-menu {
  display: none;
  animation: slideDown 0.25s ease;
  background: white;
}

.mobile-menu.open {
  display: block;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-link {
  display: block;
  padding: 0.9rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #0F172A;
  text-decoration: none;
  border-bottom: 1px solid #F1F5F9;
}

.mobile-link:hover {
  background: #F8FAFC;
  color: #2563EB;
}

.mobile-logout {
  width: 100%;
  padding: 0.9rem 1.5rem;
  border: none;
  background: #FEF2F2;
  color: #DC2626;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
      `}</style>

      {/* ================= DESKTOP ================= */}
      <div className="navbar-container">
        <div className="navbar-row">

          {/* BRAND */}
          <Link to="/dashboard" className="brand">
            <div className="brand-badge">PI</div>
            <span className="brand-text">PharmaIntel AI</span>
          </Link>

          {/* LINKS */}
          <div className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/medical-assistant" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Medical Assistant
            </NavLink>
            <NavLink to="/drugs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Drugs
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Reports
            </NavLink>
          </div>

          {/* RIGHT */}
          <div className="nav-right">
            <LanguageSwitcher />

            {user && (
              <>
                <div className="user-chip">
                  <span className="user-dot" />
                  {user.name || user.email}
                </div>

                <button className="btn-logout" onClick={logout}>
                  Logout
                </button>
              </>
            )}

            <button className="menu-btn lg:hidden" onClick={() => setOpen(!open)}>
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <NavLink to="/dashboard" className="mobile-link" onClick={() => setOpen(false)}>
          Dashboard
        </NavLink>
        <NavLink to="/medical-assistant" className="mobile-link" onClick={() => setOpen(false)}>
          Medical Assistant
        </NavLink>
        <NavLink to="/drugs" className="mobile-link" onClick={() => setOpen(false)}>
          Drugs
        </NavLink>
        <NavLink to="/reports" className="mobile-link" onClick={() => setOpen(false)}>
          Reports
        </NavLink>

        {user && (
          <button
            className="mobile-logout"
            onClick={() => {
              logout()
              setOpen(false)
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
