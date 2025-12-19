"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useAuth } from '@clerk/nextjs';
import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";

interface Challenge {
    _id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    category: string;
    slug: string;
    tags: string[];
    templateCode: string;
}

interface Submission {
    _id: string;
    status: 'passed' | 'failed' | 'error';
    createdAt: string;
    executionTime: number;
}

const difficultyColors = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
};

export default function ChallengePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            router.push("/Login");
            return;
        }

        if (params.slug) {
            fetchChallenge();
            fetchSubmissions();
        }
    }, [params.slug, user, router]);

    const fetchChallenge = async () => {
        try {
            const response = await fetch(`http://localhost:3001/challenges/${params.slug}`);
            if (response.ok) {
                const data = await response.json();
                setChallenge(data.challenge);

                // Show the full template with a helpful placeholder instead of {{USER_CODE}}
                const template = data.challenge.templateCode;
                if (template.includes('{{USER_CODE}}')) {
                    const initialCode = template.replace('{{USER_CODE}}', '// Write your solution here\n        ');
                    setCode(initialCode);
                } else {
                    setCode(template);
                }
            } else {
                router.push("/challenges");
            }
        } catch (error) {
            console.error('Error fetching challenge:', error);
            router.push("/challenges");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const token = await getToken();
            const response = await fetch(`http://localhost:3001/challenges/${params.slug}/submissions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSubmissions(data.submissions || []);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            alert("Please write some code before submitting!");
            return;
        }

        setSubmitting(true);
        setResult(null);

        try {
            const token = await getToken();
            const response = await fetch(`http://localhost:3001/challenges/${params.slug}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();
            setResult(data);

            // Refresh submissions
            fetchSubmissions();
        } catch (error) {
            console.error("Submission error:", error);
            setResult({
                success: false,
                output: "Network error occurred. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading challenge...</div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">Challenge Not Found</h1>
                    <Link href="/challenges" className="text-blue-400 hover:text-blue-300">
                        ← Back to Challenges
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/challenges"
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                ← Back to Challenges
                            </Link>
                            <div className="h-6 w-px bg-gray-600"></div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-bold">{challenge.title}</h1>
                                <span className={`text-sm font-semibold ${difficultyColors[challenge.difficulty]}`}>
                                    {challenge.difficulty}
                                </span>
                                <span className="text-sm text-gray-400">{challenge.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
                    {/* Problem Description */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-4">{challenge.title}</h2>

                            {/* Tags */}
                            {challenge.tags && challenge.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {challenge.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                                    {challenge.description}
                                </div>
                            </div>
                        </div>

                        {/* Recent Submissions */}
                        {submissions.length > 0 && (
                            <div className="border-t border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Your Recent Submissions</h3>
                                <div className="space-y-2">
                                    {submissions.slice(0, 5).map((submission) => (
                                        <div
                                            key={submission._id}
                                            className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`w-3 h-3 rounded-full ${submission.status === 'passed'
                                                        ? 'bg-green-500'
                                                        : submission.status === 'failed'
                                                            ? 'bg-red-500'
                                                            : 'bg-yellow-500'
                                                        }`}
                                                ></span>
                                                <span className="text-sm">
                                                    {submission.status === 'passed' ? 'Passed' :
                                                        submission.status === 'failed' ? 'Failed' : 'Error'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {new Date(submission.createdAt).toLocaleString()}
                                                {submission.executionTime && (
                                                    <span className="ml-2">({submission.executionTime}ms)</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Code Editor */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Solution</h3>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-6 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    {submitting ? "Running..." : "Submit"}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0">
                            <CodeEditor
                                value={code}
                                onChange={(value) => setCode(value || "")}
                            />
                        </div>

                        {/* Results */}
                        {result && (
                            <div className="border-t border-gray-700 p-4">
                                <div
                                    className={`p-4 rounded-lg border ${result.success
                                        ? "bg-green-900/20 border-green-700"
                                        : "bg-red-900/20 border-red-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`w-3 h-3 rounded-full ${result.success ? "bg-green-500" : "bg-red-500"
                                                }`}
                                        ></span>
                                        <span className="font-semibold">
                                            {result.success ? "All Tests Passed!" : "Tests Failed"}
                                        </span>
                                        {result.executionTime && (
                                            <span className="text-sm text-gray-400">
                                                ({result.executionTime}ms)
                                            </span>
                                        )}
                                    </div>
                                    <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                                        {result.output}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}