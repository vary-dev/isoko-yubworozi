"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBF9] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-isoko-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <i className="fa-solid fa-seedling text-isoko-accent text-2xl"></i>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-isoko-dark">ISOKO</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-1">Command Center Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-isoko-dark mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-400 mb-8">Sign in to manage your farming platform</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@isoko.rw"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-isoko-accent transition font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-isoko-accent transition font-bold text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold p-4 rounded-xl">
                <i className="fa-solid fa-exclamation-circle mr-2"></i>{error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-isoko-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-isoko-primary transition shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 font-bold">
          Isoko y&apos;Ubworozi &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
