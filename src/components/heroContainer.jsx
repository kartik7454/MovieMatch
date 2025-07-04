import React from "react";
import { FaSearch } from "react-icons/fa";
export default function HeroContainer() {
  return (
    <div className="min-h-screen flex pt-14 justify-center bg-[#231616]">
      <div className="bg-[#22303C] rounded-xl p-14 flex flex-col items-center w-[1100px] relative h-[450px]">
        <img
          src="/images/hero.webp"
          alt="Logo"
          className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-40 z-0"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center mb-4">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-white text-center mb-8 text-lg max-w-xl">
            Explore a vast library of films and find personalized recommendations based on your taste.
          </p>
          <form className="flex w-full max-w-xl">
            <div className="flex items-center bg-[#3A2323] rounded-l-full px-4 py-3 w-full">
              <FaSearch className="text-white mr-2" />
              <input
                type="text"
                placeholder="Search for movies"
                className="bg-transparent outline-none text-white w-full placeholder:text-gray-300"
              />
            </div>
            <button
              type="submit"
              className="bg-[#E7B6B6] text-[#3A2323] font-semibold px-6 py-3 rounded-r-full hover:bg-[#f3cccc] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
