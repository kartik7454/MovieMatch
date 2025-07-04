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
    const session = await getServerSession(authOptions);
    //get list of movies user choose
    const body = await req.json();
    let { liked_movies } = body;
// Add keywords to movies in parallel
// liked_movies.map(...) creates/returns a new array.****
// For each item (movie), it returns an async function (which is a promise).
// So, you get an array of promises—one for each movie.
// map + Promise.all = run all async operations in parallel, then wait for all to finish.
await Promise.all(
  liked_movies.map(async (item: any) => {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${item.id}/keywords`, {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        accept: 'application/json',
      }),
    });
    const data = await res.json();
    item.keywords = data.keywords;
  })
);

      
    
    //update the user 

    const user = await User.findByIdAndUpdate(
      session?.user.id,
      { liked_movies: liked_movies },
      { new: true }
    );

    //call api for profile maker with data of liked movies 
    // Call the userProfile POST API to update user preferences based on liked movies
    fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/userProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session?.user.id, liked_movies })
    });


    
    return NextResponse.json({ success:true});
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
  }}
