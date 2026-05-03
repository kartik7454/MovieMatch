"use client";

import React from "react";
import MovieBanner from "@/components/movieBanner";
import { Snackbar, Alert } from "@mui/material";
interface MovieDetailPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = params;
  const [movie, setMovie] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  React.useEffect(() => {
    // Try to get movie from localStorage first
    const localKey = `movie_${id}`;
    const cached =
      typeof window !== "undefined" ? localStorage.getItem(localKey) : null;
    if (cached) {
      setMovie(JSON.parse(cached));
      setLoading(false);
      return;
    }
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?append_to_response=recommendations%2Cwatch%2Fproviders%2Cvideos`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
              accept: "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.error || "Failed to fetch movie details");
        }
        setMovie(data);
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(localKey, JSON.stringify(data));
        }
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col h-auto bg-neutral-950 text-neutral-100 pb-10 min-h-screen">
      <div>
        {loading ? (
          <h1 className="px-8 pt-20 text-xl text-center font-medium">Loading...</h1>
        ) : error ? (
          <h1 className="px-8 pt-20 text-xl text-center font-medium text-red-400">
            Error: {error}
          </h1>
        ) : movie ? (
          <div className="main px-8 md:px-28 pt-8">
            <div
              className="grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-4 items-center"
              id="top"
            >
              <div className="md:col-span-3 flex flex-col gap-1">
                <h1 className="font-bold text-3xl md:text-4xl mb-2 text-neutral-50">
                  {movie.title}
                </h1>
                <div className="flex gap-4 text-base text-neutral-400 items-center">
                  <span>
                    {movie.release_date ? movie.release_date.slice(0, 4) : "--"}
                  </span>
                  <span>•</span>
                  <span>
                    {movie.runtime ? movie.runtime + " min" : "Runtime unknown"}
                  </span>
                </div>
              </div>
              <div className="md:col-span-1 flex flex-col items-start md:items-center justify-center bg-neutral-900 rounded-lg p-4 shadow">
                <p className="text-neutral-400 text-sm">TMDB Rating</p>
                <h1 className="text-2xl font-bold text-neutral-50 mt-1">
                  {String(movie.vote_average).slice(0, 3)}/10
                </h1>
                <h3 className="text-neutral-400 text-xs mt-1">
                  {movie.vote_count} ratings
                </h3>
              </div>
              <div className="md:col-span-1 flex flex-col items-start md:items-center justify-center bg-neutral-900 rounded-lg p-4 shadow">
                <p className="text-neutral-400 text-sm">Popularity</p>
                <h1 className="text-2xl font-bold text-neutral-50 mt-1">{movie.popularity}</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 mt-8">
              <div className="col-span-2 flex justify-center items-start">
                <img
                  src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
                  onClick={() => {
                    console.log(movie.recommendations.results);
                  }}
                  className="rounded-lg w-4/5 md:w-11/12 max-h-[540px] object-cover border-[1.5px] border-neutral-800 shadow-lg"
                  loading="lazy"
                  alt={movie.title}
                />
              </div>
              <div className="col-span-4 flex flex-col justify-center">
                <div className="aspect-video w-full rounded-xl shadow-xl overflow-hidden border border-neutral-800">
                  <iframe
                    width="100%"
                    height="100%"
                    src={(() => {
                      const trailer = movie.videos?.results?.find(
                        (vid: any) =>
                          vid.type === "Trailer" && vid.site === "YouTube"
                      );
                      return trailer
                        ? `https://www.youtube.com/embed/${trailer.key}`
                        : "";
                    })()}
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 mt-8">
              <div className="bg-neutral-900 col-span-4 rounded-xl p-6 shadow flex flex-col gap-5">
                <div id="genrediv" className="flex flex-wrap gap-2 mb-1">
                  {movie.genres.map((item: any) => (
                    <p
                      key={item.id}
                      className="border border-neutral-600 bg-neutral-800/50 text-sm font-semibold px-3 py-1 rounded-full text-neutral-200"
                    >
                      {item.name}
                    </p>
                  ))}
                </div>
                <div id="overview" className="mb-3">
                  <p className="font-normal text-[17px] text-neutral-200 leading-relaxed">
                    {movie.overview}{" "}
                  </p>
                </div>
                <div className="mt-2">
                  <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-50">
                    More like this
                  </h1>
                  <div
                    className="flex overflow-x-auto space-x-4 pb-2
                    [scrollbar-width:thin]
                    [scrollbar-color:#3f3f46_transparent]
                    [&::-webkit-scrollbar]:h-2
                    [&::-webkit-scrollbar-thumb]:bg-neutral-700
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-transparent"
                  >
                    {movie.recommendations.results.map((item: any) => (
                      <div key={item.id} className="flex-shrink-0">
                        <MovieBanner
                          title={item.title}
                          poster_path={item.poster_path}
                          id={item.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-6">
                <div
                  id="right side"
                  className="flex flex-col gap-5 rounded-xl bg-neutral-900 p-5 shadow"
                >
                  <div>
                    <div className="mb-1 font-semibold text-neutral-400 text-sm uppercase">
                      Streaming <span className="normal-case font-normal">(Flat/Rent/Buy)</span>
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">
                      {movie["watch/providers"]?.results?.["IN"]?.flatrate?.length >
                        0 &&
                        movie["watch/providers"].results["IN"].flatrate.map(
                          (item: any) => (
                            <img
                              key={item.provider_id}
                              className="w-12 h-8 object-contain rounded bg-neutral-800 border border-neutral-700"
                              src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                              alt={item.provider_name}
                            />
                          )
                        )}
                      {movie["watch/providers"]?.results?.["IN"]?.flatrate?.length >
                        0 && (
                        <span className="text-neutral-500 px-1 font-bold text-lg">|</span>
                      )}
                      {movie["watch/providers"]?.results?.["IN"]?.rent?.length > 0 &&
                        movie["watch/providers"].results["IN"].rent.map(
                          (item: any) => (
                            <img
                              key={item.provider_id}
                              className="w-12 h-8 object-contain rounded bg-neutral-800 border border-neutral-700"
                              src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                              alt={item.provider_name}
                            />
                          )
                        )}
                      {movie["watch/providers"]?.results?.["IN"]?.rent?.length >
                        0 && (
                        <span className="text-neutral-500 px-1 font-bold text-lg">|</span>
                      )}
                      {movie["watch/providers"]?.results?.["IN"]?.buy?.length > 0 &&
                        movie["watch/providers"].results["IN"].buy.map(
                          (item: any) => (
                            <img
                              key={item.provider_id}
                              className="w-12 h-8 object-contain rounded bg-neutral-800 border border-neutral-700"
                              src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                              alt={item.provider_name}
                            />
                          )
                        )}
                    </div>
                  </div>
                  <div>
                    <button
                      className="w-full py-3 px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold rounded-lg shadow-md transition-all duration-200 text-lg border border-neutral-700"
                      onClick={async () => {
                        try {
                          const response = await fetch("/set_liked_movies", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              liked_movies: [
                                {
                                  title: movie.title,
                                  id: movie.id,
                                  genres: movie.genres.map((g: any) => g.id),
                                  keywords: "",
                                  poster: movie.poster_path,
                                },
                              ],
                            }),
                          });
                          const data = await response.json();
                          if (data.success === true) {
                            setSnackbar({
                              open: true,
                              message: data.message,
                              severity: "success",
                            });
                          }
                        } catch (error) {
                          console.error("Failed to like movies:", error);
                          setSnackbar({
                            open: true,
                            message: "Failed to like movie",
                            severity: "error",
                          });
                        }
                      }}
                    >
                      Like ❤️
                    </button>
                  </div>

                  <div>
                    <button
                      className="w-full py-3 px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold rounded-lg shadow-md transition-all duration-200 text-lg border border-neutral-700"
                      onClick={async () => {
                        try {
                          const response = await fetch("/set_watched_movies", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              watched_movies: [
                                {
                                  title: movie.title,
                                  id: movie.id,
                                  poster: movie.poster_path,
                                },
                              ],
                            }),
                          });
                          const data = await response.json();
                          if (data.success === true) {
                            setSnackbar({
                              open: true,
                              message: data.message,
                              severity: "success",
                            });
                          }
                        } catch (error) {
                          console.error("Failed to mark as watched:", error);
                          setSnackbar({
                            open: true,
                            message: "Failed to mark as watched",
                            severity: "error",
                          });
                        }
                      }}
                    >
                      Watched ✔️
                    </button>
                  </div>

                  <div>
                    <button
                      className="w-full py-3 px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold rounded-lg shadow-md transition-all duration-200 text-lg border border-neutral-700"
                      onClick={async () => {
                        try {
                          const response = await fetch("/set_watchlist_movies", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              watchlist_movies: [
                                {
                                  title: movie.title,
                                  id: movie.id,
                                  poster: movie.poster_path,
                                },
                              ],
                            }),
                          });
                          const data = await response.json();
                          if (data.success === true) {
                            setSnackbar({
                              open: true,
                              message: data.message,
                              severity: "success",
                            });
                          }
                        } catch (error) {
                          console.error("Failed to add to watchlist:", error);
                          setSnackbar({
                            open: true,
                            message: "Failed to add to watchlist",
                            severity: "error",
                          });
                        }
                      }}
                    >
                      Watch List ➕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1 className="px-8 pt-20 text-xl text-center font-medium text-neutral-400">
            No movie data found.
          </h1>
        )}
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
