"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          {/* Logo/Title */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            LeetCode for Solidity
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Master smart contract development through hands-on coding challenges
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Practice Solidity, test with Foundry, and level up your blockchain development skills
          </p>

          {/* CTA Button */}
          <Link
            href="/challenges"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Coding Challenges →
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-semibold mb-2">Code in Browser</h3>
            <p className="text-gray-400">
              Write Solidity code directly in your browser with syntax highlighting and IntelliSense support
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
            <p className="text-gray-400">
              Get immediate test results with Foundry. See what passes and what fails in real-time
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-pink-500 transition-colors">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Learn by Doing</h3>
            <p className="text-gray-400">
              Practice real-world Solidity patterns and algorithms through curated coding challenges
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose a Challenge</h3>
                <p className="text-gray-400">
                  Browse through our collection of Solidity coding challenges, from beginner to advanced
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Write Your Solution</h3>
                <p className="text-gray-400">
                  Use the Monaco editor to write your Solidity code. The editor provides syntax highlighting and code completion
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Submit & Test</h3>
                <p className="text-gray-400">
                  Click submit to run your code against our Foundry test suite. Get instant feedback on whether your solution works
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-8">Built With</h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <div className="bg-gray-800/50 px-6 py-3 rounded-lg border border-gray-700">
              <span className="font-semibold text-white">Next.js</span> + React
            </div>
            <div className="bg-gray-800/50 px-6 py-3 rounded-lg border border-gray-700">
              <span className="font-semibold text-white">Solidity</span> Smart Contracts
            </div>
            <div className="bg-gray-800/50 px-6 py-3 rounded-lg border border-gray-700">
              <span className="font-semibold text-white">Foundry</span> Testing Framework
            </div>
            <div className="bg-gray-800/50 px-6 py-3 rounded-lg border border-gray-700">
              <span className="font-semibold text-white">Monaco</span> Editor
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-8">Jump into your first Solidity challenge now</p>
          <Link
            href="/challenges"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Challenges →
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
