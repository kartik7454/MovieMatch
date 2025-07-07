"use client";
import '../../globals.css';
import movies from '../../movies';//save this in db
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
// Define the type for selected movie
interface SelectedMovie {
  title: string;
  id: string;
  genres: number[];
  keywords: number[];
  poster: string;
}

export default function GetStarted() {
  const router = useRouter();
  //state for selected movies
  const [selected, setSelected] = useState<SelectedMovie[]>([]);
  
// toggle function - if in the list already then remove and vice versa
  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const exists = prev.find((movie) => movie.id === String(id));
      if (exists) {
        //removes if already in the list
        return prev.filter((movie) => movie.id !== String(id));
      } else {
        // Check if we've reached the maximum limit of 5
        if (prev.length >= 5) {
          return prev; // Don't add more movies if limit reached
        }
        // else Find the movie in the list an adds it to the list
        const movie = movies.results.find((item) => item.id === id);
        if (!movie) return prev;
        return [
          ...prev,
          {title: movie.title,
            id: String(movie.id),
            genres: movie.genre_ids || [],
            keywords: [], // No keywords in movies.results, so leave empty
            poster: movie.poster_path || '',
          },
        ];
      }
    });
  };


  return (
    <main className="">
     
<div className="w-4/5 mx-auto mt-7">
  <section className="bg-[#181a1b] py-4">
        <h1 className="text-white text-4xl font-black text-left ">
          Select 5 Movies You've Enjoyed
        </h1>
      </section>

      {/* Search Bar */}
      <div className="mt-6">
        
        
      </div>

      {/* Genre Filter Buttons */}
    
{/*movies list */}
      <section className="flex flex-row flex-wrap gap-4 mt-5 mb-16" >
{movies.results.map((item)=>{return(
  <div
    key={item.id}
    className="relative bg-[#23272b] rounded-xl shadow-lg p-3 w-48 mx-auto cursor-pointer"
    onClick={() => toggleSelect(item.id)}/*toggles button */
  >
    {/* Checkmark overlay  if the selected list includes item  then only*/}
    {selected.find((movie) => movie.id === String(item.id)) && (
      <span className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )}
    <img
      src={"https://image.tmdb.org/t/p/w500/" + item.poster_path}
      alt={item.title}
      className="rounded-lg w-full h-64 object-cover"
      loading="lazy"
    />
    <h2 className="text-white text-lg font-semibold mt-2 truncate whitespace-nowrap overflow-hidden">
      {item.title}
    </h2>
  </div>
)})}
       
      </section>
      
      </div>
      {/* Fixed Done Button */}
      <button
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-12 rounded-full shadow-lg z-50 transition-colors duration-150"
        style={{ minWidth: '200px' }}
        onClick={async () => {
          try {
            const response = await fetch('/set_liked_movies', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ liked_movies: selected }),
            });
            const data = await response.json();
            if (data.success === true) {
              router.push('/home');
            }
            // Optionally, handle success (e.g., navigate or show a message)
          } catch (error) {
            // Optionally, handle error
            console.error('Failed to like movies:', error);
          }
        }}
      >
        Done{ ' ' +selected.length + "/5"}
      </button>
    </main>
  );
}
