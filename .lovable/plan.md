
## Goal
Turn BanglaSathi from a static prototype into a working app: real data, working buttons everywhere, and an admin dashboard inside Profile → Settings.

## 1. Enable Lovable Cloud + database
Tables (with RLS + grants):
- `updates` — id, title, bn, tag, tone, description, youtube_url, online_label, online_url, offline_where, offline_steps[], offline_docs[], helpline, has_video, created_at
- `benefits` — id, title, bn, amount, category, eligibility, apply_url, offline_steps[], docs[], created_at
- `services` — id, title, bn, type, description, link, created_at
- `reports` — id, issue_type, description, location, photo_url, citizen_name, phone, status, created_at
- `admin_credentials` — single row: admin_id, password_hash

Storage bucket `reports` (public read) for photo uploads.

## 2. Admin login (custom ID + password)
- New route `/admin/login` with two inputs: Admin ID + Password.
- Server fn `verifyAdmin({id,password})` checks against `admin_credentials` (bcrypt hash) and returns a signed session token stored in httpOnly cookie via `useSession`.
- `requireAdmin` middleware for all admin server fns.
- Seed default admin: `id = banglasathi`, `password = admin@2026` (user can change later from dashboard).

## 3. Admin dashboard `/admin`
Tabs:
- **Updates & Alerts** — list, add (paste YouTube URL → auto-fetch title/description via oEmbed; toggle has_video; offline fields; helpline), edit, delete.
- **Benefits** — CRUD.
- **Services** — CRUD.
- **Reports** — list of citizen reports, mark resolved.
- **Settings** — change admin password.

## 4. Add YouTube videos to Updates feed
Seed two updates with the supplied YouTube links. Soft, kind captions like:
- "A small step for your family's tomorrow — quiet support that reaches every doorstep."
- "Care that doesn't ask for much — just a visit and a smile at your nearest centre."
No online process. Video card on the feed shows a YouTube thumbnail + play overlay; tapping opens DetailSheet WITHOUT the embedded video (per spec — only details, offline steps, helpline).

## 5. Make every option workable
- **Home buttons** — already route; ensure all 5 cards (Benefits, Services, Updates, Report, Near You) load from DB.
- **Benefits** — list from DB; "Apply" opens external URL or shows offline-only sheet.
- **Services** — appointment-booking placeholder per item → opens detail sheet with description/link.
- **Report** — submit writes to `reports` table; photo uploads to storage; success toast.
- **Local/Near You** — read from `services` (type=event).
- **Help/Updates** — read from `updates`; DetailSheet exactly as today but hides video block.
- **Profile** — "My Applications" lists user's reports (by phone for now); "Notifications" shows latest updates; **Settings** row navigates to `/admin/login`; "Help & FAQ" shows static accordion.
- **Ask AI** — wire to Lovable AI Gateway (free Gemini Flash) for Q&A about schemes.

## 6. Pages / files
New routes: `/admin/login`, `/admin` (tabbed dashboard).
New server fns: `admin.functions.ts`, `content.functions.ts` (public reads), `reports.functions.ts`, `ai.functions.ts`.
Edits: `index.tsx`, `benefits.tsx`, `services.tsx`, `help.tsx`, `report.tsx`, `local.tsx`, `profile.tsx`, `ask.tsx`.

## Notes
- Password stored as bcrypt hash; never returned to client.
- Citizens stay anonymous — no public login needed; reports tracked by phone number.
- YouTube oEmbed (`https://www.youtube.com/oembed?url=...`) called from server fn to fetch title/author when admin pastes a URL.

Shall I proceed?
