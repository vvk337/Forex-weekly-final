const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const username = "@karanm";
  console.log(`[DELETE] Starting complete removal of user ${username}...`);
  const user = await prisma.user.findUnique({
    where: { username }
  });
  if (!user) {
    console.log(`[DELETE] User ${username} not found!`);
    return;
  }
  // Delete Notification settings
  await prisma.notificationSetting.deleteMany({
    where: { userId: user.id }
  });
  // Delete notifications
  await prisma.notification.deleteMany({
    where: { username }
  });
  // Delete user
  await prisma.user.delete({
    where: { id: user.id }
  });
  console.log(`[DELETE] User ${username} removed successfully.`);
}
main();
