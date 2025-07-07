"use client";
import Trending from "@/components/trending";
import NowPlaying from "@/components/nowplaying";


import HeroContainer from "@/components/heroContainer";

export default function Home() {
  return (

    <div>
        <div>
            <HeroContainer />
        </div>
        <div>
          <Trending />
        </div>
        <div>
          <NowPlaying />
        </div>
    </div>
    
  );
}
