"use client";

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  isActive: boolean;
  createdAt: string;
  slug: string;
}

export default function AdminChallenges() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('user');

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (isLoaded && !user) {
        router.push('/sign-in');
        return;
      }

      if (user) {
        try {
          const token = await getToken();
          
          // Check user role first
          const userResponse = await fetch('http://localhost:3001/user/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserRole(userData.user.role);
            
            if (userData.user.role !== 'admin') {
              router.push('/challenges');
              return;
            }
            
            // If admin, fetch challenges
            await fetchChallenges();
          }
        } catch (error) {
          console.error('Error checking admin access:', error);
          router.push('/challenges');
        }
      }
    };

    checkAdminAndFetch();
  }, [user, isLoaded, router]);

  const fetchChallenges = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3001/admin/challenges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChallengeStatus = async (challengeId: string, currentStatus: boolean) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3001/admin/challenges/${challengeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchChallenges(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3001/admin/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchChallenges(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const difficultyColors = {
    Easy: 'bg-green-600',
    Medium: 'bg-yellow-600',
    Hard: 'bg-red-600'
  };

  if (!isLoaded || loading) {
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
              <h1 className="text-2xl font-bold">Manage Challenges</h1>
              <p className="text-gray-400">Create, edit, and manage coding challenges</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/challenges/new"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Challenge
              </Link>
              <Link
                href="/admin"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No challenges found</p>
            <Link
              href="/admin/challenges/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Challenge
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge._id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{challenge.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${difficultyColors[challenge.difficulty]}`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm text-gray-400">{challenge.category}</span>
                      {challenge.isActive ? (
                        <span className="bg-green-600 px-2 py-1 rounded text-xs">Active</span>
                      ) : (
                        <span className="bg-gray-600 px-2 py-1 rounded text-xs">Inactive</span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{challenge.description}</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(challenge.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleChallengeStatus(challenge._id, challenge.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        challenge.isActive 
                          ? 'bg-yellow-600 hover:bg-yellow-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      title={challenge.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {challenge.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    
                    <Link
                      href={`/admin/challenges/${challenge._id}/edit`}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => deleteChallenge(challenge._id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}