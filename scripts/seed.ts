import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const passwordHash = await bcrypt.hash('Teste@123', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'teste@sportbot.com' },
    update: {},
    create: {
      email: 'teste@sportbot.com',
      name: 'Usuário Teste',
      passwordHash,
      role: 'USER',
      subscription: {
        create: {
          status: 'ACTIVE',
          planType: 'PREMIUM',
          price: 97.00,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sportbot.com' },
    update: {},
    create: {
      email: 'admin@sportbot.com',
      name: 'Administrador',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      subscription: {
        create: {
          status: 'ACTIVE',
          planType: 'PREMIUM',
          price: 97.00,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  console.log('✅ Usuários criados:');
  console.log('');
  console.log('👤 Usuário Teste:');
  console.log('   Email: teste@sportbot.com');
  console.log('   Senha: Teste@123');
  console.log('   Role: USER');
  console.log('');
  console.log('🔐 Usuário Admin:');
  console.log('   Email: admin@sportbot.com');
  console.log('   Senha: Admin@123');
  console.log('   Role: ADMIN');
  console.log('');
  console.log('✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
