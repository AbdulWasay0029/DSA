import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { NoteModel } from '@/lib/models';
import fs from 'fs/promises';
import path from 'path';

// WARNING: This route is for one-time initialization only. 
// It should be disabled or protected in production.

export async function GET() {
    try {
        await dbConnect();

        // Count existing
        const count = await NoteModel.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: 'Database already has data. Skipping seed.', count });
        }

        const filePath = path.join(process.cwd(), 'data', 'notes.json');
        const fileData = await fs.readFile(filePath, 'utf-8');
        const jsonNotes = JSON.parse(fileData);

        if (!Array.isArray(jsonNotes)) {
            return NextResponse.json({ error: 'Invalid JSON data' });
        }

        // Insert
        await NoteModel.insertMany(jsonNotes);

        return NextResponse.json({ success: true, message: `Seeded ${jsonNotes.length} notes.` });

    } catch (e) {
        return NextResponse.json({ error: e.toString() }, { status: 500 });
    }
}
