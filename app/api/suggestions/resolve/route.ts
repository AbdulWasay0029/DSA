import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { SuggestionModel, NoteModel } from '@/lib/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { suggestionId, action } = await request.json();
    await dbConnect();

    try {
        const suggestion = await SuggestionModel.findOne({ suggestionId });
        if (!suggestion) {
            return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
        }

        if (action === 'approve') {
            const { originalId, title, description, fullDescription, tags, tips, examples, solutions, id } = suggestion;
            const noteData = {
                title,
                description,
                fullDescription,
                tags,
                tips,
                examples,
                solutions
            };

            // Use originalId if it's an edit, otherwise use the suggestion's embedded ID or generate new
            const targetId = originalId || id || Date.now().toString();

            if (originalId) {
                // Update
                await NoteModel.findOneAndUpdate({ id: targetId }, noteData);
            } else {
                // Create
                await NoteModel.create({ ...noteData, id: targetId });
            }

            // Mark suggestion as approved
            suggestion.status = 'approved';
            await suggestion.save();
            // Or delete it? Let's keep it for record but filter by 'pending' in GET

            return NextResponse.json({ success: true, message: 'Approved' });

        } else if (action === 'reject') {
            suggestion.status = 'rejected';
            await suggestion.save();
            return NextResponse.json({ success: true, message: 'Rejected' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e) {
        return NextResponse.json({ error: 'Operation failed' + e }, { status: 500 });
    }
}
