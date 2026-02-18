import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { UserProgress } from '@/lib/models';

export async function GET() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectDB();
        // Fetch all users, sorted by Last Active (most recent first)
        const users = await UserProgress.find({}, { email: 1, lastActive: 1, _id: 0 })
            .sort({ lastActive: -1 })
            .lean();

        return NextResponse.json(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
