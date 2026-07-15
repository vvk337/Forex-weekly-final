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

// PUT update article status, content, and metadata
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category,
      author,
      imageUrl,
      isFeatured,
      status,
      scheduledAt,
      revisionComment,
    } = body;

    const existingArticle = await prisma.article.findUnique({ where: { id } });
    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Role validation
    const { authorized, session } = await validatePermissions(request, "articles:edit:published");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isSupervisorOrAbove = session.role === "OWNER" || session.role === "ADMIN" || session.role === "SUPERVISOR";

    if (!authorized) {
      // Employee bounds: can edit own draft or needs-revision articles only
      const isAuthor = existingArticle.author === session.username;
      const isDraftOrRevision = existingArticle.status === "DRAFT" || existingArticle.status === "REVISION";

      if (!isAuthor || !isDraftOrRevision) {
        return NextResponse.json(
          { error: "Unauthorized: Employees can only edit their own draft or returned publications" },
          { status: 403 }
        );
      }
    }

    // Supervisor bounds: check department alignment
    if (session.role === "SUPERVISOR" && session.userId !== "admin-legacy") {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { departments: true },
      });
      const depts = dbUser?.departments.map(d => d.name) || [];
      if (!depts.includes(existingArticle.department)) {
        return NextResponse.json(
          { error: "Unauthorized: Supervisors can only manage publications within their assigned department" },
          { status: 403 }
        );
      }
    }

    // If changing to featured, unfeature others
    if (isFeatured && !existingArticle.isFeatured) {
      await prisma.article.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });
    }

    // Process status-specific transitions & auditing
    const dataToUpdate: any = {
      title: title !== undefined ? title : existingArticle.title,
      excerpt: excerpt !== undefined ? excerpt : existingArticle.excerpt,
      content: content !== undefined ? content : existingArticle.content,
      category: category !== undefined ? category : existingArticle.category,
      author: author !== undefined ? author : existingArticle.author,
      imageUrl: imageUrl !== undefined ? imageUrl : existingArticle.imageUrl,
      isFeatured: isFeatured !== undefined ? isFeatured : existingArticle.isFeatured,
      editedBy: session.username,
    };

    if (status !== undefined) {
      // Validate transitions
      if (!isSupervisorOrAbove && (status === "PUBLISHED" || status === "SCHEDULED" || status === "ARCHIVED")) {
        return NextResponse.json(
          { error: "Forbidden: Employees cannot directly publish, schedule, or archive articles" },
          { status: 403 }
        );
      }

      dataToUpdate.status = status;

      if (status === "PUBLISHED") {
        dataToUpdate.publishedBy = session.username;
        dataToUpdate.publishedAt = new Date();
        dataToUpdate.revisionComment = null; // Clear comments
      } else if (status === "SCHEDULED" && scheduledAt) {
        dataToUpdate.scheduledAt = new Date(scheduledAt);
        dataToUpdate.revisionComment = null;
      } else if (status === "DRAFT" && revisionComment) {
        // Supervisor returning article for revision
        dataToUpdate.revisionComment = revisionComment;
      }
    }

    const updated = await prisma.article.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Article Error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// DELETE article / Move to Trash / Restore Action
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

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "restore") {
      // Restore from Trash/Archived status back to DRAFT or PUBLISHED
      if (session.role === "EMPLOYEE") {
        return NextResponse.json({ error: "Employees cannot restore articles" }, { status: 403 });
      }
      
      const restored = await prisma.article.update({
        where: { id },
        data: { status: "DRAFT", revisionComment: null },
      });
      return NextResponse.json({ success: true, message: "Article restored as draft successfully", article: restored }, { status: 200 });
    }

    if (session.role === "SUPERVISOR") {
      // Supervisor: Move to trash status only
      await prisma.article.update({
        where: { id },
        data: { status: "TRASH" },
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
