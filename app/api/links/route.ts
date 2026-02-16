import { NextResponse } from 'next/server';
import { getLinks, saveLinks, LinkItem } from '@/lib/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const links = await getLinks();
    return NextResponse.json(links);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const links = await getLinks();

    const newLink: LinkItem = {
        id: Date.now().toString(),
        ...body
    };

    links.push(newLink);
    await saveLinks(links);

    return NextResponse.json(newLink);
}

export async function PUT(req: Request) { // Update
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const links = await getLinks();
    const index = links.findIndex(l => l.id === body.id);

    if (index !== -1) {
        links[index] = { ...links[index], ...body };
        await saveLinks(links);
        return NextResponse.json(links[index]);
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || 'visitor';

    if (role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    let links = await getLinks();
    links = links.filter(l => l.id !== id);
    await saveLinks(links);

    return NextResponse.json({ success: true });
}
