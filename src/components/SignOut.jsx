"use client";

import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-md"
      onClick={() => signOut()}
    >
      Sign Out
    </button>
  );
}