import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import { connectToDB } from "@/lib/mongoDB";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const movieIdToDelete = body.delete_id;

    if (!movieIdToDelete) {
      return NextResponse.json({ success: false, error: "No movie id provided" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Remove the movie from liked_movies array
    user.liked_movies = (user.liked_movies || []).filter(
      (movie: any) => movie.id !== movieIdToDelete
    );
    await user.save();
    fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/userProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session?.user.id, liked_movies: user.liked_movies })
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
