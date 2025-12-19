"use client";

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, TestTube } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface ChallengeForm {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    templateCode: string;
    testCode: string;
    tags: string;
}

export default function NewChallenge() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState<ChallengeForm>({
        title: '',
        description: '',
        difficulty: 'Easy',
        category: '',
        templateCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
    /**
     * @dev Given an array of integers nums and an integer target, 
     * return indices of the two numbers such that they add up to target.
     */
    function twoSum(uint[] memory nums, uint target) public pure returns (uint[2] memory) {
        {{USER_CODE}}
    }
}`,
        testCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Solution} from "../src/Solution.sol";

contract SolutionTest is Test {
    Solution solution;

    function setUp() public {
        solution = new Solution();
    }

    function test_TwoSum() public {
        uint[] memory nums = new uint[](4);
        nums[0] = 2;
        nums[1] = 7;
        nums[2] = 11;
        nums[3] = 15;
        
        uint target = 9;
        
        uint[2] memory result = solution.twoSum(nums, target);
        
        // Check that indices are valid
        assertTrue(result[0] < nums.length, "First index should be valid");
        assertTrue(result[1] < nums.length, "Second index should be valid");
        assertTrue(result[0] != result[1], "Indices should be different");
        
        // Verify the sum equals target
        assertTrue(nums[result[0]] + nums[result[1]] == target, "Sum should equal target");
    }
}`,
        tags: ''
    });

    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<any>(null);

    const [userRole, setUserRole] = useState<string>('user');

    useEffect(() => {
        const checkAdminAccess = async () => {
            if (isLoaded && !user) {
                router.push('/sign-in');
                return;
            }

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
                        
                        if (data.user.role !== 'admin') {
                            router.push('/challenges');
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error checking admin access:', error);
                    router.push('/challenges');
                }
            }
        };

        checkAdminAccess();
    }, [user, isLoaded, router, getToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();
            const response = await fetch('http://localhost:3001/admin/challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                })
            });

            if (response.ok) {
                router.push('/admin/challenges');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error creating challenge:', error);
            alert('Error creating challenge');
        } finally {
            setLoading(false);
        }
    };

    const testChallenge = async () => {
        setTesting(true);
        setTestResult(null);

        try {
            const token = await getToken();
            const response = await fetch('http://localhost:3001/admin/challenges/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    templateCode: form.templateCode,
                    testCode: form.testCode
                })
            });

            const result = await response.json();
            setTestResult(result);
        } catch (error) {
            console.error('Error testing challenge:', error);
            setTestResult({ success: false, error: 'Failed to test challenge' });
        } finally {
            setTesting(false);
        }
    };

    if (!isLoaded) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white">Loading...</div>
        </div>;
    }

    if (!user || userRole !== 'admin') {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-white">Access Denied - Admin Only</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Create New Challenge</h1>
                            <p className="text-gray-400">Add a new coding challenge to the platform</p>
                        </div>
                        <Link
                            href="/admin/challenges"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            ← Back to Challenges
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g., Array, String, Math"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Difficulty</label>
                                <select
                                    value={form.difficulty}
                                    onChange={(e) => setForm({ ...form, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={form.tags}
                                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g., loops, sorting, recursion"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    {/* Template Code */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">Template Code</h2>
                        <p className="text-gray-400 mb-4">
                            Use <code className="bg-gray-700 px-2 py-1 rounded">{'{{USER_CODE}}'}</code> as a placeholder for user code
                        </p>
                        <div className="border border-gray-600 rounded-lg overflow-hidden">
                            <Editor
                                height="300px"
                                defaultLanguage="solidity"
                                value={form.templateCode}
                                onChange={(value) => setForm({ ...form, templateCode: value || '' })}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                }}
                            />
                        </div>
                    </div>

                    {/* Test Code */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Test Code</h2>
                            <button
                                type="button"
                                onClick={testChallenge}
                                disabled={testing}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <TestTube className="h-4 w-4" />
                                {testing ? 'Testing...' : 'Test Challenge'}
                            </button>
                        </div>

                        <div className="border border-gray-600 rounded-lg overflow-hidden">
                            <Editor
                                height="400px"
                                defaultLanguage="solidity"
                                value={form.testCode}
                                onChange={(value) => setForm({ ...form, testCode: value || '' })}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                }}
                            />
                        </div>

                        {/* Test Results */}
                        {testResult && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Test Results:</h3>
                                <div className={`p-4 rounded-lg border ${testResult.success
                                    ? 'bg-green-900/20 border-green-700'
                                    : 'bg-red-900/20 border-red-700'
                                    }`}>
                                    <pre className="text-sm whitespace-pre-wrap">
                                        {testResult.output || testResult.error}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/challenges"
                            className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Save className="h-4 w-4" />
                            {loading ? 'Creating...' : 'Create Challenge'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}