import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { NoteModel } from '@/lib/models';
import rawNotes from '@/data/raw_notes_seed.json';

// Helper function to normalize titles for grouping
function normalizeTitle(title: string) {
    return title.toLowerCase().trim().replace(/['"’]/g, '').replace(/\s+/g, ' ');
}

// Helper to infer tags from content
function inferTags(title: string, notes: string) {
    const text = (title + " " + notes).toLowerCase();
    const tags = new Set<string>();

    if (text.includes('bit') || text.includes('binary')) tags.add('Bit Manipulation');
    if (text.includes('recursion') || text.includes('hanoi')) tags.add('Recursion');
    if (text.includes('array') || text.includes('subarray')) tags.add('Arrays');
    if (text.includes('string') || text.includes('anagram') || text.includes('palindrome') || text.includes('char')) tags.add('Strings');
    if (text.includes('sort') || text.includes('merge')) tags.add('Sorting');
    if (text.includes('search')) tags.add('Searching');
    if (text.includes('stack') || text.includes('queue') || text.includes('parenthesis')) tags.add('Stack/Queue');
    if (text.includes('math') || text.includes('prime') || text.includes('gcd') || text.includes('divisor') || text.includes('power')) tags.add('Mathematics');
    if (text.includes('matrix') || text.includes('2d')) tags.add('Matrix');
    if (text.includes('tree') || text.includes('graph')) tags.add('Graph/Tree');
    if (text.includes('backtrack') || text.includes('nqueens') || text.includes('partitioning')) tags.add('Backtracking');
    if (text.includes('hashing') || text.includes('map')) tags.add('Hashing');
    if (text.includes('pointer')) tags.add('Two Pointers');

    return Array.from(tags);
}

export async function GET() {
    return seedNotes();
}

async function seedNotes() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }

    await connectDB();

    // Grouping Logic
    const groupedNotes = new Map();

    for (const item of rawNotes) {
        // Create a unique key based on Date + Normalized Title
        // "13/08/2025" + "apowern"
        const key = `${item.date}|${normalizeTitle(item.title)}`;

        if (groupedNotes.has(key)) {
            const existing = groupedNotes.get(key);
            // Append notes
            if (item.notes) {
                existing.notes += `\n- Variation: ${item.notes}`;
            }
            existing.grouped = true;
        } else {
            groupedNotes.set(key, {
                title: item.title, // Keep original title casing from first occurrence
                date: item.date,
                notes: item.notes ? `- ${item.notes}` : '',
                grouped: false
            });
        }
    }

    // Prepare for DB
    const dbOperations = [];
    const createdNotes = [];

    for (const [key, data] of Array.from(groupedNotes.entries())) {
        const id = key.replace(/\|/g, '-').replace(/\//g, '').replace(/\s+/g, '-');
        const tags = inferTags(data.title, data.notes);

        // Extract difficulty from tags and set as separate field
        const difficulty = tags.find(t => ['Easy', 'Medium', 'Hard'].includes(t)) || 'Medium';
        const topicTags = tags.filter(t => !['Easy', 'Medium', 'Hard'].includes(t));

        let description = data.notes;
        if (data.grouped) {
            description = `**Grouped Variations:**\n${data.notes}`;
            topicTags.push('Variations'); // Add 'Variations' to topic tags
        }

        const noteData = {
            id,
            title: data.title,
            description: description || 'No initial notes provided.',
            category: data.date,
            fullDescription: data.notes, // Original full notes for detailed view
            difficulty,
            tags: topicTags, // Only topic tags, not difficulty
            solutions: [], // New field for solutions
            createdAt: new Date(),
            updatedAt: new Date()
        };

        dbOperations.push(
            NoteModel.findOneAndUpdate(
                { id: id },
                noteData,
                { upsert: true, new: true }
            )
        );
        createdNotes.push(noteData);
    }

    await Promise.all(dbOperations);

    return NextResponse.json({
        success: true,
        message: `Processed ${rawNotes.length} raw entries into ${createdNotes.length} unique notes (merged duplicates).`,
        sample: createdNotes.slice(0, 3)
    });
}
