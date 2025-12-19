"use client"
import { useRouter } from 'next/navigation';
import { ArrowRight, Settings, Code } from "lucide-react";
import { useClerk, UserButton, useUser, useAuth } from "@clerk/nextjs";
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const Navigate = useRouter();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const token = await getToken();
          const response = await fetch('http://localhost:3001/user/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.user.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, [user, getToken]);

  return (
    <nav className="fixed z-50 w-full backdrop-blur-2xl bg-gray-900/80 border-b border-gray-800 flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32">
      <div className="flex items-center gap-8">
        <img
          src="/file.svg"
          onClick={() => Navigate.push('/')}
          alt="Logo"
          className="w-20 sm:w-10 cursor-pointer"
        />
        
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/challenges" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Challenges
            </Link>
            
            {userRole === 'admin' && (
              <Link 
                href="/admin" 
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
        )}
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          {userRole === 'admin' && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              Admin
            </span>
          )}
          <UserButton />
        </div>
      ) : (
        <button 
          onClick={() => openSignIn()} 
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 transition-colors"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  );
};

export default Navbar;