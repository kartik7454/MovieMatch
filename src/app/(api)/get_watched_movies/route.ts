import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import { connectToDB } from "@/lib/mongoDB";

export async function GET(req: Request) {
  try {
    await  connectToDB();
    const session = await getServerSession(authOptions);

    // if (!session || !session.user || !session.user.id) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    const user = await User.findById(session?.user.id).select("watched_movies");
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, watched_movies: user.watched_movies || [] });
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

