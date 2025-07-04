"use client";
import Navbar from "@/components/navbar";
import { usePathname } from 'next/navigation';


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/getStarted');
  return (
    <div className="home-layout">
      
      <main >
      {!hideNavbar && <Navbar />}
      {children}
      </main>
      
      
    </div>
  )
} 