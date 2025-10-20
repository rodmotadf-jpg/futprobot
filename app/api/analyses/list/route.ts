import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const analyses = await prisma.analysis.findMany({
      where: { userId: user.id },
      include: {
        result: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ analyses });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    console.error('List analyses error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar análises' },
      { status: 500 }
    );
  }
}
