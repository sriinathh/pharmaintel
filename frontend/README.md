# PharmaIntel AI — Frontend

This repository contains the frontend for PharmaIntel AI — a Vite + React application styled with Tailwind and custom design tokens. The frontend is built to work with a mock service layer (in `src/services`) and can be connected to a backend API via environment variables.

## Quick start

Prerequisites: Node.js 18+ and npm

Install dependencies and run the dev server:

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Lint the code:

```bash
npm run lint
```

## Project structure (important files)

- `src/` — application source
  - `main.jsx` — app entry
  - `App.jsx` — routes and layout
  - `pages/` — route pages (Landing, Login, Register, Dashboard, Chatbot, Reports, Profile, Admin)
  - `components/` — reusable components (navbar, footer, dashboard widgets, chatbot UI, reports)
  - `services/` — lightweight mock services (AI, reports, profile, API helper) — replace these with real API calls
  - `styles/` — tokenized CSS and component-level styles
  - `index.css` — consolidated global CSS (imports Tailwind and token styles)

### Folder structure (frontend)

```
frontend/
├─ public/                 # static assets (logo, images, manifest)
├─ src/
│  ├─ assets/              # images and static JS assets
│  ├─ components/          # reusable UI components (common, dashboard, chatbot, reports, profile)
│  │  ├─ common/
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ Footer.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ dashboard/
│  │  ├─ chatbot/
│  │  └─ reports/
│  ├─ context/             # React Context providers (Auth, Theme, Language)
│  ├─ hooks/                # custom hooks (useAuth, useChat, useLanguage)
│  ├─ pages/                # route pages (Landing, Login, Register, Dashboard, Chatbot, Reports, Profile)
│  ├─ services/             # mock service layer (ai.service, report.service, profile.service, api.js)
│  ├─ styles/               # tokenized CSS fragments (index.css, components.css, app.css)
│  ├─ i18n.js               # i18n initialization
│  ├─ index.css             # consolidated global CSS + Tailwind directives
│  └─ main.jsx              # React entry
├─ package.json
├─ vite.config.js
└─ README.md
```

## Styling and design tokens

The app uses Tailwind utilities plus a small set of CSS variables for consistent colors and spacing. Tokens are declared in `src/index.css` under `:root`:

- `--color-primary`, `--color-secondary`, `--text-primary`, `--text-secondary`, `--bg-page`, `--card-bg`, `--border`, etc.

Prefer using these tokens or the `.btn`, `.card`, `.page` helper classes when modifying UI to keep a consistent, medical-grade design.

## Where to plug a backend

The app currently uses mock services in `src/services/*.js`. To integrate a backend:

1. Create a backend API and enable CORS.
2. Add environment variables to point the frontend at the backend (Vite requires `VITE_` prefix):

```
VITE_API_URL=https://api.example.com
```

3. Update `src/services/api.js` to call the real backend (axios/fetch) using `import.meta.env.VITE_API_URL`.

Files to update for backend integration:
- `src/services/api.js` — base `get`/`post` wrappers
- `src/services/ai.service.js` — currently mocks AI responses; replace with POST to `/api/ai/query`
- `src/services/report.service.js` — replace mocked storage with calls to `/api/reports`
- `src/services/profile.service.js` — replace with `/api/profile` endpoints

API contract suggestions and example requests are provided in `BACKEND_INTEGRATION.md`.

## Auth & session

The frontend expects a simple auth flow (login/register). Recommended approach:

- Backend returns a JWT on `POST /api/auth/login` and `POST /api/auth/register`.
- Store token in secure, short-lived storage (httpOnly cookie preferred) or in-memory; include token on requests.

## Notes for backend implementer

- Keep responses JSON and stable (see `BACKEND_INTEGRATION.md` for example shapes).
- Implement CORS to allow the dev server origin (usually `http://localhost:5173`).
- For quick local testing you can adapt the mock services in `src/services` to call your backend URLs.

## Development tips

- Tailwind: update `tailwind.config.js` if you want to extend theme colors. After changing Tailwind config, restart the dev server.
- Formatting: follow existing conventions (Inter font, rounded cards, soft shadows). Use token classes in `src/index.css`.
- Visual QA: run `npm run dev` and open the site; check Dashboard, Chatbot, Reports, and Profile flows.

## Where to start adding backend endpoints

See `BACKEND_INTEGRATION.md` for concise endpoint specs and example payloads the frontend expects.

---
If you want, I can now generate the backend scaffold (Express + endpoints) matching `BACKEND_INTEGRATION.md` — tell me which language/framework you prefer.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
