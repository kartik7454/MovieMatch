"use client";

import React, { useEffect, useRef, useState } from "react";
import MovieBanner from "@/components/movieBanner";
import { CircularProgress } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";

export default function LikedPage() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [likedMovies, setLikedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      }
    };
    fetchLikedMovies();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#1a1312] via-[#231816] to-[#29201d] min-h-screen w-full">
      <div className="flex justify-center pt-16 pb-8">
        <div className="w-full max-w-[1240px] px-6">
          {/* Page Title */}
          <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-white text-center drop-shadow-lg">
            Your Liked Movies
          </h1>
          {/* Liked Movies */}
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
                  {error}
                </h2>
                <p className="mt-2 text-white/70">
                  Please try again later.
                </p>
              </div>
            ) : likedMovies.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <h2 className="text-xl font-semibold text-white">
                  No liked movies yet.
                </h2>
                <p className="mt-2 text-white/70">
                  Like some movies to see them here!
                </p>
              </div>
            ) : (
              likedMovies.map((item: any) => (
                <div key={item.id} className="flex flex-col group items-stretch">
                  <div className="relative">
                    <MovieBanner
                      title={item.title}
                      poster_path={item.poster}
                      id={item.id}
                      className="hover:scale-105 transition-transform shadow-lg rounded-lg"
                    />
                    {/* Improved Remove Button Overlay (appears hovered, corner, with animation) */}
                    <button
                      title="Remove"
                      className={`
                        absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                        bg-gradient-to-br from-red-600 via-pink-500 to-yellow-500 
                        text-white rounded-full shadow-lg p-2 
                        hover:scale-110 transition-all duration-200 outline-none
                        focus-visible:ring-2 focus-visible:ring-yellow-400 z-20
                      `}
                      onClick={() => {
                        setLikedMovies(prev => prev.filter((movie: any) => movie.id !== item.id));
                        fetch('/delete_liked', {
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
                              alert(data.error || "Failed to update liked movies");
                            }
                          })
                          .catch(err => {
                            console.error('Failed to update liked movies:', err);
                          });
                      }}
                      tabIndex={0}
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Infinite Scroll Loader - not strictly needed here, but for consistency */}
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
