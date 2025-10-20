import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();

    const totalAnalyses = await prisma.analysis.count({
      where: { userId: user.id },
    });

    const results = await prisma.result.findMany({
      where: { userId: user.id },
    });

    const wins = results.filter(r => r.status === 'WIN').length;
    const losses = results.filter(r => r.status === 'LOSS').length;
    const pending = results.filter(r => r.status === 'PENDING').length;

    const totalProfit = results.reduce((sum, r) => sum + r.profit, 0);

    const winRate = totalAnalyses > 0 ? (wins / (wins + losses)) * 100 : 0;

    return NextResponse.json({
      stats: {
        totalAnalyses,
        wins,
        losses,
        pending,
        winRate: parseFloat(winRate.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
