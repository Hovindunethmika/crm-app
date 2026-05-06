const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashed,
      name: 'Admin User',
    },
  });

  console.log('✅ Seed complete — admin@example.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());