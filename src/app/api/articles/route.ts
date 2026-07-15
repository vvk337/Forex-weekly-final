import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validatePermissions, getSession } from "@/lib/auth-helpers";
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
      status: "PUBLISHED",
      department: "Publications",
    }));

    await prisma.article.createMany({ data });
  }
}

// GET all articles
export async function GET(request: Request) {
  try {
    await ensureArticlesSeeded();

    // Auto-publish scheduled articles that are past due
    await prisma.article.updateMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: new Date() },
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");
    const status = searchParams.get("status");
    const author = searchParams.get("author");
    const department = searchParams.get("department");
    const search = searchParams.get("search");
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");

    const session = await getSession(request);

    // Build query filters
    const where: any = {};

    // Filter by Category
    if (category) {
      where.category = category;
    }

    // Filter by Featured Status
    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }

    // Filter by Author
    if (author) {
      where.author = { contains: author };
    }

    // Filter by Department
    if (department) {
      where.department = department;
    }

    // Filter by Date Range
    if (dateStart || dateEnd) {
      where.publishedAt = {};
      if (dateStart) where.publishedAt.gte = new Date(dateStart);
      if (dateEnd) where.publishedAt.lte = new Date(dateEnd);
    }

    // Filter by Search Query
    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { category: { contains: search } },
        { status: { contains: search } },
      ];
    }

    // Role-based Status Filters
    if (status) {
      where.status = status;
    } else {
      // Default behavior
      if (!session) {
        // Public website sees only PUBLISHED articles
        where.status = "PUBLISHED";
      } else {
        // Logged-in backend users:
        if (session.role === "EMPLOYEE") {
          // Employee sees published articles + their own drafts/pending
          where.OR = [
            { status: "PUBLISHED" },
            { author: session.username },
          ];
        } else if (session.role === "SUPERVISOR") {
          // Supervisor sees all published + all department articles
          // Fetch supervisor departments
          const dbUser = await prisma.user.findUnique({
            where: { id: session.userId },
            include: { departments: true },
          });
          const depts = dbUser?.departments.map(d => d.name) || [];
          where.OR = [
            { status: "PUBLISHED" },
            { department: { in: depts } },
          ];
        } else {
          // Admin / Owner sees everything except Trash (unless explicitly looking for it)
          where.status = { not: "TRASH" };
        }
      }
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

// POST new article
export async function POST(request: Request) {
  try {
    const { authorized, session } = await validatePermissions(request, "articles:create");
    if (!authorized || !session) {
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

    // Resolve author department
    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { departments: true },
    });
    const userDept = dbUser?.departments[0]?.name || "Publications";

    // If setting to featured, unfeature all other articles
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
        status: "DRAFT",
        department: userDept,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST Article Error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
