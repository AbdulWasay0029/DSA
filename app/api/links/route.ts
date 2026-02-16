import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { LinkModel } from '@/lib/models';

export async function GET() {
    await connectDB();
    const links = await LinkModel.find({}).sort({ category: -1 }).lean();
    return NextResponse.json(links);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const newLink = await LinkModel.create({
        id: Date.now().toString(),
        ...body
    });

    return NextResponse.json(newLink);
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const updated = await LinkModel.findOneAndUpdate(
        { id: body.id },
        body,
        { new: true }
    );

    if (!updated) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await req.json();

    const deleted = await LinkModel.findOneAndDelete({ id });

    if (!deleted) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
