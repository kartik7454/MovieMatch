import React from "react";
import MovieBanner from "./movieBanner";
import { FaRegPlayCircle, FaStar, FaRegCalendarAlt } from "react-icons/fa";

export default function NowPlaying() {
  const [nowPlayingMovies, setNowPlayingMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/now_playing`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
   
        const data = await res.json();
        if (data) {
          setNowPlayingMovies(data.results || []);
        } else {
          setError(data.error || "Failed to fetch now playing movies");
        }
      } catch (err) {
        console.log(err.message);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlayingMovies();
  }, []);

  return (
    <section className="w-full py-8 px-0 md:px-0 bg-gradient-to-b from-[#231616] via-[#241d1d] to-[#1e1919] my-10 relative">
      <div className="flex items-center mb-6 gap-2 px-4 md:px-12">
        <FaRegPlayCircle className="text-rose-400 text-3xl drop-shadow" />
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md select-none">
          Now Playing in Cinemas
        </h2>
      </div>
      {
        loading ? (
          <div className="flex items-center justify-center h-48">
            <svg className="animate-spin text-rose-400 h-10 w-10 mr-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-80" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4" />
            </svg>
            <span className="text-lg text-white">Loading...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <div
            className="flex gap-6 md:gap-8 overflow-x-auto pt-2 pb-5 px-4 md:px-12 w-full
              [scrollbar-width:thin]
              [scrollbar-color:#fb7185_transparent]
              [&::-webkit-scrollbar]:h-2
              [&::-webkit-scrollbar-track]:bg-[#251c1c]
              [&::-webkit-scrollbar-thumb]:bg-rose-400/60
              [&::-webkit-scrollbar-thumb]:rounded-lg
            "
          >
            {nowPlayingMovies && nowPlayingMovies.length > 0 ? (
              nowPlayingMovies.slice(0, 15).map((item, idx) => (
                <div
                  key={item.id}
                  className={`
                    flex-shrink-0
                    group
                    transition-all relative rounded-xl
                    hover:scale-105 hover:z-50 hover:shadow-2xl
                    cursor-pointer
                    bg-[#231616]/90
                    duration-200
                    border border-[#341b1b] shadow-inner
                    w-[210px] min-w-[200px] max-w-[220px]
                    mx-auto
                  `}
                  tabIndex={0}
                  aria-label={item.title}
                >
                  <div className="absolute -top-3 -left-3 z-10">
                    <span className="bg-[#fb7185] text-[#401822] text-xs font-semibold rounded-full px-2 py-1 shadow
                      opacity-90 group-hover:opacity-100 transition-all">
                      #{idx + 1}
                    </span>
                  </div>
                  <MovieBanner
                    title={item.title}
                    poster_path={item.poster_path}
                    id={item.id}
                  />
                  {/* Additional Info Overlay */}
                  <div className="flex flex-col px-3 pb-4 pt-2 gap-1 relative z-10">
                    <h3 className="font-semibold text-md text-white line-clamp-2 mb-1">{item.title}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <FaStar className="text-yellow-400" />
                      <span className="text-sm text-amber-100 font-medium">{item.vote_average?.toFixed(1) || "N/A"}</span>
                      <span className="text-xs text-gray-300 opacity-60 ml-2">
                        ({item.vote_count?.toLocaleString() ?? 0} votes)
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-300 gap-2">
                      <FaRegCalendarAlt className="inline-block text-gray-400" />
                      <span>{item.release_date ? new Date(item.release_date).getFullYear() : "N/A"}</span>
                      {item.original_language && <span className="bg-gray-800 rounded px-2 py-0.5 text-xs ml-2 uppercase text-gray-200">{item.original_language}</span>}
                    </div>
                    <p className="text-xs text-gray-300 mt-2 line-clamp-3 h-[42px]">{item.overview || "No description available."}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white opacity-80 w-full">No movies currently playing found.</p>
            )}
          </div>
        )
      }
    </section>
  );
}
