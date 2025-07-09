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
        const res = await fetch("/get_watchlist");
        const data = await res.json();
        if (data.success) {
          setLikedMovies(data.watchlist_movies || []);
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
              likedMovies.map((item:any) =>
              <div><MovieBanner title={item.title}
              poster_path = {item.poster}
              id={item.id}
              /> 
               <button
                    className="w-full mt-3  px-4 py-2 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-yellow-600 transition-all duration-200 text-base flex items-center justify-center gap-2"
                    onClick={() => { console.log(item.id);
                     // Remove the movie with this id from likedMovies state
                     setLikedMovies((prev) => prev.filter((movie: any) => movie.id !== item.id));
                     // INSERT_YOUR_CODE
                     // Make an API call to update liked movies on the server after removing from state
                     fetch('/delete_watchlist', {
                       method: 'POST',
                       headers: {
                         'Content-Type': 'application/json',
                       },
                       body: JSON.stringify({
                         delete_id: item.id
                       }),
                     })
                     .then(res => res.json())
                     .then(data => {
                       if (!data.success) {
                         // Optionally, handle error (e.g., show a message)
                         alert(data.error || "Failed to update liked movies");
                       }
                     })
                     .catch(err => {
                       // Optionally, handle error
                       console.error('Failed to update liked movies:', err);
                     });
                     }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                  </button>
              </div>
               )
            )}
            </div>
    </main>
  );
}
