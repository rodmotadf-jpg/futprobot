import { NextResponse } from 'next/server';
import { getTodayMatches } from '@/lib/api-football';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    const matches = await getTodayMatches();
    return NextResponse.json({ matches });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar partidas' },
      { status: 500 }
    );
  }
}
