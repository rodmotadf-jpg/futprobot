import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const totalUsers = await prisma.user.count();
    
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE' },
    });

    const totalAnalyses = await prisma.analysis.count();

    const results = await prisma.result.findMany();
    const wins = results.filter(r => r.status === 'WIN').length;
    const losses = results.filter(r => r.status === 'LOSS').length;
    const globalWinRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        activeSubscriptions,
        totalAnalyses,
        globalWinRate: parseFloat(globalWinRate.toFixed(2)),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
