"use server"
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import { connectToDB } from "@/lib/mongoDB";

export async function POST(req: NextRequest) {
  try {
     await connectToDB();
//get user session for id 

  
    //get list of movies user choose
    const body = await req.json();
    let { watched_movies } = body;
    let id;
    if(body.id){id=body.id}
    else{const session = await getServerSession(authOptions);
        id=session?.user.id}

    // Fetch the current user to get their liked_movies
    const currentUser = await User.findById(id).select("watched_movies");
   
    const existingIds = new Set((currentUser?.watched_movies || []).map((m: any) => String(m.id)));
    
    // Filter out movies that already exist by id
    watched_movies = watched_movies.filter((movie: any) => !existingIds.has(String(movie.id)));
    if (watched_movies.length === 0) {
      return NextResponse.json({ success:true, message: "already watched." });
    }
    // Prepare movies to add
    const watched_movies_finale = watched_movies.map((item: any) => ({
      title: item.title,
      id: String(item.id),
      poster: item.poster,
    }));
 
    // Update the user
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { watched_movies: { $each: watched_movies_finale } } },
      { new: true }
    );
   
    return NextResponse.json({ success: true, message: "Added" });
  } catch (error) {
    console.log(error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
