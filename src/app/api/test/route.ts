import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const logPath = path.join(process.cwd(), 'server-test.log');
        fs.appendFileSync(logPath, 'Test route called\n');

        const userCount = await prisma.user.count();
        const linkCount = await prisma.link.count();
        fs.appendFileSync(logPath, `User count: ${userCount}, Link count: ${linkCount}\n`);

        return NextResponse.json({ status: 'ok', userCount, linkCount });
    } catch (error) {
        const logPath = path.join(process.cwd(), 'server-test.log');
        fs.appendFileSync(logPath, `Error: ${error}\n`);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
