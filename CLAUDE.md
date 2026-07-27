# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reveal Clinic is a mobile-first PWA (React + TypeScript) for a luxury aesthetic/dermatology clinic, built and hosted via Google AI Studio. It bundles three distinct role-based experiences (patient, doctor/nurse, coordinator/front-desk) into a single-page app, plus a Gemini-powered AI chat assistant served through a small Express backend.

## Commands

- `npm run dev` — start the app (runs `tsx server.ts`, which boots Express with Vite in middleware mode; serves on `http://0.0.0.0:3000`)
- `npm run build` — builds the client with Vite and bundles `server.ts` into `dist/server.cjs` via esbuild
- `npm run start` — run the production build (`node dist/server.cjs`)
- `npm run lint` — type-check only (`tsc --noEmit`); there is no separate lint tool configured
- `npm run preview` — Vite preview of the built client (static, no Express/API routes)
- `npm run clean` — removes `dist/` and `server.js`

There is no test suite/framework configured in this repo.

## Architecture

### Single Express entrypoint, no routing library

`server.ts` is the only backend file. In dev it wraps Vite in middleware mode (`appType: "spa"`); in production it serves `dist/` statically and falls back to `index.html` for all routes. The only real API route is `POST /api/chat`, which proxies to the Gemini API (`@google/genai`) using `GEMINI_API_KEY` from the environment. If the key is missing, it returns a canned fallback response instead of erroring — this is intentional (AI Studio injects the key at runtime via its Secrets panel; local dev without a key should still work). The system prompt (clinic hours, locations, doctor bios, feature list) is inlined directly in `server.ts`.

There is no client-side router. The whole app is one component tree (`src/App.tsx`) that switches between views by string-keyed tab state, not URL routes.

### Three parallel UI shells keyed by `user.role`

`src/App.tsx` is the composition root and holds essentially all app state (appointments, packages, payments, chat, clinical schedule, staff notifications, walk-in queue, etc.) as sibling `useState` hooks, each mirrored to `localStorage` via a matching `useEffect` + `saveState` call. There is no reducer/store — new persisted state means: add a `useState` initialized from `loadState(key, default)`, add a `useEffect` that calls `saveState(key, value)`, and pass the value + setter down as props.

`App.tsx` branches into three mutually exclusive top-level layouts based on `user.role`:

- **Patient** (`role` unset or `'patient'`) — `TopBar`/`BottomNav`/`DesktopSidebar` (`src/components/Navigation/`) + views in `Home/`, `Appointments/`, `Services/`, `CheckIn/`, `Reports/`, `Profile/`, `Chat/`. Tab state type: `TabType`.
- **Doctor/Nurse** (`role === 'doctor' | 'nurse'`) — components under `src/components/Doctor/`. Tab state type: `StaffTabType`.
- **Coordinator** (`role === 'coordinator'`) — components under `src/components/Coordinator/`. Tab state type: `CoordinatorTabType`.

Each shell has its own top bar, bottom nav (mobile), desktop sidebar, and its own tab-type enum in `src/types.ts` — they are not shared, so adding a tab to one role does not affect the others. `isStaffRole = role === 'doctor' | 'nurse' | 'coordinator'` gates entry into the non-patient shells; doctor and nurse currently share the same UI branch.

Role switching happens through `AuthModal` (`src/components/Auth/AuthModal.tsx`), which acts as both login and a role selector for demo purposes — selecting a role swaps `user` wholesale (see `mockStaffProfiles` in `src/data/mockData.ts` for the canned staff profiles it picks from).

### Data flow and mock data

There is no real backend database — `src/data/mockData.ts` is the single source of seed data for every domain object (doctors, branches, treatments, packages, appointments, clinical schedule, patients, treatment sessions, staff notifications, walk-in queue, gift cards, loyalty rewards). `App.tsx` seeds each `useState` from `localStorage` if present, otherwise from these mock arrays. All mutations (booking, cancelling, payments, notifications, etc.) are local state transforms in `App.tsx` handler functions passed down as props — nothing round-trips to a server except the AI chat endpoint.

Domain types live in `src/types.ts`, organized into: shared/patient-facing types (appointments, payments, packages, gift cards, chat) and a clearly separated clinical section for doctor/nurse/coordinator data (`ClinicalScheduleItem`, `ClinicalPatientRecord`, `TreatmentSession`, `StaffNotification`, `WalkInPatient`). When adding a field to a shared concept (e.g. `Appointment`), check whether the clinical-side equivalent (`ClinicalScheduleItem`) needs the same field — they model overlapping data independently rather than sharing a type.

### PWA lifecycle screens

App boot order in `App.tsx` is gated by sequential state checks before rendering any shell: `showSplash` → `SplashScreen`, then `!hasOnboarded` → `OnboardingScreen`, then `!isAuthenticated || showAuthModal` → full-screen `AuthModal`. Only after all three pass does the role-based shell render. `PWAInstallBanner` and `Snackbar` (toast, driven by `snackbarMessage` + `triggerToast()`) are cross-cutting UI rendered inside every shell.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` — config is CSS-based, see `src/index.css`). Icons from `lucide-react`. Animations from `motion` (Framer Motion successor).

### Path alias

`@/*` maps to the repo root (not `src/`) in both `tsconfig.json` and `vite.config.ts` — e.g. `@/src/...`.

## Environment

- `GEMINI_API_KEY` — required for real AI chat responses; without it `/api/chat` returns a static fallback (see `.env.example`).
- `DISABLE_HMR` — when `"true"`, disables Vite HMR and file watching (used by the AI Studio agent environment to prevent flicker during automated edits). Do not change this logic in `vite.config.ts`.
