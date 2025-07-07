"use client"
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import '../app/globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default  function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  return (
    <header className="bg-[#1a1312] w-full">
      <div className='h-16 flex items-center justify-between px-6'>
        {/* Left side: Logo and nav links */}
        <div className='flex items-center gap-10'>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-white text-lg" />
            <span className="text-xl font-bold text-white">MovieMatch</span>
          </Link>
          {/* Nav links */}
          <ul className='flex gap-6 text-sm text-white/80'>
            <li>
              <Link href="/home" className="hover:text-white cursor-pointer">Home</Link>
            </li>
            <li>
              <Link href="/movies" className="hover:text-white cursor-pointer">Movies</Link>
            </li>
           
            <li className="hover:text-white cursor-pointer">
              <Link href="/liked" className="hover:text-white cursor-pointer">Liked</Link>
              </li>
            <li className="hover:text-white cursor-pointer">Watched </li>
            <li className="hover:text-white cursor-pointer">Watch List </li>
          </ul>
        </div>
        {/* Right side: Search bar and avatar */}
        <div className='flex items-center gap-4'>
          {/* Search bar */}
          <div className="relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              <button
                type="submit"
                className="focus:outline-none"
                aria-label="Search"
                style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                tabIndex={0}
                onClick={()=>{
                  if(search !== ""){router.push('/search/'+search)}
                 
                }}
                 
                  
              >
                <FaSearch />
              </button>
            </span>
            <input
            value={search}
           onChange={(e)=>{setSearch(e.target.value)}}
              type="text"
              placeholder="Search"
              className="bg-white/10 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none placeholder:text-white/50 w-56"
            />
            
          </div>
          {/* Avatar */}
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-white object-cover"
          />
        </div>
      </div>
    </header>
  );
}
