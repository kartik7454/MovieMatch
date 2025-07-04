"use server"
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import { connectToDB } from "@/lib/mongoDB";

export async function POST(req: NextRequest) {
  try {
     await connectToDB();
     const body = await req.json();
     let { userId,liked_movies } = body;
    // const session = await getServerSession(authOptions);
    
    const userid = userId;

let mergedGenres:any =[]
let mergedKeywords:any =[]
    if (liked_movies && Array.isArray(liked_movies)) {
      liked_movies.forEach((item: any) => {
       item.genres.forEach((item: any)=>{
        
        mergedGenres.push(item)

       })
       item.keywords.forEach((item: any)=>{
       
        mergedKeywords.push(item.id)
       })
      });
    }
    
    // Count occurrences of each genre
    const genreWeights: Record<number, number> = {};
    mergedGenres.forEach((genreId: number) => {
      genreWeights[genreId] = (genreWeights[genreId] || 0) + 1;
    });

    // Get top 5 genres with highest values
    const topGenres = Object.entries(genreWeights)//convert to an array [genreId, count] like this of pairs
      .sort((a, b) => b[1] - a[1])//sorts these pairs by the count (the second item in each pair)
      .slice(0, 5)//top5
      .map(([genreId]) => ({ genreId: Number(genreId) }));//transforms each pair into an object

    // Count occurrences of each keyword
    const keywordWeights: Record<number, number> = {};
    mergedKeywords.forEach((keywordId: number) => {
     
      //if keyword exsist then give its value or 0 if not  then +1
      keywordWeights[keywordId] = (keywordWeights[keywordId] || 0) + 1;
    });
    
     // Get top 10 genres with highest values
     const topKeywords = Object.entries(keywordWeights)//convert to an array [genreId, count] like this of pairs
     .sort((a, b) => b[1] - a[1])//sorts these pairs by the count (the second item in each pair)
     .slice(0, 10)//top10
     .map(([keywordId]) => ({ keywordId: Number(keywordId) }))//takes id(1st element of pair ) 
    // convert it to an object  and return an array of object 

    
//add  prefrence to db
    await User.findByIdAndUpdate(
      userid,
      {
        prefrence: {
          topgenre: topGenres,
          topkeywords: topKeywords
        }
      },
      { new: true }
    );

  
    return NextResponse.json({ success:topGenres,topKeywords});
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
