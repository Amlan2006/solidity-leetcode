"use client";

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Settings, Users, BarChart3 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalSubmissions: 0,
    totalUsers: 0
  });

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
          return;
        }
      }
      setLoading(false);
    };

    checkAdminAccess();
  }, [user, isLoaded, router, getToken]);

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
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">Manage challenges and monitor platform</p>
            </div>
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Platform
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Challenges</p>
                <p className="text-2xl font-bold">{stats.totalChallenges}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Challenges</p>
                <p className="text-2xl font-bold">{stats.activeChallenges}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/challenges/new"
            className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Create Challenge</h3>
                <p className="text-blue-100">Add a new coding challenge</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/challenges"
            className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105"
          >
            <div className="flex items-center">
              <Settings className="h-8 w-8" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Manage Challenges</h3>
                <p className="text-purple-100">Edit existing challenges</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-green-100">Manage user roles</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <p className="text-gray-400">Recent activity will be displayed here...</p>
          </div>
        </div>
      </div>
    </div>
  );
}