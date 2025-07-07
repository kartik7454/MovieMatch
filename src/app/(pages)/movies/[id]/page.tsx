"use client";

import React from "react";
import MovieBanner from "@/components/movieBanner";
interface MovieDetailPageProps {
  params: {
    id: string;
  };
} 

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = params;
  // INSERT_YOUR_CODE
  const [movie, setMovie] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Try to get movie from localStorage first
    const localKey = `movie_${id}`;
    const cached = typeof window !== "undefined" ? localStorage.getItem(localKey) : null;
    if (cached) {
      setMovie(JSON.parse(cached));
      setLoading(false);
      return;
    }
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
      
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?append_to_response=recommendations%2Cwatch%2Fproviders%2Cvideos`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
            accept: 'application/json',
          },
        });
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
  }, []);

  
  return (
    <div className="flex flex-col   h-auto bg-gray-900 text-white pb-10">
      <div>
        {loading ? (
          <h1>Loading...</h1>
        ) : error ? (
          <h1>Error: {error}</h1>
        ) : movie ? (
          <div className="main px-28 pt-5">
          <div className=" grid grid-cols-5 gap-4 h-20" id="top ">
            <div className=" col-span-3">
                <h1 className="font-bold text-4xl">{movie.title}</h1>
                <div className="flex gap-3"> 
                    <p>{movie.release_date.slice(0,4)}</p>
                    <p>{movie.runtime+" "+"min"}</p>

                </div>
               
                </div>
            <div className=" col-span-1">
                <p>TMDB Rating</p>
                <h1>{ String(movie.vote_average).slice(0,3) + "/10" }</h1>
                <h3>{movie.vote_count+" "+"ratings "}</h3>
            </div>
            <div className=" col-span-1" >
            <h1>Popularity</h1>
                <h1>{movie.popularity}</h1>
            </div>
            </div>  
            <div className="grid grid-cols-6 gap-4  mt-5">
                <div className="col-span-2  flex" >
                <img
      src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
      onClick={()=>{console.log(movie.recommendations.results)}}
      className="rounded-lg w-11/12  object-cover "
      loading="lazy"
    />
                </div>
                <div className=" col-span-4 flex flex-col justify-center">
                <iframe
        width="100%"
        height="100%"
        src={(() => {
          const trailer = movie.videos?.results?.find(
            (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
          );
          return trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";
        })()}
        title="Movie Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl shadow-lg"
      ></iframe>
                </div>
            </div>
            
            <div  className="grid grid-cols-6 gap-4  mt-5">
            <div  className=" bg-neutral-900 col-span-4 ">
                <div className="flex flex-col gap-3">
                    <div id="genrediv" className="flex gap-2">
                    {movie.genres.map((item:any)=>{
                        return(<p className=" border-2 px-4 py-1 rounded-full text-sm font-semibold">{item.name}</p>)
                    })}
                </div>
                <div id="overview">
                        <p className="font-normal text-[17px]"
                       
                        >{movie.overview} </p>
                </div>
                <div>
                  <h1 className="text-4xl font-semibold">more like this</h1>
                  
                  <div className="flex overflow-x-scroll [scrollbar-width:thin] 
  [scrollbar-color:#4b5563_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent  [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
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
                

            </div>
            <div  className="  col-span-2 ">
                <div id ="right side" className="flex flex-col gap-5"> 
                  <div className="flex flex-col gap-5 overflow-x-scroll [scrollbar-width:thin] 
  [scrollbar-color:#4b5563_transparent] 
  [&::-webkit-scrollbar]:w-1 
  [&::-webkit-scrollbar-track]:bg-transparent 
  [&::-webkit-scrollbar-thumb]:bg-gray-600 
  [&::-webkit-scrollbar-thumb]:rounded-full"><p>streaming(flat/rent/buy)</p>
                  
                  <div className="flex gap-3 ">
                    {movie["watch/providers"]?.results?.["IN"]?.flatrate?.length > 0 &&
                      movie["watch/providers"].results["IN"].flatrate.map((item: any) => (
                        <img
                          key={item.provider_id}
                          className="w-14 h-10  object-cover rounded-md"
                          src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                          alt={item.provider_name}
                        />
                      ))}
                    {movie["watch/providers"]?.results?.["IN"]?.flatrate?.length > 0 && <span>|</span>}
                    {movie["watch/providers"]?.results?.["IN"]?.rent?.length > 0 &&
                      movie["watch/providers"].results["IN"].rent.map((item: any) => (
                        <img
                          key={item.provider_id}
                          className="w-14 h-10  object-cover rounded-md"
                          src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                          alt={item.provider_name}
                        />
                      ))}
                    {movie["watch/providers"]?.results?.["IN"]?.rent?.length > 0 && <span>|</span>}
                    {movie["watch/providers"]?.results?.["IN"]?.buy?.length > 0 &&
                      movie["watch/providers"].results["IN"].buy.map((item: any) => (
                        <img
                          key={item.provider_id}
                          className="w-14 h-10  object-cover rounded-md"
                          src={`https://image.tmdb.org/t/p/w200${item.logo_path}`}
                          alt={item.provider_name}
                        />
                      ))}
                  </div>
                
                  
                 
                  </div>
                  <div>
                  <button
                    className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 text-lg"
                    onClick={async () => {
                      try {
                        const response = await fetch('/set_liked_movies', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ liked_movies: [{
                            title:movie.title,
                            id:movie.id,
                            genres:movie.genres.map((g: any) => g.id),
                            keywords:'',
                            poster:movie.poster_path
                      
                          }]}),
                        });
                        const data = await response.json();
                        if (data.success === true) {
                          alert(data.message)
                          // router.push('/home');
                        }
                        // Optionally, handle success (e.g., navigate or show a message)
                      } catch (error) {
                        // Optionally, handle error
                        console.error('Failed to like movies:', error);
                      }
                    }}
                 >
                    like ❤️
                  </button>
                  </div>
                 
                </div>
            </div>
            </div>
          </div>
        ) : (
          <h1>No movie data found.</h1>
        )}
      </div>
    </div>
  );
}
