
"use server";

import { User } from "@/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// This is a boilerplate GET handler for the recommended movies API route.
interface Props {
  params: {
page: string
    }
}
export async function GET(req: NextRequest,Props:Props) {
  try {
    const allGenres = [28,12,16,35,80,99,18,10751,14,36,27,10402,9648,10749,878,10770,53,10752,37];

    await connectToDB();
    const {params } = Props
    const {page} = params
    const session = await getServerSession(authOptions);
    const user = await User.findById( session?.user.id   );

    // Generate the URL dynamically based on user's top genres
    const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
    const params1 = new URLSearchParams({
      include_adult: 'true',
      include_video: 'false',
      original_language:"en",
      page:page,
      'vote_count.gte': '1000',
      
    });

    // Set the page parameter correctly (URLSearchParams.set expects both key and value as strings)
    
    // Turn genre ids into a pipe-separated string and set as 'with_genres'
    const topGenres = user.prefrence.topgenre.map((element: any) => element.genreId);
    params1.set('with_genres', topGenres.join('|'));
    
      const topkeywords = user.prefrence.topkeywords.map((element: any) => element.keywordId);
      params1.set('with_keywords', topkeywords.join('|'))
    
     const url = `${baseUrl}?${params1.toString()}`;

    // Make the API call to TMDB with the constructed URL and return the results
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        accept: 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch recommended movies');
    }
    let data = await res.json();

// cosine similarity
const cosineSimilarity = (a: number[], b: number[]): number => {
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}
//user vector
const userGenreIds = user.prefrence.topgenre.map((g: { genreId: number }) => g.genreId);
const userVector = allGenres.map((id: number) => userGenreIds.includes(id) ? 1 : 0);

//movie vector and similarity compare
data.results.map((item:any,index: number)=>{
const movieVector = allGenres.map(id => item.genre_ids.includes(id) ? 1 : 0);
let cosine = (cosineSimilarity(userVector,movieVector))
console.log(cosine)
data.results[index].cosinescore = cosine
})
const filtered_movies = data.results.filter((item:any)=>{return item.cosinescore >0.4}) 



    return NextResponse.json({ results: filtered_movies });
  } catch (error) {
    console.log(error)
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
