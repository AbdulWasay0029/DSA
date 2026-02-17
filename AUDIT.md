# SmartInterviews Platform Audit

## 🔴 CRITICAL ISSUES

### 1. **Inconsistent Fields Between Create & Edit**
**Problem:** Create page has more fields than Edit page
- **Create page has:** description (short summary), tips, tags, complexity, examples
- **Edit page has:** Only title, fullDescription, difficulty, category, tags, solutions
- **Missing in Edit:** description, tips, examples, complexity

**Fix Needed:** Make edit page match create page exactly

### 2. **Unused Fields on NoteCard**
**Problem:** NoteCard doesn't show `description` field (short summary)
- Create page asks for "Short summary (shown on card)"
- NoteCard only shows: title, difficulty, solution count
- **NOT showing:** description, tags, category/date

**Fix Needed:** Add description to NoteCard

### 3. **Field Inconsistencies**

| Field | Note Interface | Create Page | Edit Page | NoteCard | Detail View |
|-------|---------------|-------------|-----------|----------|-------------|
| title | ✅ | ✅ | ✅ | ✅ | ✅ |
| description | ✅ | ✅ | ❌ | ❌ | ❌ |
| fullDescription | ✅ | ✅ | ✅ | ❌ | ✅ |
| difficulty | ✅ | ❌ | ✅ | ✅ | ✅ |
| category | ✅ | ❌ | ✅ | ❌ | ✅ |
| tags | ✅ | ✅ | ✅ | ❌ | ✅ |
| tips | ✅ | ✅ | ❌ | ❌ | ✅ |
| examples | ✅ | ❌ | ❌ | ❌ | ❌ |
| complexity | ✅ | ✅ | ❌ | ❌ | ❌ |
| solutions | ✅ | ✅ | ✅ | count only | ✅ |

## 📁 FILES TO REVIEW

### Pages
1. `/app/notes/create/page.tsx` - Create new note
2. `/app/notes/[id]/page.tsx` - View/Edit note
3. `/app/notes/page.tsx` - List all notes
4. `/app/admin/page.tsx` - Admin dashboard
5. `/app/admin/review/[id]/page.tsx` - Review suggestions
6. `/app/links/page.tsx` - Links library
7. `/app/progress/page.tsx` - Progress tracking
8. `/app/login/page.tsx` - Login
9. `/app/settings/page.tsx` - Settings (unused?)

### Components
1. `/components/NoteCard.tsx` - Note preview card
2. `/components/RichTextToolbar.tsx` - Markdown helper
3. `/components/SimpleMarkdown.tsx` - Markdown renderer
4. `/components/Navbar.tsx` - Navigation
5. `/components/Footer.tsx` - Footer with disclaimer

### API Routes
1. `/api/notes/route.ts` - CRUD for notes
2. `/api/suggestions/route.ts` - User suggestions
3. `/api/suggestions/resolve/route.ts` - Approve/reject
4. `/api/progress/route.ts` - User progress
5. `/api/seed-notes/route.ts` - Seed notes data
6. `/api/seed-links/route.ts` - Seed links data
7. `/api/migrate-difficulty/route.ts` - **TEMPORARY - Can delete**

## 🗑️ FILES TO DELETE (Pending Approval)

### Temporary/Migration Files
- `/api/migrate-difficulty/route.ts` - One-time migration, no longer needed

### Potentially Unused
- `/app/settings/page.tsx` - Is this used? If not, delete

## ✅ PROPOSED FIXES

### Fix 1: Standardize Create & Edit Forms
**Action:** Make both forms identical with all fields:
- Title
- Description (short summary for card)
- Difficulty (dropdown)
- Category (date)
- Tags (chip selector)
- Full Description (markdown)
- Tips (list)
- Examples (input/output pairs)
- Solutions (with complexity)

### Fix 2: Enhance NoteCard
**Action:** Show more info on card:
- Title ✅ (already there)
- **Description** (add this - short summary)
- Difficulty ✅ (already there)
- **Tags** (add 2-3 main tags)
- **Category/Date** (add this)
- Solution count ✅ (already there)

### Fix 3: Add Missing Fields to Edit
**Action:** Add to edit mode:
- Description input
- Tips editor
- Examples editor
- Complexity fields

### Fix 4: Clean Up Unused Files
**Action:** Delete:
- migrate-difficulty route (temporary)
- settings page (if unused)

## 🎯 QUESTIONS FOR YOU

1. **Settings page** - Do you want to keep `/app/settings/page.tsx`? What should it do?
2. **Examples field** - Do you want to add input/output examples to notes?
3. **Complexity field** - Do you want time/space complexity shown on cards or detail page?
4. **NoteCard design** - Should it show description + tags, or keep it minimal?
5. **Tips** - Should tips be editable in edit mode?

## 📋 IMPLEMENTATION PLAN

### Phase 1: Fix Edit Page
1. Add description field
2. Add tips editor
3. Add examples editor (if you want)
4. Add complexity fields (if you want)

### Phase 2: Fix NoteCard
1. Add description display
2. Add tags display (2-3 chips)
3. Add date/category display

### Phase 3: Standardize Create Page
1. Add difficulty dropdown
2. Add category/date input
3. Match edit page exactly

### Phase 4: Clean Up
1. Delete temporary files
2. Remove unused code
3. Update documentation

---

**Please review and answer the questions above so I can proceed with fixes!**
