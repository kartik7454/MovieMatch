'use client'
import React from "react";
import { useRouter } from 'next/navigation'
export default function MovieBanner(props) {
  const router = useRouter()
  return (
    <div
    // key={item.id}
    className="relative bg-[#23272b] rounded-xl shadow-lg p-3 w-48 mx-auto cursor-pointer"
    onClick={() => router.push(`/movies/${props.id}`)  }/*toggles button */
  >
 
    
    <img
      src={"https://image.tmdb.org/t/p/w500/" + props.poster_path}
      alt={props.title}
      className="rounded-lg w-full h-64 object-cover"
      loading="lazy"
    />
    <h2 className="text-white text-lg font-semibold mt-2 truncate whitespace-nowrap overflow-hidden">
      {props.title}
    </h2>
  </div>
  );
}
