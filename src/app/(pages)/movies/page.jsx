"use client";

import React,{useEffect,useState, useRef} from "react";
import MovieBanner from "@/components/movieBanner";
import { CircularProgress } from "@mui/material";



export default function Movies() {
  const loaderRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [error, seterror] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  useEffect(() => {
    // Example API call to fetch movies (replace URL with your actual API endpoint)
    const fetchMovies = async () => {
      try {
        const res = await fetch('/recomended_movies/'+page);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        if(page =="1"){ setMovies(data.results) }
        else{setMovies(prev => [...prev, ...data.results])}
         
        
      } catch (error) {
        seterror(error)
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        setPage(prev => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);

  return (
    <div>
      
      <div className="flex justify-center mt-14">
        <div className="w-[80%]   min-h-screen">
         
          <div className="flex flex-row flex-wrap gap-4 mt-5 mb-16  w-full   ">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <CircularProgress />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <h1>no like movies</h1>
              </div>
            ) : (
              movies.map((item) => (
                <MovieBanner
                  key={item.id}
                  title={item.title}
                  poster_path={item.poster_path}
                  id={item.id}
                />
              ))
            )}
          </div>
                 <div ref={loaderRef} className="h-10  " ></div>
         <div className="flex justify-center items-center pb-5">
               <CircularProgress size={24} />
             </div>   
           <div></div>
             
          
        </div>
         
      </div>
     
    </div>
  );
}
