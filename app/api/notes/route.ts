import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { NoteModel } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    await dbConnect();
    try {
        // Sort by 'date' if available, otherwise 'createdAt'. Both descending.
        const notes = await NoteModel.find({}).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(notes);
    } catch (e: any) {
        console.error("Database API Error:", e);
        return NextResponse.json({ error: 'Failed to fetch notes: ' + e.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    // Check if user is admin
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    try {
        // Ensure ID is present
        const id = body.id || Date.now().toString();
        const newNote = await NoteModel.create({ ...body, id });
        return NextResponse.json(newNote);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create note' + e }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    try {
        const updated = await NoteModel.findOneAndUpdate({ id: body.id }, body, { new: true });
        if (!updated) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Try to get ID from Query String first
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    // Fallback to Body if no query param
    if (!id) {
        try {
            const body = await request.json();
            id = body.id;
        } catch (e) {
            // Body might be empty
        }
    }

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        const deleted = await NoteModel.findOneAndDelete({ id });
        if (!deleted) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, deletedId: id });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}

