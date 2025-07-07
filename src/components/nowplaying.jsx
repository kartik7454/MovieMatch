import React from "react";

import MovieBanner from "./movieBanner";

export default function Trending() {
    const [trendingMovies, setTrendingMovies] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      const fetchTrendingMovies = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=IN`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
                  accept: 'application/json',
                },
              });
              const data = await res.json();
          if (data) {
            setTrendingMovies(data.results || []);
          } else {
            setError(data.error || "Failed to fetch trending movies");
          }
        } catch (err) {
            console.log(err.message)
          setError(err.message || "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchTrendingMovies();
    }, []);
  return (
    
    <div>
      <h2 className="text-2xl font-bold mb-4" onClick={()=>{console.log(trendingMovies)}}>Playing Now</h2>
    {
      loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex  gap-3 overflow-x-scroll [scrollbar-width:thin] 
        [scrollbar-color:#4b5563_transparent] 
        [&::-webkit-scrollbar]:w-1 
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-gray-600 
        [&::-webkit-scrollbar-thumb]:rounded-full">
          {trendingMovies && trendingMovies.length > 0 ? (
            trendingMovies.map((item) => (
                <div key={item.id} className="flex-shrink-0">
                <MovieBanner
                  title={item.title}
                  poster_path={item.poster_path}
                  id={item.id}
                />
              </div>
            ))
          ) : (
            <p>No trending movies found.</p>
          )}
        </div>
      )
    }
    </div>
  );
}
