import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingMatches } from '@/lib/api-football';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');
    
    const matches = await getUpcomingMatches(days);
    return NextResponse.json({ matches });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    console.error('Get upcoming matches error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar partidas' },
      { status: 500 }
    );
  }
}
