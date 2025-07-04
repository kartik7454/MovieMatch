"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-md"
      onClick={() => signIn("google")}
    >
      Sign In with Google
    </button>
  );
}