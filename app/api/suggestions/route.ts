import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { SuggestionModel } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    // Only admins can see suggestions list
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const suggestions = await SuggestionModel.find({ status: 'pending' }).sort({ submittedAt: -1 });
    return NextResponse.json(suggestions);
}

export async function POST(request: Request) {
    // Anyone (even visitors) can create a suggestion
    // Ideally we should require at least a log in to prevent spam, but for "Visitor" mode without forced login it's fine.
    // Ideally we track who submitted it.

    // Let's grab session if available to tag the submitter
    const session = await getServerSession(authOptions);
    const submittedBy = session?.user?.email || 'Anonymous';

    await dbConnect();
    const body = await request.json();

    try {
        const suggestionId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        const newSuggestion = await SuggestionModel.create({
            ...body,
            suggestionId,
            status: 'pending',
            submittedBy
        });
        return NextResponse.json(newSuggestion);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create suggestion' }, { status: 500 });
    }
}
