  "use client"
  import { useEffect, useState } from "react";
import MovieBanner from "@/components/movieBanner";


export default function Page({ params }) {

    // use effect for api all


  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${params.query}&include_adult=true&language=en-US&page=1`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
              accept: 'application/json',
            },
          });
          const data = await res.json();
      
      if (data) {
        setResults(data.results || []);
      } else {
        setError(data.error || "Failed to fetch trending movies");
      }
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchSearchResults();
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Search Results for: { params.query  }</h1>
    {loading && <p>Loading...</p>}
    {error && <p style={{ color: "red" }}>{error}</p>}
    {!loading && !error && (
      <div className="grid grid-cols-6  gap-6 mt-6">
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          results.map((item) => (
            <MovieBanner
                  title={item.title}
                  poster_path={item.poster_path}
                  id={item.id}
                />
          ))
        )}
      </div>
    )}
    </div>
  );
}
