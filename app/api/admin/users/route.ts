import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      include: {
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ 
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        subscription: u.subscription,
      }))
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}
