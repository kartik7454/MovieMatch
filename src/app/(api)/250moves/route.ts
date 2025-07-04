import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from 250moves API!" });
}
