"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  slug: string;
  tags: string[];
  createdAt: string;
}

const difficultyColors = {
  Easy: "bg-green-600",
  Medium: "bg-yellow-600",
  Hard: "bg-red-600",
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('user');
  const [filter, setFilter] = useState({
    difficulty: '',
    category: ''
  });
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initializePage = async () => {
      if (!user) {
        router.push("/Login");
        return;
      }

      // Check user role
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

      await fetchChallenges();
    };

    initializePage();
  }, [user, router, getToken]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("http://localhost:3001/challenges");
      const data = await response.json();
      
      // The backend already filters for active challenges
      const allChallenges = data.challenges || [];
      setChallenges(allChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (filter.difficulty && challenge.difficulty !== filter.difficulty) return false;
    if (filter.category && challenge.category !== filter.category) return false;
    return true;
  });

  const categories = [...new Set(challenges.map(c => c.category))];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Coding Challenges</h1>
              <p className="text-gray-400 text-lg">
                Practice your Solidity skills with these curated challenges
              </p>
            </div>
            
            {/* Admin Link - Only show for admins */}
            {user && userRole === 'admin' && (
              <Link
                href="/admin"
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                Admin Panel →
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={filter.difficulty}
              onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>

            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {(filter.difficulty || filter.category) && (
              <button
                onClick={() => setFilter({ difficulty: '', category: '' })}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                {challenges.length === 0 ? 'No challenges available yet' : 'No challenges match your filters'}
              </p>
              {challenges.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Check back later or contact an admin to add challenges
                </p>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => (
                <Link
                  key={challenge._id}
                  href={`/challenge/${challenge.slug}`}
                  className="block bg-gray-800 border-2 border-gray-700 rounded-xl p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold">{challenge.title}</h2>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColors[challenge.difficulty]}`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-3">{challenge.description}</p>
                  
                  {/* Tags */}
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {challenge.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {challenge.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">+{challenge.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{challenge.category}</span>
                    <span className="text-blue-400 font-semibold">Start →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

