  "use client";
  import { useRouter } from 'next/navigation';
  import Image from "next/image";
  import { useEffect, useState } from 'react';
  import { useSession, signOut } from "next-auth/react";
  import SignIn from "../components/SignIn";

  import './globals.css';

  export default function Home() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [liked, setliked] = useState(false);

    //get user 
    useEffect(() => {

      const getUser = async () => {

        if (session?.user.email) {
          const res = await fetch(`/user?email=${session.user.email}`);
          const data = await res.json();
          console.log(data.liked_movies)
          if (data.liked_movies.length > 0) {
            router.push('/home');
          }
          else { setliked(true); }
        }
        else { setliked(true) }

      }
      //the thing i was doing wrong was session?.user.email is initially not set so it will fail but if i wait for loading then it works
      if (status !== "loading") { getUser() }

    }, [session])

    if (!liked) {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-300 to-slate-100 p-4">
          <div className="flex flex-col items-center justify-center">
            <svg className="animate-spin text-blue-600 h-10 w-10 mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-80" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4" />
            </svg>
            <div className="text-lg">Loading...</div>
          </div>
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
                  onClick={() => { router.push('/getStarted') }}
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