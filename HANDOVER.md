# 📘 SmartInterviews / AlgoStream - Project Handover Manual

## 🚀 Overview
This is a **Next.js 14** web application designed to be a comprehensive DSA (Data Structures & Algorithms) learning platform. It features:
- **Curriculum Tracking**: Users can mark problems as completed.
- **Note Taking**: Rich text + Markdown notes for each problem.
- **Progress Dashboard**: Visualizes study streaks and topic mastery.
- **Resource Library**: Curated links to external LeetCode/GFG problems.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), React, CSS Modules.
- **Backend**: Next.js API Routes (`app/api/*`).
- **Database**: MongoDB (via Mongoose).
- **Auth**: NextAuth.js (Google & GitHub providers).

---

## ⚡ Quick Start

### 1. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 2. Environment Variables (`.env`)
You need a `.env` file in the root directory with:
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
```

---

## 👑 Admin Features & Troubleshooting

If you are logged in as an **Admin** (role set in MongoDB or hardcoded for dev), you have access to special tools.

### 1. The Admin Dashboard (`/admin`)
Access via the **User Menu > Admin** or directly at `/admin`.
- **Note Manager**: View internal IDs and delete broken notes.
- **Create Note**: Add new content to the curriculum.
- **Re-Seed Links**: Force-reset the "Links" page from the JSON file.

### 2. Fixing "Note Not Found" Errors
If a note appears in the list but clicks through to a 404 error:
1.  Go to **[Admin Note Manager](/admin/notes)**.
2.  Look for the note with the broken link.
3.  You will likely see a red **"BROKEN ID!"** status.
4.  Click **Delete**.
5.  Re-create the note correctly if needed.

### 3. "Failed to Delete Note"
If deleting fails via the UI, it's usually because the custom ID is missing. The Admin Dashboard now supports deleting by **MongoDB ID (`_id`)** as a fallback, so it should work 99% of the time.

---

## 📂 Project Structure

- **`app/`**: All pages and API routes.
  - `admin/`: Admin-only tools.
  - `api/`: Backend logic (Database connections, CRUD).
  - `notes/`: Main curriculum pages (List + Detail view).
  - `progress/`: User dashboard.
- **`components/`**: Reusable UI parts (`Navbar`, `NoteCard`, `Editor`).
- **`data/`**: Seed data and static types.
  - `notes.ts`: **The Source of Truth** for TypeScript interfaces.
  - `notes.json` & `links.json`: Seed data used to populate the DB initially.
- **`lib/`**: Helpers.
  - `db.ts`: MongoDB connection.
  - `models.ts`: Mongoose schemas.

---

## 📦 Managing Data

### Seeding (Resetting DB)
If you want to wipe the database and start fresh with default data:
- **Notes**: Call `/api/seed` (or click "Seed" if available on empty state).
- **Links**: Go to `/admin` and click **"Re-Seed Links"**.

### Adding New Notes
- Use the UI: `/notes/create`
- Do **NOT** edit `notes.json` manually for active data; that file is only for initialization.

---

## 🔧 Git Guide (How to Save Changes)

If you modify code, here is how to save it to GitHub:

1.  **Check Status** (See what changed):
    ```bash
    git status
    ```

2.  **Add Changes** (Stage files):
    ```bash
    git add .
    ```

3.  **Commit** (Save snapshot):
    ```bash
    git commit -m "Description of what you changed"
    ```

4.  **Push** (Upload to GitHub/Vercel):
    ```bash
    git push
    ```

---

## 🚀 Deployment (Vercel)
This project is set up to deploy automatically to Vercel whenever you `git push` to `main`.
- **Builds**: Check Vercel dashboard for logs if site breaks.
- **Environment**: Make sure Vercel "Settings > Environment Variables" match your local `.env`.
