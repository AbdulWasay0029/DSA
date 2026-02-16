import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { LinkModel } from '@/lib/models';
import linksData from '@/data/links.json';

async function seedLinks() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
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

export async function GET() {
    return seedLinks();
}

export async function POST() {
    return seedLinks();
}
