'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-white">
      <nav className="fixed top-0 left-0 right-0 bg-soft-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-calm-teal">
              DAsh
            </Link>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg font-semibold text-calm-teal hover:bg-calm-teal hover:bg-opacity-10 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-deep-charcoal mb-2">Login</h1>
          <p className="text-gray-600 mb-6">Enter your credentials to continue.</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-deep-charcoal mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-teal focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-deep-charcoal mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-calm-teal focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-w-[140px] px-6 py-3 rounded-lg font-semibold bg-calm-teal text-white hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
              <Link
                href="/register"
                className="flex-1 min-w-[140px] px-6 py-3 rounded-lg font-semibold border-2 border-calm-teal text-calm-teal hover:bg-calm-teal hover:text-white transition-colors text-center"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
