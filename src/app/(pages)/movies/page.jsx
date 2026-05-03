"use client";

import React, { useEffect, useState, useRef } from "react";
import MovieBanner from "@/components/movieBanner";
import { CircularProgress } from "@mui/material";

export default function Movies() {
  const loaderRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(true);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (page === 1) setLoading(true);
        else setInfiniteLoading(true);

        const res = await fetch('/recomended_movies/' + page);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        
        if (page === 1) setMovies(data.results);
        else setMovies(prev => [...prev, ...data.results]);
      } catch (error) {
        seterror(error);
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
        setInfiniteLoading(false);
      }
    };

    fetchMovies();
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !infiniteLoading) {
        setPage(prev => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
    // eslint-disable-next-line
  }, [infiniteLoading, loading]);

  return (
    <div className="bg-gradient-to-b from-[#1a1312] via-[#231816] to-[#29201d] min-h-screen w-full">
      <div className="flex justify-center pt-16 pb-8">
        <div className="w-full max-w-[1240px] px-6">
          {/* Page Title */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-white text-center drop-shadow-lg">
            Recommended Movies for You
          </h1>
          {/* Movies */}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              gap-6
              mb-20
              w-full
              min-h-[360px]
              transition-all
            "
          >
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-white/10 rounded-lg animate-pulse flex items-center justify-center"
                >
                  <CircularProgress size={36} color="inherit" />
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-10">
                <h2 className="text-xl font-semibold text-red-500">
                  No recommended movies found.
                </h2>
                <p className="mt-2 text-white/70">
                  Please try again later or adjust your preferences.
                </p>
              </div>
            ) : movies.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <h2 className="text-xl font-semibold text-white">
                  No recommendations yet.
                </h2>
                <p className="mt-2 text-white/70">
                  Like movies or rate genres to get personalized picks!
                </p>
              </div>
            ) : (
              movies.map((item) => (
                <MovieBanner
                  key={item.id}
                  title={item.title}
                  poster_path={item.poster_path}
                  id={item.id}
                  className="hover:scale-105 transition-transform shadow-lg rounded-lg"
                />
              ))
            )}
          </div>
          
          {/* Infinite Scroll Loader */}
          <div ref={loaderRef} className="h-8 w-full" />
          
          {/* Bottom Loader */}
          {infiniteLoading && (
            <div className="flex justify-center items-center pb-5">
              <CircularProgress size={28} color="inherit" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
