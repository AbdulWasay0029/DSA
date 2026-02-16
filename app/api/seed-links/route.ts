import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { LinkModel } from '@/lib/models';
import linksData from '@/data/links.json';

export async function POST() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Clear existing links
    await LinkModel.deleteMany({});

    // Insert all links from JSON
    await LinkModel.insertMany(linksData);

    return NextResponse.json({
        success: true,
        message: `Seeded ${linksData.length} links to database`
    });
}
