import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { analyzePrediction } from '@/lib/api-football';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { match } = body;

    if (!match) {
      return NextResponse.json(
        { error: 'Dados da partida são obrigatórios' },
        { status: 400 }
      );
    }

    const prediction = await analyzePrediction(match);

    const analysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        fixtureId: match.fixture.id,
        league: match.league.name,
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        prediction: prediction.prediction,
        odds: prediction.odds,
        confidence: prediction.confidence,
        matchDate: new Date(match.fixture.date),
        reasoning: prediction.reasoning,
      },
    });

    await prisma.result.create({
      data: {
        analysisId: analysis.id,
        userId: user.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ analysis, prediction });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    console.error('Create analysis error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar análise' },
      { status: 500 }
    );
  }
}
