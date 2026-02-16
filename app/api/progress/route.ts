import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { UserProgress, NoteModel } from '@/lib/models';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        let progress = await UserProgress.findOne({ email: session.user.email });

        if (!progress) {
            // First time user? Create empty progress.
            progress = await UserProgress.create({ email: session.user.email, completedNotes: [] });
        }

        // Return list of completed IDs
        return NextResponse.json({ completed: progress.completedNotes });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { noteId, completed } = await request.json();
    if (!noteId) {
        return NextResponse.json({ error: 'Missing noteId' }, { status: 400 });
    }

    await dbConnect();

    try {
        let progress = await UserProgress.findOne({ email: session.user.email });

        if (!progress) {
            progress = await UserProgress.create({
                email: session.user.email,
                completedNotes: completed ? [noteId] : []
            });
        } else {
            if (completed) {
                // Add if not exists (Set behavior)
                if (!progress.completedNotes.includes(noteId)) {
                    progress.completedNotes.push(noteId);
                }
            } else {
                // Remove
                progress.completedNotes = progress.completedNotes.filter((id: string) => id !== noteId);
            }
            progress.lastActive = new Date();
            await progress.save();
        }

        return NextResponse.json({ completed: progress.completedNotes });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
