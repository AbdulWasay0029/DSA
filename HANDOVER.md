# 📘 AlgoStream — Complete Project Handover Manual

> Written after reading every source file. This is the single source of truth for anyone taking over or continuing this project.

---

## 🧭 What Is This?

**AlgoStream** (repo name: `SmartInterviews`) is a **Next.js 14** full-stack web app that serves as a personal DSA (Data Structures & Algorithms) curriculum tracker.

It was built to:
- Store handwritten DSA notes digitally (transcribed from physical notebooks)
- Track which problems have been solved/completed
- Allow non-admin users to suggest edits to notes (which admins can approve or reject)
- Provide a curated link library of DSA problems from external platforms

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB (via Mongoose) |
| Auth | NextAuth.js v4 (Google OAuth only) |
| Animations | Framer Motion |
| Code Highlighting | react-syntax-highlighter (vscDarkPlus theme) |
| Deployment | Vercel (auto-deploys on `git push main`) |

---

## ⚙️ Environment Variables (`.env.local`)

Create this file at the project root. **Never commit it.**

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
NEXTAUTH_SECRET=<any long random string>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
ADMIN_EMAILS=youremail@gmail.com,anotheremail@gmail.com
```

**`ADMIN_EMAILS`** is a comma-separated list of Google email addresses that get the `admin` role. Everyone else is a `visitor`.

---

## 🚀 Running Locally

```bash
npm install
npm run dev
# App runs at http://localhost:3000
```

---

## 📁 Full File Structure & What Each File Does

### Root Config Files
| File | Purpose |
|---|---|
| `package.json` | Dependencies: next, mongoose, next-auth, framer-motion, react-syntax-highlighter |
| `tsconfig.json` | TypeScript config. `@/` maps to project root. |
| `next.config.js` | Next.js config (if exists) |
| `.env.local` | Secret keys — **never commit** |

---

### `lib/` — Core Backend Utilities

#### `lib/db.ts`
MongoDB connection utility. Uses a **global cache** to prevent re-connecting on every API call (important in Next.js serverless). Always call `await dbConnect()` before any Mongoose query.

#### `lib/auth.ts`
NextAuth configuration. Uses **Google OAuth only**. Role assignment happens in the `jwt` callback:
- If the user's email is in `ADMIN_EMAILS` env var → role = `"admin"`
- Otherwise → role = `"visitor"`

The role is stored in the JWT token and passed to the session. Access it in components via:
```ts
const role = (session?.user as any)?.role || 'visitor';
```

#### `lib/models.ts`
All Mongoose models. **Four collections in MongoDB:**

1. **`Note`** — Main content. Fields: `id` (custom slug, unique), `title`, `description`, `fullDescription`, `difficulty` (Easy/Medium/Hard), `date`, `tags[]`, `tips[]`, `examples[]`, `solutions[]`. Each solution has `title`, `language`, `code`, `isPseudo`, `complexity {time, space}`.

2. **`Suggestion`** — Same structure as Note, plus: `suggestionId` (unique string), `originalId` (if editing an existing note), `status` (pending/approved/rejected), `submittedBy` (email), `submittedAt`.

3. **`UserProgress`** — Tracks which notes a user has completed. Fields: `email` (unique), `completedNotes[]` (array of Note `id` strings), `lastActive`.

4. **`Link`** — DSA problem links. Fields: `id`, `title`, `url`, `category`, `platform`, `difficulty`.

#### `lib/storage.ts`
**Legacy file-based storage** — reads/writes `data/notes.json`, `data/suggestions.json`, `data/links.json`. **This is mostly unused now** since the app migrated to MongoDB. The `Suggestion` TypeScript interface exported from here is still used by `app/admin/review/[id]/page.tsx`. Do not delete this file.

---

### `data/` — Static Data Files

| File | Purpose |
|---|---|
| `data/notes.ts` | TypeScript file with the `Note` interface definition + 13 hardcoded seed notes (Valid Triangle, First & Last Occurrence, etc.). **This is the source of truth for the TypeScript type.** The actual data in the app comes from MongoDB, not this file. |
| `data/notes.json` | JSON version of seed notes. Used by `/api/seed` to populate MongoDB on first run. |
| `data/raw_notes_seed.json` | Raw/unprocessed notes data. Reference only. |
| `data/links.json` | JSON array of DSA links. Used by `/api/seed-links` to seed the Links collection. |
| `data/suggestions.json` | **Currently empty `[]`.** Was used by the old file-based suggestion system. Now suggestions go to MongoDB. Safe to ignore. |

---

### `app/api/` — All API Routes

#### `GET /api/notes`
Returns all notes from MongoDB, sorted by `date` desc then `createdAt` desc. **Public — no auth required.**

#### `POST /api/notes`
Creates a new note. **Admin only.** Body: Note object. Auto-generates `id` from `Date.now()` if not provided.

#### `PUT /api/notes`
Updates an existing note by `id`. **Admin only.** Body: Note object with `id` field.

#### `DELETE /api/notes?id=X&_id=Y`
Deletes a note. **Admin only.** Tries to delete by custom `id` first, then falls back to MongoDB `_id`. This dual-fallback was added to handle notes with broken/missing custom IDs.

---

#### `GET /api/links`
Returns all links. **Public.**

#### `POST /api/links` / `PUT /api/links` / `DELETE /api/links`
CRUD for links. **Admin only.**

---

#### `GET /api/suggestions`
Returns all **pending** suggestions from MongoDB. **Admin only.**

#### `POST /api/suggestions`
Creates a new suggestion. **Anyone can submit** (even visitors). The submitter's email is recorded if they're logged in, otherwise stored as `"Anonymous"`. The `suggestionId` is auto-generated as `Date.now() + random`.

#### `POST /api/suggestions/resolve`
Approves or rejects a suggestion. **Admin only.** Body: `{ suggestionId, action: 'approve' | 'reject' }`.
- **Approve**: If `originalId` exists → updates the existing note. If not → creates a new note. Marks suggestion as `approved`.
- **Reject**: Marks suggestion as `rejected`.
- Approved/rejected suggestions are **kept in DB** but filtered out of the `GET /api/suggestions` response (which only returns `pending`).

---

#### `GET /api/progress`
Returns the logged-in user's completed note IDs. **Requires login.** Creates an empty progress record if first time.

#### `POST /api/progress`
Toggles a note's completion status. **Requires login.** Body: `{ noteId, completed: boolean }`.

---

#### `GET /api/seed`
One-time seeder. Reads `data/notes.json` and inserts into MongoDB. **Only runs if the collection is empty** (won't overwrite existing data). Call this once at `http://localhost:3000/api/seed` after setting up a fresh database.

#### `GET /api/seed-links`
Same as above but for links from `data/links.json`.

#### `GET /api/seed-notes`
Similar seeder variant.

---

### `app/` — Pages

#### `/` (Home)
Landing page. Links to Curriculum, Progress, etc.

#### `/login`
Google Sign-In page. Uses NextAuth's `signIn('google')`.

#### `/notes` → `app/notes/page.tsx`
**Main curriculum page.** Fetches all notes from `/api/notes`. Features:
- Search bar (by title or tag)
- Difficulty filter buttons (Easy/Medium/Hard)
- Tag cloud filter (auto-generated from note tags)
- Grid of `NoteCard` components
- Admin-only "New Problem" button
- If DB is empty and user is admin, shows a "Seed Default Data" button

#### `/notes/[id]` → `app/notes/[id]/page.tsx`
**Note detail page.** The most complex page in the app (~795 lines). Features:
- Fetches note by `id` from `/api/notes`
- Displays: difficulty badge, date, title, problem statement (Markdown), examples, solutions with syntax highlighting
- **Completion toggle**: Logged-in users can mark notes as complete (calls `/api/progress`)
- **Topic Mastery sidebar**: Shows progress % for notes sharing the same tags
- **Edit mode** (pencil FAB button):
  - **Admin**: Edits save directly via `PUT /api/notes`
  - **Visitor/logged-in non-admin**: Edits submit as a suggestion via `POST /api/suggestions`
- Tag autocomplete with chip UI
- Copy-to-clipboard for code blocks

#### `/notes/create` → `app/notes/create/page.tsx`
**Create/Suggest new note page.** Features:
- Full form: title, difficulty, date, short description, full description (Markdown), tags, tips, examples, solutions
- **Admin**: Publishes directly via `POST /api/notes`
- **Non-admin**: Submits as suggestion via `POST /api/suggestions`
- `RichTextToolbar` component for inserting Markdown formatting

#### `/progress` → `app/progress/page.tsx`
**User dashboard.** Requires login. Shows:
- Stats: Notes Mastered / Total, Streak (hardcoded 3 days — TODO), In Progress estimate
- Overall mastery progress bar
- Topic cards (grouped by tag, links to `/notes?tag=X`)
- If not logged in: shows sign-in prompt

#### `/links` → `app/links/page.tsx`
**Problem link library.** Fetches from `/api/links`. Displays categorized links with platform badges and difficulty indicators.

---

### `app/admin/` — Admin Pages

#### `/admin` → `app/admin/page.tsx`
**Admin Dashboard.** Requires admin role (waits for session to load before checking). Shows:
- Quick action cards: "Note Manager" → `/admin/notes`, "Create New Note" → `/notes/create`
- **Pending Suggestions list**: Fetches from `/api/suggestions`. Each item links to `/admin/review/[suggestionId]`
- Shows "No pending suggestions" if none exist

#### `/admin/notes` → `app/admin/notes/page.tsx`
**Note Manager.** Admin-only table showing ALL notes with:
- Title (links to note detail page)
- Custom `id` (slug)
- MongoDB `_id`
- Status: "BROKEN ID!" in red if `id` is missing/undefined, "OK" in green otherwise
- Delete button: calls `DELETE /api/notes?id=X&_id=Y`

Use this page to find and delete broken notes that show "Note Not Found" errors.

#### `/admin/review/[id]` → `app/admin/review/[id]/page.tsx`
**Suggestion Review Page.** Admin-only. Fetches all suggestions and finds the one matching `params.id` (the `suggestionId`). Features:
- Shows suggestion metadata (submitter, type: Edit vs New)
- **Diff Mode** (default for edits): Side-by-side comparison of Original vs Proposed. Changed fields highlighted in green with ✏️ icon.
- **Preview Mode**: Shows the proposed note in the standard note layout
- Approve button → calls `POST /api/suggestions/resolve` with `action: 'approve'`
- Reject button → calls `POST /api/suggestions/resolve` with `action: 'reject'`

---

### `components/` — Reusable Components

#### `Navbar.tsx`
Animated navbar with:
- Logo "AlgoStream" → links to `/`
- Nav links: Progress, Curriculum, Library
- **Admin link** (purple color, only visible to admins) → `/admin`
- User avatar dropdown (hover) with Sign Out
- Mobile hamburger menu

#### `NoteCard.tsx`
Card component used in the `/notes` grid. Shows: title, description, tags (max 3 + overflow count), difficulty dot, solution count. Links to `/notes/[note.id]`.

#### `SimpleMarkdown.tsx`
Lightweight Markdown renderer. Handles bold, italic, code blocks, headers, lists. Used in note detail and review pages.

#### `RichTextToolbar.tsx`
Toolbar with buttons to insert Markdown syntax into the `fullDescription` textarea on the Create Note page.

---

## 🔐 Role System

| Role | How to get it | What they can do |
|---|---|---|
| `visitor` | Not logged in | View notes, view links, view progress page (empty) |
| logged-in (non-admin) | Sign in with Google (not in ADMIN_EMAILS) | Same as visitor + mark notes complete + submit suggestions |
| `admin` | Sign in with Google email that's in `ADMIN_EMAILS` | Everything + create/edit/delete notes directly + review/approve/reject suggestions + access `/admin` pages |

---

## 🗄️ MongoDB Collections Summary

| Collection | Purpose | Key Fields |
|---|---|---|
| `notes` | All DSA problems/notes | `id` (slug), `title`, `solutions[]`, `tags[]` |
| `suggestions` | Pending/approved/rejected user edits | `suggestionId`, `originalId`, `status`, `submittedBy` |
| `userprogresses` | Per-user completion tracking | `email`, `completedNotes[]` |
| `links` | DSA problem links | `id`, `title`, `url`, `category`, `platform` |

**To view/edit data directly**: Use [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → Browse Collections.

---

## 🔄 Data Flow: How a Suggestion Works

1. **User visits** `/notes/[id]` and clicks the pencil (edit) button
2. They edit the note fields and click Save
3. Since they're not admin, the app calls `POST /api/suggestions` with `{ ...editData, originalId: note.id }`
4. A new `Suggestion` document is created in MongoDB with `status: 'pending'`
5. **Admin visits** `/admin` and sees the suggestion in the list
6. Admin clicks "Review →" → goes to `/admin/review/[suggestionId]`
7. Admin sees diff view (original vs proposed) and clicks Approve or Reject
8. `POST /api/suggestions/resolve` is called:
   - **Approve**: Updates the original note in `notes` collection, marks suggestion as `approved`
   - **Reject**: Marks suggestion as `rejected`

---

## 🌱 Seeding the Database (Fresh Setup)

If you have a fresh MongoDB database with no data:

1. Make sure `data/notes.json` has your note data
2. Visit `http://localhost:3000/api/seed` in browser (GET request)
3. You should see: `{ "success": true, "message": "Seeded X notes." }`
4. For links: visit `http://localhost:3000/api/seed-links`

**The seed routes skip if data already exists** — they won't overwrite.

---

## 🐛 Common Issues & Fixes

### "Note Not Found" on `/notes/[id]`
The note's `id` field in MongoDB is broken/missing. Fix:
1. Go to `/admin/notes`
2. Find the note with "BROKEN ID!" status
3. Click Delete

### Admin page redirects immediately
The session hasn't loaded yet. The fix is already in place — the page waits for `session !== undefined` before checking the role.

### Suggestions not appearing in Admin Dashboard
- Check that you're logged in as admin
- The `/api/suggestions` endpoint returns 401 for non-admins
- If the list is empty, no one has submitted suggestions yet

### Build fails on Vercel
- Check Vercel build logs
- Most common cause: TypeScript errors or missing env variables
- Make sure all env vars from `.env.local` are added in Vercel → Settings → Environment Variables

### MongoDB connection fails
- Check `MONGODB_URI` is correct
- Make sure your IP is whitelisted in MongoDB Atlas (or use `0.0.0.0/0` for all IPs)

---

## 📦 Git Workflow

```bash
# See what changed
git status

# Stage all changes
git add -A

# Commit
git commit -m "feat: your description here"

# Push to GitHub (triggers Vercel deploy)
git push
```

**Vercel auto-deploys** whenever you push to `main`.

---

## 🔮 Known Incomplete Features / TODOs

| Feature | Status | Notes |
|---|---|---|
| Streak tracking | Hardcoded to 3 days | `UserProgress` model has `lastActive` but no daily activity log |
| NoteCard completion indicator | Always shows unchecked | `isCompleted` is hardcoded `false` in `NoteCard.tsx` — would need to pass progress data down |
| `data/suggestions.json` | Empty, unused | Old file-based system. MongoDB is used now. Safe to delete eventually. |
| Profile page (`/profile`) | Linked in navbar dropdown but may not exist | Check `app/profile/` |
| `@google/generative-ai` package | Installed but unused | Was likely planned for AI features |

---

## 📂 Files That Are Safe to Delete

- `Notes_Images/` — Original handwritten note photos. Already transcribed. Not used by the app.
- `temp_links_full.txt` — Temporary file used during data entry
- `AUDIT.md`, `CONSISTENCY_FIXES_COMPLETE.md`, `designflow.md` — Old working notes
- `data/raw_notes_seed.json` — Raw data before processing
- `data/suggestions.json` — Empty, replaced by MongoDB

---

*Last updated: February 2026. Written by reading every source file in the project.*
