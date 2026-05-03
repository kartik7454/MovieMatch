import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export async function GET(req: Request) {
  await connectToDB();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  const user = await User.findOne({ email });

  return NextResponse.json(user);
}