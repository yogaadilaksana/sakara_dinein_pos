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
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="ADMIN">Admin</option>
            <option value="CASHIER">Cashier</option>
            {/* Add other roles as needed */}
          </select>
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      

    </div>
  );
}
