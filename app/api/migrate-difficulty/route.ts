import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { NoteModel } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        // Get all notes
        const notes = await NoteModel.find({});
        let updated = 0;

        for (const note of notes) {
            // If note doesn't have difficulty field, set it
            if (!note.difficulty) {
                // Try to extract from tags first
                const diffTag = note.tags?.find((t: string) => ['Easy', 'Medium', 'Hard'].includes(t));
                const difficulty = diffTag || 'Medium';

                // Remove difficulty from tags if it exists
                const cleanTags = note.tags?.filter((t: string) => !['Easy', 'Medium', 'Hard'].includes(t)) || [];

                await NoteModel.findByIdAndUpdate(note._id, {
                    difficulty,
                    tags: cleanTags
                });
                updated++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Updated ${updated} notes with difficulty field`,
            total: notes.length
        });
    } catch (e: any) {
        return NextResponse.json({ error: 'Migration failed: ' + e.message }, { status: 500 });
    }
}
