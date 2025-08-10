import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL || 'admin@example.com';
  const password = process.env.SEED_USER_PASSWORD || 'admin123';
  const name = process.env.SEED_USER_NAME || 'Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Seed user exists:', email);
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name,
      role: 'admin',
      passwordHash: hash,
    }
  });
  console.log('Seed user created:', email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
