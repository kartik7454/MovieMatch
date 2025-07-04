"use client";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import SignIn from "../components/SignIn";

import './globals.css';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-300 to-slate-100 p-4">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-300 to-slate-100 p-4">
      <section className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full">
        <Image
          src="/favicon.ico"
          alt="Movie Match Logo"
          width={64}
          height={64}
          className="mb-4 rounded-full border-2 border-black"
        />
        <h1 className="text-4xl font-bold mb-2 text-slate-800 text-center">Welcome to MovieMatch!</h1>
        
        {session ? (
          <>
            <div className="text-center mb-6">
              <p className="text-lg text-slate-600 mb-2">
                Welcome back, {session.user?.name}!
              </p>
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full mx-auto mb-2"
                />
              )}
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-md"
                onClick={()=>{router.push('/getStarted')}}
              >
                Get Started
              </button>
              <button
                onClick={() => signOut()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-md"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg text-slate-600 mb-6 text-center">
              Select the movies you have watched and liked, and get personalized recommendations for what to watch next.
            </p>
            <SignIn />
          </>
        )}
      </section>
    </main>
  );
}