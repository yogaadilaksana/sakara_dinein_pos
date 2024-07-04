'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Role } from '@prisma/client';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (response.ok) {
        router.push('/auth/login'); // Redirect to the login page after successful sign up
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#40455F]">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center">SIGN UP</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-2"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-2"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-2"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-2"
          >
            <option value="CASHIER">Cashier</option>
            <option value="ADMIN">Admin</option>         
          </select>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">Sign Up</button>
      </form>
    </div>
  </div>
);
}
