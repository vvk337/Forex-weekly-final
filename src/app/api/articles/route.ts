import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";
import { mockArticles } from "@/data/mockData";

// Seed articles dynamically if DB is empty
async function ensureArticlesSeeded() {
  const count = await prisma.article.count();
  if (count === 0) {
    // Seed database with mock articles
    const data = mockArticles.map((art) => ({
      title: art.title,
      excerpt: art.excerpt,
      content: `This is the full publication of the article: "${art.title}". 
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat, arcu vel mollis tempor, neque libero rhoncus justo, vel elementum enim sapien vel leo. Cras elementum rhoncus sem. Proin hendrerit, leo ac pellentesque imperdiet, erat felis pulvinar neque, a posuere tortor arcu quis turpis. 
      
      Duis sit amet ligula ut est pretium elementum. Pellentesque sed dolor. Aliquam congue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.`,
      category: art.category,
      publishedAt: new Date(art.publishedAt),
      author: art.author,
      imageUrl: art.imageUrl,
      isFeatured: art.isFeatured || false,
    }));

    await prisma.article.createMany({ data });
  }
}

// GET all articles
export async function GET(request: Request) {
  try {
    await ensureArticlesSeeded();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("GET Articles Error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST new article (Admin Only)
export async function POST(request: Request) {
  try {
    const { authorized } = await validatePermissions(request, "articles:write");
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, excerpt, content, category, author, imageUrl, isFeatured } = body;

    if (!title || !excerpt || !content || !category || !author) {
      return NextResponse.json(
        { error: "Required fields are missing (title, excerpt, content, category, author)" },
        { status: 400 }
      );
    }

    // If setting to featured, unfeature all other articles in same category (optional, but nice)
    if (isFeatured) {
      await prisma.article.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        excerpt,
        content,
        category,
        author,
        imageUrl: imageUrl || "/images/placeholder.jpg",
        isFeatured: isFeatured || false,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST Article Error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
