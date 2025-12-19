"use client"
import { useRouter } from 'next/navigation';
import { ArrowRight } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const Navigate = useRouter();;
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 cursor-pointer">
      <img
        src="/file.svg"
        onClick={() => Navigate.push('/signin')}
        alt=""
        className="w-20 sm:w-10 cursor-pointer"
      />

      {user ? (
        <UserButton />
        ) : (
        <button onClick={() => openSignIn()} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5">
          Get started
          <ArrowRight className="w-4 h-4" />{" "}
        </button>
      )}
    </nav>
  );
};

export default Navbar;