"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Find two indices in an array that sum to a target value.",
    difficulty: "Easy",
    category: "Array",
  },
  {
    id: "reverse-array",
    title: "Reverse Array",
    description: "Reverse the elements of an array in-place or return a new reversed array.",
    difficulty: "Easy",
    category: "Array",
  },
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    description: "Determine if an array contains any duplicate values.",
    difficulty: "Easy",
    category: "Array",
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    description: "Determine if two strings are anagrams of each other.",
    difficulty: "Easy",
    category: "String",
  },
];

const difficultyColors = {
  Easy: "bg-green-600",
  Medium: "bg-yellow-600",
  Hard: "bg-red-600",
};

export default function ChallengesPage() {
  const [availableChallenges, setAvailableChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/challenges")
      .then((res) => res.json())
      .then((data) => {
        setAvailableChallenges(data.challenges || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const isAvailable = (challengeId: string) => {
    return availableChallenges.length === 0 || availableChallenges.includes(challengeId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">Coding Challenges</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Practice your Solidity skills with these curated challenges
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading challenges...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CHALLENGES.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className={`block bg-gray-800 border-2 rounded-xl p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 ${
                  isAvailable(challenge.id)
                    ? "border-gray-700 cursor-pointer"
                    : "border-gray-800 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold">{challenge.title}</h2>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColors[challenge.difficulty]}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{challenge.category}</span>
                  {isAvailable(challenge.id) ? (
                    <span className="text-blue-400 font-semibold">Start →</span>
                  ) : (
                    <span className="text-gray-600 text-sm">Coming soon</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

