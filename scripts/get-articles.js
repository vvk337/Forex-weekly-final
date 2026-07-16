const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      status: true,
      publishedAt: true
    },
    orderBy: { publishedAt: "desc" }
  });
  console.log(JSON.stringify(articles, null, 2));
}
main();
