import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single article
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("GET Article Error:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

// PUT update article
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, category, author, imageUrl, isFeatured } = body;

    const existingArticle = await prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Role-based editing boundaries
    const { authorized, session } = await validatePermissions(request, "articles:edit:published");
    if (!authorized || !session) {
      // If they don't have supervisor edit permission, check if employee editing their own draft
      const selfCheck = await validatePermissions(request, "articles:edit:own");
      const isAuthor = existingArticle.author === selfCheck.session?.username;

      if (!selfCheck.authorized || !isAuthor) {
        return NextResponse.json({ error: "Unauthorized access: You can only edit your own drafts" }, { status: 403 });
      }
    }

    // If changing to featured, unfeature others
    if (isFeatured && !existingArticle.isFeatured) {
      await prisma.article.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingArticle.title,
        excerpt: excerpt !== undefined ? excerpt : existingArticle.excerpt,
        content: content !== undefined ? content : existingArticle.content,
        category: category !== undefined ? category : existingArticle.category,
        author: author !== undefined ? author : existingArticle.author,
        imageUrl: imageUrl !== undefined ? imageUrl : existingArticle.imageUrl,
        isFeatured: isFeatured !== undefined ? isFeatured : existingArticle.isFeatured,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Article Error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// DELETE article (Supervisor: moves to trash; Admin/Owner: deletes permanently)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { authorized, session } = await validatePermissions(request, "articles:delete");
    if (!authorized || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.article.findUnique({ where: { id } });
    
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (session.role === "SUPERVISOR") {
      // Supervisor: Move to trash category only
      await prisma.article.update({
        where: { id },
        data: { category: "trash" },
      });
      return NextResponse.json({ success: true, message: "Article moved to trash successfully" }, { status: 200 });
    }

    // Owner or Admin: Delete permanently
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Article permanently deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Article Error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
