"use client";

import React from "react";
import MovieBanner from "@/components/movieBanner";
export default function LikedPage() {

  const [likedMovies, setLikedMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLikedMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/get_liked_movies");
        const data = await res.json();
        if (data.success) {
          setLikedMovies(data.liked_movies || []);
        } else {
          setError(data.error || "Failed to fetch liked movies");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
        console.log(likedMovies)
      }
    };

    fetchLikedMovies();
  }, []);
  return (
    <main className="w-4/5 mx-auto mt-7">
       <div className="flex flex-row flex-wrap gap-4 mt-5 mb-16 bg-slate-200 w-full h-full">
       {loading ? (
              <div className="text-center py-8">Loading movies...</div>
            ) : (
              likedMovies.map((item:any) =><MovieBanner title={item.title}
              poster_path = {item.poster}
              id={item.id}
              />  )
            )}
            </div>
    </main>
  );
}
