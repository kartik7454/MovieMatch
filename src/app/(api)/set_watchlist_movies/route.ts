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
const session = await getServerSession(authOptions)
 const  id=session?.user.id
    //get list of movies user choose
    const body = await req.json();
    let {watchlist_movies } = body;
    
    
        

    // Fetch the current user to get their liked_movies
    const currentUser = await User.findById(id).select("watchlist_movies");
   
    const existingIds = new Set((currentUser?.watchlist_movies || []).map((m: any) => String(m.id)));
    
    // Filter out movies that already exist by id
    watchlist_movies = watchlist_movies.filter((movie: any) => !existingIds.has(String(movie.id)));
    if (watchlist_movies.length === 0) {
      return NextResponse.json({ success:true, message: "already watched." });
    }
    // Prepare movies to add
    
 
    // Update the user
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { watchlist_movies: { $each: watchlist_movies } } },
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
