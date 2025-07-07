"use client";

import React,{useEffect,useState} from "react";
import MovieBanner from "@/components/movieBanner";



export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  useEffect(() => {
    // Example API call to fetch movies (replace URL with your actual API endpoint)
    const fetchMovies = async () => {
      try {
        const res = await fetch('/recomended_movies/'+page);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  return (
    <div>
      
      <div className="flex justify-center mt-14">
        <div className="w-[80%] bg-slate-600 min-h-screen">
          <h1 className="text-4xl font-semibold my-8 font-sans">Recommended For You</h1>
          <div className="flex flex-row flex-wrap gap-4 mt-5 mb-16 bg-slate-200 w-full h-full">
            {loading ? (
              <div className="text-center py-8">Loading movies...</div>
            ) : (
              movies.map((item) =><MovieBanner title={item.title}
              poster_path = {item.poster_path}
              id={item.id}
              /> )
            )}
          </div>
          <div className="flex justify-center items-center gap-4 mt-6 pb-6">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-lg font-medium text-black">Page {page}</span>
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
        </div>
        
      </div>
     
    </div>
  );
}
