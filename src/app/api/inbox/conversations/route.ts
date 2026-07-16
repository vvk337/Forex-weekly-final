import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth-helpers";

// GET conversations for logged-in user
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.chatConversation.findMany({
      orderBy: { createdDate: "desc" },
      include: {
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    const filtered = conversations.filter((c) => {
      try {
        const members = JSON.parse(c.memberUsernames || "[]");
        const deleted = JSON.parse(c.deletedByUsernames || "[]");
        return members.includes(session.username) && !deleted.includes(session.username);
      } catch {
        return false;
      }
    });

    // Decorate each conversation with participant profile pictures & details
    const decorated = await Promise.all(
      filtered.map(async (c) => {
        let displayName = c.name || "Group Chat";
        let displayPhoto = "/images/default-avatar.png";

        if (c.type === "DIRECT") {
          try {
            const members = JSON.parse(c.memberUsernames || "[]");
            const peer = members.find((m: string) => m !== session.username);
            if (peer) {
              const peerUser = await prisma.user.findUnique({
                where: { username: peer },
              });
              if (peerUser) {
                displayName = peerUser.fullName;
                displayPhoto = peerUser.profilePhoto;
              } else {
                displayName = `@${peer}`;
              }
            }
          } catch {}
        }

        const lastMsgObj = c.messages[0] || null;
        let lastMessage = "No messages yet.";
        let timestamp = c.createdDate.toISOString();
        let unread = false;

        if (lastMsgObj) {
          lastMessage = lastMsgObj.content;
          timestamp = lastMsgObj.timestamp.toISOString();
          try {
            const readBy = JSON.parse(lastMsgObj.readByUsernames || "[]");
            unread = !readBy.includes(session.username) && lastMsgObj.senderUsername !== session.username;
          } catch {}
        }

        return {
          id: c.id,
          type: c.type,
          displayName,
          displayPhoto,
          lastMessage,
          timestamp,
          unread,
          memberUsernames: c.memberUsernames,
          archivedByUsernames: c.archivedByUsernames,
        };
      })
    );

    // Sort by timestamp desc
    decorated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(decorated, { status: 200 });
  } catch (error) {
    console.error("GET Conversations Error:", error);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
  }
}

// POST start new DM conversation
export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recipientUsername } = body;

    if (!recipientUsername) {
      return NextResponse.json({ error: "Missing recipientUsername" }, { status: 400 });
    }

    if (recipientUsername === session.username) {
      return NextResponse.json({ error: "Cannot start conversation with yourself" }, { status: 400 });
    }

    // Check if recipient user exists
    const recipientUser = await prisma.user.findUnique({
      where: { username: recipientUsername },
    });
    if (!recipientUser) {
      return NextResponse.json({ error: "Recipient user not found" }, { status: 404 });
    }

    // Check if DM conversation already exists
    const allConvs = await prisma.chatConversation.findMany({
      where: { type: "DIRECT" },
    });

    let existing = allConvs.find((c) => {
      try {
        const members = JSON.parse(c.memberUsernames || "[]");
        return members.includes(session.username) && members.includes(recipientUsername) && members.length === 2;
      } catch {
        return false;
      }
    });

    if (existing) {
      // Remove from deleted list if present
      try {
        const deleted = JSON.parse(existing.deletedByUsernames || "[]").filter((u: string) => u !== session.username);
        const archived = JSON.parse(existing.archivedByUsernames || "[]").filter((u: string) => u !== session.username);
        existing = await prisma.chatConversation.update({
          where: { id: existing.id },
          data: {
            deletedByUsernames: JSON.stringify(deleted),
            archivedByUsernames: JSON.stringify(archived),
          },
        });
      } catch {}
      return NextResponse.json(existing, { status: 200 });
    }

    const newConv = await prisma.chatConversation.create({
      data: {
        type: "DIRECT",
        memberUsernames: JSON.stringify([session.username, recipientUsername]),
      },
    });

    return NextResponse.json(newConv, { status: 201 });
  } catch (error) {
    console.error("POST Conversation Error:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
