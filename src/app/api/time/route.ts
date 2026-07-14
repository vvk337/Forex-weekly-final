import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ datetime: new Date().toISOString() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch server time" }, { status: 500 });
  }
}
