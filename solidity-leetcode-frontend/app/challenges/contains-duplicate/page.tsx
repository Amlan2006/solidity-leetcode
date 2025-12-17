"use client";

import { useState } from "react";
import Link from "next/link";
import CodeEditor from "../../../components/CodeEditor";

const INITIAL_CODE = `function containsDuplicate(uint[] memory nums) public pure returns (bool) {
    // Your code here
    // Return true if any value appears at least twice in the array
    // Return false if every element is distinct
}`;

export default function ContainsDuplicateChallenge() {
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
        body: JSON.stringify({ code, challenge: "contains-duplicate" }),
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
        <p className="text-gray-400 mb-8">Challenge: Contains Duplicate</p>
        
        <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">3. Contains Duplicate</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Given an integer array <code className="bg-gray-700 px-2 py-1 rounded">nums</code>, return <code className="bg-gray-700 px-2 py-1 rounded">true</code> if any value appears <strong>at least twice</strong> in the array, and return <code className="bg-gray-700 px-2 py-1 rounded">false</code> if every element is distinct.
            </p>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">Example 1:</p>
              <pre className="bg-gray-700 p-3 rounded overflow-x-auto">
{`Input: nums = [1,2,3,1]
Output: true`}
              </pre>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Example 2:</p>
              <pre className="bg-gray-700 p-3 rounded overflow-x-auto">
{`Input: nums = [1,2,3,4]
Output: false`}
              </pre>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Example 3:</p>
              <pre className="bg-gray-700 p-3 rounded overflow-x-auto">
{`Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true`}
              </pre>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2">Constraints:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>1 ≤ nums.length ≤ 100</li>
                <li>-10^9 ≤ nums[i] ≤ 10^9</li>
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

