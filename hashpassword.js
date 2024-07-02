const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function hashPasswords() {
  const users = await prisma.user.findMany();
  
  for (const user of users) {
    if (!user.password.startsWith('$2b$')) { // Check if the password is already hashed
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }
  }

  console.log('Passwords hashed successfully');
  prisma.$disconnect();
}

hashPasswords().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
