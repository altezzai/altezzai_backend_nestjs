import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('📡 Connecting to database...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const email = 'admin@altezzai.com';

  const existing = await prisma.user.findMany();
  console.log('👥 Existing users:', existing);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    console.log('⚠️ Admin already exists, skipping create');
    return;
  }

  const password = await bcrypt.hash('Admin@#0702', 10);

  const created = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      password,
    },
  });

  console.log('✅ Admin created:', created);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 DB disconnected');
  });
