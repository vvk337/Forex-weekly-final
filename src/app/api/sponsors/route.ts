import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validatePermissions } from "@/lib/auth-helpers";
import { createAuditLog } from "@/lib/audit-helper";

// Helper to check if request is authenticated as admin
async function isAuthenticated(request: Request) {
  const { authorized } = await validatePermissions(request, "sponsors:write");
  return authorized;
}

// Auto-seed default sponsor configurations if empty
async function ensureSponsorsSeeded() {
  const count = await prisma.sponsor.count();
  if (count === 0) {
    await prisma.sponsor.createMany({
      data: [
        {
          id: "leaderboard",
          title: "Global Liquidity, institutional Spreads from 0.0 Pips",
          description: "Trade 80+ currency pairs with low latency execution.",
          linkUrl: "#",
          buttonText: "Start Trading",
          imageUrl: "",
          bgImageUrl: "",
        },
        {
          id: "square",
          title: "Trade with the World's #1 FX Broker",
          description: "Tightest spreads, instant withdraws, and award-winning 24/7 technical support.",
          linkUrl: "#",
          buttonText: "Open Live Account",
          imageUrl: "",
          bgImageUrl: "",
        },
        {
          id: "inline",
          title: "Forex Weekly Academy: Master market order blocks & liquidity sweeps.",
          description: "Master market order blocks & liquidity sweeps.",
          linkUrl: "#",
          buttonText: "Free Guide",
          imageUrl: "",
          bgImageUrl: "",
        },
      ],
    });
  }
}

// GET all sponsors
export async function GET() {
  try {
    await ensureSponsorsSeeded();
    const sponsors = await prisma.sponsor.findMany();
    return NextResponse.json(sponsors, { status: 200 });
  } catch (error) {
    console.error("GET Sponsors Error:", error);
    return NextResponse.json({ error: "Failed to fetch sponsor data" }, { status: 500 });
  }
}

// PUT update sponsor details (Admin Only)
export async function PUT(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, linkUrl, buttonText, imageUrl, bgImageUrl } = body;

    if (!id || !title || !description || !linkUrl || !buttonText) {
      return NextResponse.json(
        { error: "Required fields are missing (id, title, description, linkUrl, buttonText)" },
        { status: 400 }
      );
    }

    const existing = await prisma.sponsor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Sponsor placement not found" }, { status: 404 });
    }

    const updated = await prisma.sponsor.update({
      where: { id },
      data: {
        title,
        description,
        linkUrl,
        buttonText,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        bgImageUrl: bgImageUrl !== undefined ? bgImageUrl : existing.bgImageUrl,
      },
    });

    await createAuditLog(
      request,
      null,
      "Edited",
      "SPONSOR",
      updated.id,
      updated.title
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Sponsor Error:", error);
    return NextResponse.json({ error: "Failed to update sponsor placement" }, { status: 500 });
  }
}
