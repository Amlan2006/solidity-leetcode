"use client";

import { useState } from "react";
import Link from "next/link";
import CodeEditor from "../../../components/CodeEditor";

const INITIAL_CODE = `function isAnagram(string memory s, string memory t) public pure returns (bool) {
    // Your code here
    // Return true if t is an anagram of s, and false otherwise
    // An Anagram is a word or phrase formed by rearranging the letters
    // of a different word or phrase, typically using all the original letters exactly once
}`;

export default function ValidAnagramChallenge() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [result, setResult] = useState<{ success: boolean; output: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, challenge: "valid-anagram" }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        output: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/challenges"
            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            ← All Challenges
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-2">LeetCode for Solidity</h1>
        <p className="text-gray-400 mb-8">Challenge: Valid Anagram</p>
        
        <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">4. Valid Anagram</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Given two strings <code className="bg-gray-700 px-2 py-1 rounded">s</code> and <code className="bg-gray-700 px-2 py-1 rounded">t</code>, return <code className="bg-gray-700 px-2 py-1 rounded">true</code> if <code className="bg-gray-700 px-2 py-1 rounded">t</code> is an anagram of <code className="bg-gray-700 px-2 py-1 rounded">s</code>, and <code className="bg-gray-700 px-2 py-1 rounded">false</code> otherwise.
            </p>
            <p>
              An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.
            </p>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">Example 1:</p>
              <pre className="bg-gray-700 p-3 rounded overflow-x-auto">
{`Input: s = "anagram", t = "nagaram"
Output: true`}
              </pre>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Example 2:</p>
              <pre className="bg-gray-700 p-3 rounded overflow-x-auto">
{`Input: s = "rat", t = "car"
Output: false`}
              </pre>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Constraints:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>1 ≤ s.length, t.length ≤ 5 * 10^4</li>
                <li>s and t consist of lowercase English letters.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Your Solution:</h3>
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <CodeEditor value={code} onChange={(value) => setCode(value ?? "")} />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-6"
        >
          {loading ? "Running Tests..." : "Submit"}
        </button>

        {result && (
          <div className={`mt-6 p-6 rounded-lg border ${result.success ? "bg-green-900/30 border-green-700" : "bg-red-900/30 border-red-700"}`}>
            <h3 className={`text-xl font-semibold mb-4 ${result.success ? "text-green-300" : "text-red-300"}`}>
              {result.success ? "✓ Tests Passed!" : "✗ Tests Failed"}
            </h3>
            <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm font-mono whitespace-pre-wrap border border-gray-700">
              {result.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

