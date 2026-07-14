import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { validatePermissions } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const { authorized } = await validatePermissions(request, "assets:write");
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique name
    const timestamp = Date.now();
    const cleanFilename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Define upload directories
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure uploads folder exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, cleanFilename);
    await writeFile(filePath, buffer);

    // Return the clean public URL path
    return NextResponse.json({ url: `/uploads/${cleanFilename}` }, { status: 200 });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Failed to upload image file" }, { status: 500 });
  }
}
