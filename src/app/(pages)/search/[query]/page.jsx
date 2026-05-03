"use client";
import { useEffect, useState } from "react";
import MovieBanner from "@/components/movieBanner";
import { CircularProgress } from "@mui/material";
import { FaExclamationCircle, FaSearch } from "react-icons/fa";

export default function Page({ params }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${params.query}&include_adult=true&language=en-US&page=1`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
              accept: "application/json",
            },
          }
        );
        const data = await res.json();

        if (data && data.results) {
          setResults(data.results);
        } else {
          setError(data.error || "Failed to fetch results");
        }
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchSearchResults();
    // Only run on first render or params.query change
    // eslint-disable-next-line
  }, [params.query]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#1a1312] via-[#231816] to-[#29201d] flex flex-col">
      <div className="flex flex-col items-center justify-center pt-20 pb-8 w-full">
        <div className="w-full max-w-[1240px] px-6">
          <div className="flex items-center gap-3 mb-6">
            <FaSearch className="text-xl text-white/70 drop-shadow" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Search results for <span className="text-[#EDA963]">{params.query}</span>
            </h1>
          </div>
          {/* Feedback Area */}
          {loading ? (
            <div className="flex justify-center items-center mt-16 min-h-[160px]">
              <CircularProgress size={44} thickness={4.2} sx={{ color: "#EDA963" }} />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center mt-16 min-h-[160px]">
              <FaExclamationCircle className="text-3xl text-red-500 mb-2" />
              <span className="text-lg text-red-500 font-semibold">{error}</span>
              <span className="mt-2 text-white/70">Please double-check your search or try again later.</span>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                gap-6
                mt-8
                mb-20
                w-full
                min-h-[360px]
                transition-all
              "
            >
              {results.length === 0 ? (
                <div className="col-span-full flex flex-col items-center mt-12">
                  <FaExclamationCircle className="text-4xl text-yellow-400 mb-2" />
                  <span className="text-xl font-semibold text-white mb-1">
                    No movies found for <span className="text-[#EDA963]">{params.query}</span>
                  </span>
                  <span className="text-white/70">Try a different keyword or check your spelling!</span>
                </div>
              ) : (
                results.map((item) =>
                  item.poster_path ? (
                    <MovieBanner
                      key={item.id}
                      title={item.title}
                      poster_path={item.poster_path}
                      id={item.id}
                      className="hover:scale-105 transition-transform shadow-lg rounded-lg"
                    />
                  ) : null
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
