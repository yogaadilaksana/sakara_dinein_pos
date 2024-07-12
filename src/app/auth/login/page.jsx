'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      const session = await fetch('/api/auth/session');
      const data = await session.json();
      const role = data.user.role;

      if (role === 'ADMIN') {
        router.push('/dashboard');
      } else if (role === 'CASHIER') {
        router.push('/');
      } else if (role === 'SUPER_ADMIN') {
        router.push('/auth/signup');
      }
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#40455F]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-2" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>     
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-2" />
          </div>  
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">Login</button>
        </form>
      </div>
    </div>
  );
}
