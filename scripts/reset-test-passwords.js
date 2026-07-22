const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.updateMany({
    where: {
      username: { in: ["user1", "user2"] }
    },
    data: {
      password: hash,
      forcePasswordChange: false // bypass force password change screen for easy testing
    }
  });
  console.log("[PASSWORDS] Reset passwords for user1 and user2 to 'admin123'.");
}
main();
