import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";
import { createNotification } from "@/lib/notification-helper";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET all messages for conversation ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Verify membership
    try {
      const members = JSON.parse(conversation.memberUsernames || "[]");
      if (!members.includes(session.username)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid conversation members metadata" }, { status: 500 });
    }

    // Mark messages as read by current user in database
    const updatedMessages = await Promise.all(
      conversation.messages.map(async (msg) => {
        try {
          const readers = JSON.parse(msg.readByUsernames || "[]");
          if (!readers.includes(session.username)) {
            readers.push(session.username);
            return await prisma.chatMessage.update({
              where: { id: msg.id },
              data: {
                readByUsernames: JSON.stringify(readers),
              },
            });
          }
        } catch {}
        return msg;
      })
    );

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        type: conversation.type,
        name: conversation.name,
        description: conversation.description,
        createdBy: conversation.createdBy,
        createdDate: conversation.createdDate,
      },
      messages: updatedMessages,
    }, { status: 200 });
  } catch (error) {
    console.error("GET Conversation Messages Error:", error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

// POST send new message
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    // Maximum length validation (e.g. 2000 chars limit)
    if (content.length > 2000) {
      return NextResponse.json({ error: "Message content exceeds limit of 2000 characters" }, { status: 400 });
    }

    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Verify membership
    let members: string[] = [];
    try {
      members = JSON.parse(conversation.memberUsernames || "[]");
      if (!members.includes(session.username)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid conversation members metadata" }, { status: 500 });
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        senderUsername: session.username,
        content: content.trim(),
        readByUsernames: JSON.stringify([session.username]), // Read by sender by default
      },
    });

    // Restore conversation view for any member who previously deleted it
    try {
      await prisma.chatConversation.update({
        where: { id },
        data: {
          deletedByUsernames: "[]", // Reset deleted trackers
        },
      });
    } catch {}

    // Send Notification
    if (conversation.type === "DIRECT") {
      const peer = members.find((m) => m !== session.username);
      if (peer) {
        await createNotification({
          title: "New Direct Message",
          description: `@${session.username}: ${content.slice(0, 60)}${content.length > 60 ? "..." : ""}`,
          module: "SYSTEM",
          objectId: conversation.id,
          targetUsername: peer,
        });
      }
    } else {
      // Group Conversation
      for (const m of members) {
        if (m === session.username) continue;
        await createNotification({
          title: `New Group Message in ${conversation.name || "Group"}`,
          description: `@${session.username}: ${content.slice(0, 60)}${content.length > 60 ? "..." : ""}`,
          module: "SYSTEM",
          objectId: conversation.id,
          targetUsername: m,
        });
      }
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("POST Message Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// PUT archive or delete conversation for active user
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // "ARCHIVE", "UNARCHIVE", or "DELETE"

    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Verify membership
    let members: string[] = [];
    let archived: string[] = [];
    let deleted: string[] = [];

    try {
      members = JSON.parse(conversation.memberUsernames || "[]");
      archived = JSON.parse(conversation.archivedByUsernames || "[]");
      deleted = JSON.parse(conversation.deletedByUsernames || "[]");

      if (!members.includes(session.username)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid conversation metadata" }, { status: 500 });
    }

    if (action === "ARCHIVE") {
      if (!archived.includes(session.username)) {
        archived.push(session.username);
      }
    } else if (action === "UNARCHIVE") {
      archived = archived.filter((u) => u !== session.username);
    } else if (action === "DELETE") {
      if (!deleted.includes(session.username)) {
        deleted.push(session.username);
      }
    } else {
      return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
    }

    const updated = await prisma.chatConversation.update({
      where: { id },
      data: {
        archivedByUsernames: JSON.stringify(archived),
        deletedByUsernames: JSON.stringify(deleted),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Conversation Actions Error:", error);
    return NextResponse.json({ error: "Failed to perform conversation action" }, { status: 500 });
  }
}
