import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyJWT } from "@/lib/auth";

// Helper to check if request is authenticated as admin
async function isAdmin(request: Request) {
  const token = request.headers.get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("admin_token="))
    ?.split("=")[1];

  if (!token) return false;
  const decoded = await verifyJWT(token);
  return !!decoded;
}

// POST: Create a new contact message (Public access)
export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Required fields are missing (name, email, subject, message)" },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("POST Contact Error:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}

// GET: Retrieve all contact messages (Admin Only)
export async function GET(request: Request) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("GET Contact Messages Error:", error);
    return NextResponse.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
}

// DELETE: Remove a contact message (Admin Only)
// Access: DELETE /api/contact?id=message_id_here
export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    const messageExists = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!messageExists) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Inbox message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Contact Message Error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
