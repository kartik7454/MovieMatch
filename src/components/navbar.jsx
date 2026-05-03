"use client";
import { FaMapMarkerAlt, FaSearch, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import "../app/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  return (
    <header className="bg-[#231616] w-full shadow-lg sticky top-0 z-40">
      <div className="h-20 flex items-center justify-between px-8 lg:px-16">
        {/* Left side: Logo and nav links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <FaMapMarkerAlt className="text-rose-400 text-2xl drop-shadow-glow group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-extrabold text-white tracking-widest drop-shadow title-shadow">
              Movie<span className="text-rose-400">Match</span>
            </span>
          </Link>
          {/* Nav links */}
          <ul className="flex gap-8 text-base font-medium">
            <li>
              <Link
                href="/home"
                className="text-white/80 hover:bg-rose-400/20 hover:text-rose-100 px-3 py-2 rounded-lg transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/movies"
                className="text-white/80 hover:bg-rose-400/20 hover:text-rose-100 px-3 py-2 rounded-lg transition"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                href="/liked"
                className="text-white/80 hover:bg-rose-400/20 hover:text-rose-100 px-3 py-2 rounded-lg transition"
              >
                Liked
              </Link>
            </li>
            <li>
              <Link
                href="/watched"
                className="text-white/80 hover:bg-rose-400/20 hover:text-rose-100 px-3 py-2 rounded-lg transition"
              >
                Watched
              </Link>
            </li>
            <li>
              <Link
                href="/watchlist"
                className="text-white/80 hover:bg-rose-400/20 hover:text-rose-100 px-3 py-2 rounded-lg transition"
              >
                Watch List
              </Link>
            </li>
          </ul>
        </div>

        {/* Right side: Search bar, avatar, and logout */}
        <div className="flex items-center gap-6">
          {/* Search bar */}
          <div className="relative group">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search movies..."
              className="bg-white/10 text-white rounded-full pl-12 pr-4 py-2 focus:outline-none placeholder:text-white/60 w-56 shadow-inner border-2 border-transparent focus:border-rose-400 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim() !== "") {
                  router.push("/search/" + encodeURIComponent(search.trim()));
                }
              }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-rose-400">
              <FaSearch className="pointer-events-none" />
            </span>
            <button
              type="submit"
              aria-label="Search"
              tabIndex={0}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-rose-400 transition focus:outline-none"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                if (search.trim() !== "") {
                  router.push("/search/" + encodeURIComponent(search.trim()));
                }
              }}
            >
              <FaSearch />
            </button>
          </div>

          {/* Avatar */}
         

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="bg-rose-700 hover:bg-rose-800 text-white px-5 py-2 rounded-full shadow-lg font-semibold ml-2 transition-colors border-b-4 border-rose-900 focus:outline-none active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
      {/* decorative bottom line */}
      <div className="h-[3px] w-full bg-neutral-700/80" />
    </header>
  );
}
