# AlgoStream - Complete File Structure & Troubleshooting Guide
**Private Documentation - For Project Maintenance**

---

## 📁 Complete File Structure

```
SmartInterviews/
├── .next/                          # Next.js build output (auto-generated, don't edit)
├── .git/                           # Git version control (auto-managed)
├── node_modules/                   # Dependencies (auto-installed)
│
├── app/                            # Next.js App Router (main application)
│   ├── globals.css                 # Global styles (dark theme, CSS variables)
│   ├── layout.tsx                  # Root layout (wraps all pages, includes Navbar/Footer)
│   ├── page.tsx                    # Home/Landing page
│   ├── page.module.css             # Home page styles
│   │
│   ├── api/                        # Backend API routes (serverless functions)
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler (auto-generated)
│   │   ├── notes/route.ts          # CRUD for problems (GET, POST, PUT)
│   │   ├── progress/route.ts       # User progress tracking (GET, POST)
│   │   ├── suggestions/route.ts    # Community suggestions (GET, POST, DELETE)
│   │   └── seed/route.ts           # Admin data seeding (POST)
│   │
│   ├── notes/                      # Notes/Problems section
│   │   ├── page.tsx                # Curriculum list (all problems)
│   │   ├── page.module.css         # Curriculum list styles
│   │   ├── [id]/                   # Dynamic route for individual problem
│   │   │   ├── page.tsx            # Problem detail view
│   │   │   └── page.module.css     # Problem detail styles
│   │   └── create/                 # Create new problem
│   │       ├── page.tsx            # Create/edit form
│   │       └── page.module.css     # Create form styles
│   │
│   ├── links/                      # Resource library
│   │   ├── page.tsx                # Links page
│   │   └── page.module.css         # Links page styles
│   │
│   ├── progress/                   # User dashboard
│   │   ├── page.tsx                # Progress/stats page
│   │   └── page.module.css         # Progress page styles
│   │
│   └── login/                      # Authentication
│       ├── page.tsx                # Login page
│       └── page.module.css         # Login page styles
│
├── components/                     # Reusable React components
│   ├── Navbar.tsx                  # Top navigation bar
│   ├── Navbar.module.css           # Navbar styles
│   ├── Footer.tsx                  # Footer with social links
│   ├── Footer.module.css           # Footer styles
│   ├── NoteCard.tsx                # Problem card component
│   ├── NoteCard.module.css         # Card styles
│   ├── SimpleMarkdown.tsx          # Markdown renderer
│   └── RichTextToolbar.tsx         # Markdown editor toolbar
│
├── lib/                            # Utility libraries
│   ├── auth.ts                     # NextAuth configuration
│   ├── db.ts                       # MongoDB connection
│   └── models.ts                   # Mongoose schemas (Note, Suggestion, UserProgress)
│
├── data/                           # Static data files
│   ├── notes.ts                    # TypeScript types for notes
│   ├── notes.json                  # Seed data for notes (if needed)
│   ├── links.ts                    # Resource links data
│   └── suggestions.json            # Suggestions storage (if not using DB)
│
├── public/                         # Static assets (images, fonts, etc.)
│
├── .env.local                      # Environment variables (NEVER commit this!)
├── .gitignore                      # Files to ignore in Git
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
├── README.md                       # Public project documentation
├── HANDOVER.md                     # COMPLETE project manual (Read this!)
└── PROJECT_STRUCTURE.md            # This file (file tree & flows)
```

---

## 🔗 File Dependencies & Connections

### **Authentication Flow**
```
User clicks "Sign In" 
  → app/login/page.tsx 
  → lib/auth.ts (NextAuth config)
  → Google OAuth
  → app/api/auth/[...nextauth]/route.ts
  → Session created (JWT)
  → User redirected to /notes
```

**Files involved:**
- `lib/auth.ts` - Auth configuration
- `app/login/page.tsx` - Login UI
- `.env.local` - Google OAuth credentials
- `app/layout.tsx` - SessionProvider wrapper

---

### **Progress Tracking Flow**
```
User marks problem complete
  → app/notes/[id]/page.tsx (toggleCompletion function)
  → POST /api/progress
  → app/api/progress/route.ts
  → lib/models.ts (UserProgress schema)
  → lib/db.ts (MongoDB connection)
  → MongoDB Atlas (cloud database)
  → Response sent back
  → UI updates in real-time
```

**Files involved:**
- `app/notes/[id]/page.tsx` - UI logic
- `app/api/progress/route.ts` - API handler
- `lib/models.ts` - Database schema
- `lib/db.ts` - DB connection
- `.env.local` - MongoDB URI

---

### **Problem Creation Flow**
```
Admin clicks "New Problem"
  → app/notes/create/page.tsx
  → User fills form
  → POST /api/notes (if admin) or POST /api/suggestions (if visitor)
  → app/api/notes/route.ts or app/api/suggestions/route.ts
  → lib/models.ts (Note or Suggestion schema)
  → MongoDB
  → Redirect to /notes
```

**Files involved:**
- `app/notes/create/page.tsx` - Create form
- `app/api/notes/route.ts` - Admin publish
- `app/api/suggestions/route.ts` - Visitor suggest
- `lib/models.ts` - Schemas
- `lib/auth.ts` - Role check

---

### **Styling System**
```
Global styles (app/globals.css)
  ↓
CSS Variables (--primary, --background, etc.)
  ↓
Component-specific styles (*.module.css)
  ↓
Rendered in browser
```

**Key files:**
- `app/globals.css` - Base styles, CSS variables, dark theme
- `*.module.css` - Scoped component styles
- No external CSS framework (pure CSS)

---

## 🛠️ Common Issues & Fixes

### **1. "Module not found" errors**
**Symptom:** `Error: Cannot find module '@/components/Navbar'`

**Cause:** Missing dependency or incorrect import path

**Fix:**
```bash
# Install dependencies
npm install

# Clear cache and rebuild
rm -rf .next
npm run dev
```

**Check:** `tsconfig.json` should have:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### **2. Database connection fails**
**Symptom:** `MongooseError: Connection failed`

**Cause:** 
- Wrong `MONGODB_URI` in `.env.local`
- IP not whitelisted in MongoDB Atlas
- Network issue

**Fix:**
1. Check `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   ```
2. Go to MongoDB Atlas → Network Access → Add your IP (or `0.0.0.0/0` for all)
3. Restart dev server: `npm run dev`

**Test connection:**
```bash
# Add this to lib/db.ts temporarily
console.log('MongoDB URI:', process.env.MONGODB_URI);
```

---

### **3. Google OAuth login fails**
**Symptom:** "Error: redirect_uri_mismatch"

**Cause:** Redirect URI not configured in Google Cloud Console

**Fix:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Click your OAuth 2.0 Client ID
4. Add to "Authorized redirect URIs":
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-app.vercel.app/api/auth/callback/google` (production)
5. Save and wait 5 minutes for changes to propagate

**Check `.env.local`:**
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

---

### **4. Progress not saving**
**Symptom:** Mark complete works but resets on refresh

**Cause:** 
- API route not connected to database
- Session not available
- UserProgress model not created

**Debug:**
1. Open browser DevTools → Network tab
2. Click "Mark Complete"
3. Check if POST to `/api/progress` succeeds (200 status)
4. If 401: User not logged in
5. If 500: Check server logs

**Check API route:**
```typescript
// app/api/progress/route.ts
const session = await getServerSession(authOptions);
console.log('Session:', session); // Should show user email
```

---

### **5. Styles not applying**
**Symptom:** Page looks unstyled or broken

**Cause:**
- CSS module not imported correctly
- Global styles not loaded
- Build cache issue

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Check imports:**
```typescript
// ✅ Correct
import styles from './page.module.css';

// ❌ Wrong
import './page.module.css';
```

---

### **6. Build fails on Vercel**
**Symptom:** Deployment fails with TypeScript errors

**Cause:**
- Type errors in code
- Missing environment variables
- Dependency issues

**Fix:**
1. Run locally: `npm run build`
2. Fix all TypeScript errors
3. Check Vercel environment variables match `.env.local`
4. Redeploy

**Common type errors:**
```typescript
// ❌ Wrong
const user = session.user;
user.role // Error: Property 'role' does not exist

// ✅ Correct
const user = session.user as any;
user.role // Works
```

---

### **7. API routes return 404**
**Symptom:** `GET /api/notes` returns 404

**Cause:**
- File not named `route.ts`
- Not in `app/api/` directory
- Server not restarted

**Fix:**
```bash
# Ensure file structure:
app/api/notes/route.ts  ✅
app/api/notes.ts        ❌ (wrong)

# Restart server
npm run dev
```

---

### **8. Session not persisting**
**Symptom:** User logged out on page refresh

**Cause:**
- Missing `NEXTAUTH_SECRET`
- Wrong `NEXTAUTH_URL`
- Cookie issues

**Fix in `.env.local`:**
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000  # or your production URL
```

---

## 🔧 Environment Variables Explained

**`.env.local` (NEVER commit this file!)**

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/algostream?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000  # Change to production URL when deployed
NEXTAUTH_SECRET=your-random-secret-here  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here

# Admin Access
ADMIN_EMAILS=your@email.com,another@email.com  # Comma-separated
```

**Where to get these:**
- `MONGODB_URI`: MongoDB Atlas → Clusters → Connect → Connect your application
- `GOOGLE_CLIENT_ID/SECRET`: Google Cloud Console → APIs & Services → Credentials
- `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal
- `ADMIN_EMAILS`: Your own email addresses

---

## 📦 Dependencies Explained

**`package.json` key dependencies:**

```json
{
  "dependencies": {
    "next": "14.x",              // Framework
    "react": "18.x",             // UI library
    "next-auth": "^4.x",         // Authentication
    "mongoose": "^8.x",          // MongoDB ODM
    "framer-motion": "^11.x",    // Animations
    "react-syntax-highlighter": "^15.x"  // Code highlighting
  }
}
```

**If you need to reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check  # (if configured)

# Lint code
npm run lint
```

---

## 🔍 Debugging Checklist

**When something breaks:**

1. ✅ Check browser console for errors (F12 → Console)
2. ✅ Check terminal for server errors
3. ✅ Verify `.env.local` has all required variables
4. ✅ Restart dev server (`Ctrl+C` then `npm run dev`)
5. ✅ Clear Next.js cache (`rm -rf .next`)
6. ✅ Check MongoDB Atlas is accessible
7. ✅ Verify Google OAuth redirect URIs
8. ✅ Check if logged in (session exists)
9. ✅ Test API routes in Postman/Thunder Client
10. ✅ Check Git for recent changes (`git log`)

---

## 🌐 External Services Connected

### **1. MongoDB Atlas**
- **Purpose:** Database hosting
- **URL:** https://cloud.mongodb.com/
- **What it stores:** Notes, UserProgress, Suggestions
- **Cost:** Free tier (512MB)

### **2. Google Cloud Console**
- **Purpose:** OAuth authentication
- **URL:** https://console.cloud.google.com/
- **What it provides:** Client ID, Client Secret
- **Cost:** Free

### **3. Vercel**
- **Purpose:** Hosting & deployment
- **URL:** https://vercel.com/
- **What it does:** Auto-deploys from GitHub
- **Cost:** Free tier (100GB bandwidth)

### **4. GitHub**
- **Purpose:** Version control & CI/CD trigger
- **URL:** https://github.com/AbdulWasay0029/DSA
- **What it stores:** Source code (public)
- **Cost:** Free

---

## 🔐 Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ MongoDB has IP whitelist enabled
- ✅ Google OAuth has correct redirect URIs
- ✅ Admin emails are whitelisted
- ✅ API routes check session before mutations
- ✅ User input is sanitized (Markdown escaping)
- ✅ HTTPS enabled in production (Vercel auto)

---

## 📝 Quick Reference: File Purposes

| File | Purpose | Edit? |
|------|---------|-------|
| `app/globals.css` | Global styles, CSS variables | ✅ Yes |
| `app/layout.tsx` | Root layout, SessionProvider | ⚠️ Carefully |
| `lib/auth.ts` | NextAuth config, role logic | ⚠️ Carefully |
| `lib/db.ts` | MongoDB connection | ⚠️ Carefully |
| `lib/models.ts` | Database schemas | ⚠️ Carefully |
| `.env.local` | Secrets, API keys | ✅ Yes (locally) |
| `.gitignore` | Files to exclude from Git | ⚠️ Carefully |
| `package.json` | Dependencies, scripts | ⚠️ Carefully |
| `tsconfig.json` | TypeScript config | ❌ Rarely |
| `next.config.js` | Next.js config | ❌ Rarely |
| `.next/` | Build output | ❌ Never |
| `node_modules/` | Dependencies | ❌ Never |

---

## 🆘 Emergency Recovery

**If everything is broken:**

```bash
# 1. Stash changes
git stash

# 2. Go back to last working commit
git log  # Find last good commit hash
git reset --hard <commit-hash>

# 3. Reinstall dependencies
rm -rf node_modules .next
npm install

# 4. Restart server
npm run dev
```

**If database is corrupted:**
```bash
# Drop all collections (CAREFUL!)
# In MongoDB Atlas: Collections → Drop Database

# Re-seed data
# Visit: http://localhost:3000/notes
# Click "Seed Default Data" (admin only)
```

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **NextAuth Docs:** https://next-auth.js.org/
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **Vercel Support:** https://vercel.com/support

---

**Keep this file updated as you add features!** 🚀
