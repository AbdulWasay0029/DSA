# Implementation Plan - Consistency Fixes

## Phase 1: Add Missing Fields to Edit Page ✅

### 1.1 Add Description Field (Short Summary)
**Location:** After title, before fullDescription
```tsx
<input
    className={styles.input}
    value={data.description || ''}
    onChange={e => setEditData({ ...data, description: e.target.value })}
    placeholder="Short summary (shown on card)..."
/>
```

### 1.2 Add Tips Editor
**Location:** After fullDescription, before solutions
```tsx
{isEditing && (
    <div className={styles.tipsSection}>
        <h3>💡 Tips & Tricks</h3>
        {data.tips?.map((tip, i) => (
            <div key={i}>
                <input value={tip} onChange={...} />
                <button onClick={deleteTip}>×</button>
            </div>
        ))}
        <button onClick={addTip}>+ Add Tip</button>
    </div>
)}
```

### 1.3 Add Examples Editor
**Location:** After tips, before solutions
```tsx
{isEditing && (
    <div className={styles.examplesSection}>
        <h3>📝 Examples</h3>
        {data.examples?.map((ex, i) => (
            <div key={i}>
                <input placeholder="Input" value={ex.input} onChange={...} />
                <input placeholder="Output" value={ex.output} onChange={...} />
                <textarea placeholder="Explanation" value={ex.explanation} onChange={...} />
                <button onClick={deleteExample}>×</button>
            </div>
        ))}
        <button onClick={addExample}>+ Add Example</button>
    </div>
)}
```

### 1.4 Add Complexity Fields
**Location:** In each solution editor
```tsx
<input placeholder="Time Complexity" value={sol.complexity?.time} onChange={...} />
<input placeholder="Space Complexity" value={sol.complexity?.space} onChange={...} />
```

---

## Phase 2: Add Missing Fields to Create Page ✅

### 2.1 Add Difficulty Dropdown
**Location:** After title, before description
```tsx
<select value={data.difficulty || 'Medium'} onChange={...}>
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
</select>
```

### 2.2 Add Category/Date Input
**Location:** After difficulty
```tsx
<input 
    type="text"
    placeholder="DD/MM/YYYY"
    value={data.category || ''}
    onChange={e => setData({ ...data, category: e.target.value })}
/>
```

---

## Phase 3: Enhance NoteCard ✅

### 3.1 Add Description
```tsx
{note.description && (
    <p className={styles.description}>{note.description}</p>
)}
```

### 3.2 Add Tags (2-3 chips)
```tsx
{note.tags && note.tags.length > 0 && (
    <div className={styles.tags}>
        {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
        ))}
    </div>
)}
```

---

## Phase 4: Clean Up ✅

### 4.1 Delete Temporary Files
- Delete `/app/api/migrate-difficulty/route.ts`

### 4.2 Update Note Interface (if needed)
Ensure all fields are properly typed

---

## Files to Modify:

1. ✅ `/app/notes/[id]/page.tsx` - Add description, tips, examples, complexity to edit mode
2. ✅ `/app/notes/create/page.tsx` - Add difficulty, category
3. ✅ `/components/NoteCard.tsx` - Add description, tags
4. ✅ `/components/NoteCard.module.css` - Add styles for description, tags
5. ❌ Delete `/app/api/migrate-difficulty/route.ts`

---

## Execution Steps:

1. Phase 1.1 - Add description to edit page
2. Phase 1.2 - Add tips editor to edit page
3. Phase 1.3 - Add examples editor to edit page
4. Phase 1.4 - Add complexity to solution editor
5. Phase 2.1 - Add difficulty to create page
6. Phase 2.2 - Add category to create page
7. Phase 3.1 - Add description to NoteCard
8. Phase 3.2 - Add tags to NoteCard
9. Phase 4 - Clean up and delete temporary files

**Total: 9 steps across 4 phases**

Starting execution now...
